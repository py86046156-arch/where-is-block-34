/**
 * Geographic Walking Route Service for Campus Navigator
 * 
 * Uses OpenStreetMap foot network via OSRM pedestrian routing
 * to compute real sidewalk, road, and campus footpath routes with
 * turn-by-turn maneuvers, accurate distance, and walking duration.
 * 
 * Falls back gracefully to the verified campus graph Dijkstra algorithm
 * if offline or in case of network timeout.
 */

// Simple in-memory cache to avoid repeated network requests
const routeCache = new Map();

/**
 * Fetch real pedestrian walking route between two geographic coordinates
 * @param {Object} startCoords - { lat, lng }
 * @param {Object} destCoords - { lat, lng }
 * @param {Object} options - { timeoutMs }
 * @returns {Promise<Object>}
 */
export async function fetchPedestrianRoute(startCoords, destCoords, options = {}) {
  if (!startCoords?.lat || !startCoords?.lng || !destCoords?.lat || !destCoords?.lng) {
    return { success: false, reason: 'missing_coordinates' };
  }

  const cacheKey = `${startCoords.lat.toFixed(5)},${startCoords.lng.toFixed(5)}->${destCoords.lat.toFixed(5)},${destCoords.lng.toFixed(5)}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey);
  }

  const timeoutMs = options.timeoutMs || 4000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const baseUrl = import.meta.env.VITE_OSRM_FOOT_ROUTING_URL || 'https://router.project-osrm.org/route/v1/foot';
  const url = `${baseUrl}/${startCoords.lng},${startCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson&steps=true`;

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM HTTP status ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error(`OSRM error code: ${data.code}`);
    }

    const primaryRoute = data.routes[0];
    
    // GeoJSON coordinates are [longitude, latitude], Leaflet needs [latitude, longitude]
    const coordinates = primaryRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);

    // Parse step-by-step pedestrian instructions
    const steps = [];
    if (primaryRoute.legs && primaryRoute.legs[0] && primaryRoute.legs[0].steps) {
      primaryRoute.legs[0].steps.forEach((step, idx) => {
        let instruction = '';
        const maneuver = step.maneuver;
        const streetName = step.name || 'Campus Pathway';

        if (maneuver.type === 'depart') {
          instruction = `Start walking along ${streetName}`;
        } else if (maneuver.type === 'arrive') {
          instruction = `Arrive at your campus destination`;
        } else if (maneuver.type === 'turn') {
          const modifier = maneuver.modifier ? maneuver.modifier.replace('-', ' ') : '';
          instruction = `Turn ${modifier} onto ${streetName}`;
        } else if (maneuver.type === 'roundabout' || maneuver.type === 'rotary') {
          instruction = `Enter roundabout and take exit onto ${streetName}`;
        } else {
          const typeStr = maneuver.type ? maneuver.type.replace('-', ' ') : 'Continue';
          instruction = `${typeStr.charAt(0).toUpperCase() + typeStr.slice(1)} along ${streetName}`;
        }

        steps.push({
          stepNumber: idx + 1,
          instruction,
          distance: Math.round(step.distance),
          durationSeconds: Math.round(step.duration),
          type: maneuver.type || 'continue',
          modifier: maneuver.modifier || 'straight',
        });
      });
    }

    const result = {
      success: true,
      provider: 'OpenStreetMap Foot Network (OSRM)',
      isRealGeoRoute: true,
      coordinates, // Array of [lat, lng]
      totalDistance: Math.round(primaryRoute.distance), // meters
      estimatedMinutes: Math.max(1, Math.round(primaryRoute.duration / 60)), // minutes
      steps,
    };

    routeCache.set(cacheKey, result);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      reason: err.name === 'AbortError' ? 'timeout' : 'network_error',
      error: err.message,
    };
  }
}
