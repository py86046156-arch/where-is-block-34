import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  Layers, 
  Navigation, 
  MapPin, 
  Sparkles,
  Info,
  X
} from 'lucide-react';

// Tile provider configurations (configurable via .env)
const TILE_LAYERS = {
  positron: {
    name: 'Clean Light',
    url: import.meta.env.VITE_CARTO_LIGHT_TILE_URL || 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  },
  osm: {
    name: 'OpenStreetMap',
    url: import.meta.env.VITE_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
  },
};

// Verified LPU Main Campus center
const LPU_CAMPUS_CENTER = [31.25492, 75.70462];
const DEFAULT_ZOOM = 16;

export default function CampusMap({
  nodes = [],
  edges = [],
  startNodeId,
  destinationNodeId,
  activeRoute = null,
  geoRouteCoordinates = null,
  onSelectNode,
  onSetStart,
  onSetDestination,
  selectedRoom = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const activePopupRef = useRef(null);

  const [activeLayerKey, setActiveLayerKey] = useState('positron');
  const [showLayerPicker, setShowLayerPicker] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center: LPU_CAMPUS_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 13,
      maxZoom: 19,
      zoomControl: false, // We render our own floating UI controls
      attributionControl: false,
    });

    // Add Base Tile Layer
    const layerConfig = TILE_LAYERS[activeLayerKey];
    tileLayerRef.current = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      subdomains: layerConfig.subdomains || 'abc',
      maxZoom: layerConfig.maxZoom || 19,
    }).addTo(map);

    // Add Subtle Leaflet Attribution Control
    L.control.attribution({
      position: 'bottomright',
      prefix: false,
    }).addTo(map);

    // Create layer groups for markers and routes
    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Invalidate map size after animation frames
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when user toggles style
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const layerConfig = TILE_LAYERS[activeLayerKey];
    if (!layerConfig) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      subdomains: layerConfig.subdomains || 'abc',
      maxZoom: layerConfig.maxZoom || 19,
    }).addTo(mapInstanceRef.current);
  }, [activeLayerKey]);

  // Handle Zoom In / Zoom Out / Reset
  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  }, []);

  const handleResetView = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(LPU_CAMPUS_CENTER, DEFAULT_ZOOM, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, []);

  // Render Custom Campus Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    nodes.forEach((node) => {
      if (!node.lat || !node.lng) return;

      const isStart = node.id === startNodeId;
      const isDestination = node.id === destinationNodeId;
      const isHero = node.id === 'block-34' || node.isHeroBlock;

      let iconHtml = '';
      let iconSize = [36, 36];
      let iconAnchor = [18, 18];

      if (isDestination) {
        // Prominent Destination Marker
        iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <span class="absolute -top-1 -right-1 flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-purple-600"></span>
            </span>
            <div class="px-2.5 py-1 bg-[#635BFF] text-white text-[11px] font-black rounded-full shadow-xl border-2 border-white flex items-center gap-1.5 transform hover:scale-110 transition-transform">
              <span class="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
              <span>DEST: ${node.code}</span>
            </div>
            <div class="w-2 h-2 bg-[#635BFF] rotate-45 -mt-1 mx-auto border-r border-b border-white"></div>
          </div>
        `;
        iconSize = [90, 40];
        iconAnchor = [45, 36];
      } else if (isStart) {
        // Start Marker
        iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <span class="absolute -top-1 -right-1 flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-600"></span>
            </span>
            <div class="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-black rounded-full shadow-xl border-2 border-white flex items-center gap-1.5 transform hover:scale-110 transition-transform">
              <span class="w-2 h-2 rounded-full bg-white"></span>
              <span>START: ${node.code}</span>
            </div>
            <div class="w-2 h-2 bg-emerald-600 rotate-45 -mt-1 mx-auto border-r border-b border-white"></div>
          </div>
        `;
        iconSize = [90, 40];
        iconAnchor = [45, 36];
      } else if (isHero) {
        // Hero Block 34 Marker
        iconHtml = `
          <div class="relative flex flex-col items-center cursor-pointer group">
            <div class="px-2.5 py-1 bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white text-xs font-black rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 ring-2 ring-purple-300/60 transform hover:scale-110 transition-transform">
              <span class="text-amber-300 text-[10px]">★</span>
              <span>Block 34</span>
            </div>
            <div class="w-1.5 h-1.5 bg-[#635BFF] rotate-45 -mt-0.5 border-r border-b border-white"></div>
          </div>
        `;
        iconSize = [85, 32];
        iconAnchor = [42, 28];
      } else if (node.category === 'gate') {
        // Gate Marker
        iconHtml = `
          <div class="relative flex flex-col items-center cursor-pointer group">
            <div class="px-2 py-0.5 bg-emerald-700 text-white text-[11px] font-bold rounded-full shadow-md border border-white flex items-center gap-1 hover:bg-emerald-800 transition-colors">
              <span class="text-[9px] opacity-80">🚪</span>
              <span>${node.code}</span>
            </div>
          </div>
        `;
        iconSize = [48, 26];
        iconAnchor = [24, 13];
      } else if (node.category === 'block') {
        // Standard Academic Block
        iconHtml = `
          <div class="relative flex flex-col items-center cursor-pointer group">
            <div class="px-2 py-0.5 bg-white text-[#635BFF] text-[11px] font-black rounded-full shadow-md border-2 border-[#635BFF] hover:bg-[#F3F0FF] hover:scale-105 transition-all">
              <span>${node.code}</span>
            </div>
          </div>
        `;
        iconSize = [38, 26];
        iconAnchor = [19, 13];
      } else {
        // Landmark / Amenity Marker
        const isMall = node.id === 'block-25';
        const isLib = node.id === 'block-28';
        const isHosp = node.id === 'landmark-hospital';
        const badgeBg = isMall ? 'bg-emerald-600' : isLib ? 'bg-sky-600' : isHosp ? 'bg-rose-600' : 'bg-slate-800';
        const iconChar = isMall ? '🛍️' : isLib ? '📚' : isHosp ? '🏥' : '📍';

        iconHtml = `
          <div class="relative flex flex-col items-center cursor-pointer group">
            <div class="px-2 py-0.5 ${badgeBg} text-white text-[10px] font-bold rounded-full shadow-md border border-white flex items-center gap-1 hover:opacity-95 transition-all">
              <span class="text-[9px]">${iconChar}</span>
              <span class="max-w-[80px] truncate">${node.code}</span>
            </div>
          </div>
        `;
        iconSize = [60, 26];
        iconAnchor = [30, 13];
      }

      const customIcon = L.divIcon({
        className: 'campus-custom-marker',
        html: iconHtml,
        iconSize,
        iconAnchor,
        popupAnchor: [0, -iconAnchor[1] - 4],
      });

      const marker = L.marker([node.lat, node.lng], {
        icon: customIcon,
        title: node.name,
      });

      // Interactive Popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-900';
      popupContent.innerHTML = `
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                ${node.category.toUpperCase()} • ${node.zone || 'Campus'}
              </span>
              <h4 class="font-bold text-xs text-slate-900 mt-1 leading-snug">${node.name}</h4>
            </div>
          </div>
          <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2">${node.description || ''}</p>
          <div class="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
            <button id="btn-start-${node.id}" class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold text-center transition-colors">
              Set Start
            </button>
            <button id="btn-dest-${node.id}" class="px-2 py-1 bg-[#635BFF] hover:bg-[#5145E5] text-white rounded-lg text-[11px] font-semibold text-center transition-colors shadow-xs">
              Directions
            </button>
          </div>
        </div>
      `;

      // Attach button click listeners inside popup
      marker.bindPopup(popupContent, {
        maxWidth: 240,
        className: 'campus-leaflet-popup',
      });

      marker.on('popupopen', () => {
        const btnStart = document.getElementById(`btn-start-${node.id}`);
        const btnDest = document.getElementById(`btn-dest-${node.id}`);
        if (btnStart) {
          btnStart.onclick = (e) => {
            e.stopPropagation();
            if (onSetStart) onSetStart(node.id);
            marker.closePopup();
          };
        }
        if (btnDest) {
          btnDest.onclick = (e) => {
            e.stopPropagation();
            if (onSetDestination) onSetDestination(node.id);
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        if (onSelectNode) onSelectNode(node);
      });

      marker.addTo(markersLayerRef.current);
    });
  }, [nodes, startNodeId, destinationNodeId, onSelectNode, onSetStart, onSetDestination]);

  // Render Walking Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    // Determine coordinate polyline to draw:
    // 1. Direct geoRouteCoordinates from OSRM pedestrian routing
    // 2. Or fallback to Dijkstra campus path node coordinates
    let polylineCoords = null;

    if (geoRouteCoordinates && geoRouteCoordinates.length > 1) {
      polylineCoords = geoRouteCoordinates;
    } else if (activeRoute && activeRoute.path && activeRoute.path.length > 1) {
      const nodeMap = new Map(nodes.map(n => [n.id, n]));
      const coords = [];
      for (const nodeId of activeRoute.path) {
        const n = nodeMap.get(nodeId);
        if (n && n.lat && n.lng) {
          coords.push([n.lat, n.lng]);
        }
      }
      if (coords.length > 1) {
        polylineCoords = coords;
      }
    }

    if (polylineCoords && polylineCoords.length > 1) {
      // Background glow polyline
      const glowLine = L.polyline(polylineCoords, {
        color: '#c4b5fd',
        weight: 9,
        opacity: 0.5,
        lineCap: 'round',
        lineJoin: 'round',
      });

      // Main primary walking polyline
      const routeLine = L.polyline(polylineCoords, {
        color: '#635BFF',
        weight: 4.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '8, 6',
      });

      glowLine.addTo(routeLayerRef.current);
      routeLine.addTo(routeLayerRef.current);

      // Fit map viewport smoothly to show entire route with comfortable padding
      try {
        const bounds = routeLine.getBounds();
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [80, 80],
          maxZoom: 17,
        });
      } catch (e) {
        // Ignore bounds error if collapsed
      }
    }
  }, [geoRouteCoordinates, activeRoute, nodes]);

  // Fly to destination when changed
  useEffect(() => {
    if (!destinationNodeId || !mapInstanceRef.current) return;
    const dest = nodes.find(n => n.id === destinationNodeId);
    if (dest && dest.lat && dest.lng && !activeRoute) {
      mapInstanceRef.current.flyTo([dest.lat, dest.lng], 17, {
        duration: 1.0,
      });
    }
  }, [destinationNodeId, nodes, activeRoute]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-100">
      
      {/* Real Leaflet Interactive Geographic Canvas */}
      <div 
        ref={mapContainerRef} 
        id="campus-geographic-map" 
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing focus:outline-none"
        style={{ minHeight: '100%' }}
      />

      {/* FLOATING TOP-RIGHT CONTROLS (Google Maps / QuickVet Style) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        
        {/* Layer Switcher & Compass Row */}
        <div className="flex items-center gap-2">
          
          {/* Compass / Recenter Indicator */}
          <button
            onClick={handleResetView}
            className="w-10 h-10 bg-white/95 backdrop-blur-xl border border-[#E8EAF2] rounded-2xl shadow-lg hover:shadow-xl text-[#64748B] hover:text-[#635BFF] flex items-center justify-center transition-all group"
            title="Reset Campus View (Lovely Professional University)"
            aria-label="Reset campus view"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform text-[#635BFF]" />
          </button>

          {/* Map Layer Mode Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setShowLayerPicker(!showLayerPicker)}
              className="w-10 h-10 bg-white/95 backdrop-blur-xl border border-[#E8EAF2] rounded-2xl shadow-lg hover:shadow-xl text-[#64748B] hover:text-[#635BFF] flex items-center justify-center transition-all"
              title="Change Map Tiles Layer"
              aria-label="Change map tiles"
            >
              <Layers className="w-5 h-5 text-[#635BFF]" />
            </button>

            {/* Layer Selection Dropdown */}
            {showLayerPicker && (
              <div className="absolute right-0 top-12 w-48 bg-white/95 backdrop-blur-2xl border border-[#E8EAF2] rounded-2xl shadow-2xl p-2 space-y-1 animate-fadeIn">
                <div className="px-2 py-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  Map Style
                </div>
                {Object.entries(TILE_LAYERS).map(([key, layer]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveLayerKey(key);
                      setShowLayerPicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeLayerKey === key
                        ? 'bg-[#F3F0FF] text-[#635BFF]'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{layer.name}</span>
                    {activeLayerKey === key && (
                      <span className="w-2 h-2 rounded-full bg-[#635BFF]"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-white/95 backdrop-blur-xl border border-[#E8EAF2] rounded-2xl shadow-lg overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center text-[#64748B] hover:text-[#635BFF] hover:bg-slate-50 transition-colors border-b border-[#E8EAF2]"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center text-[#64748B] hover:text-[#635BFF] hover:bg-slate-50 transition-colors"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Drawer Toggle */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="px-3 py-1.5 bg-white/95 backdrop-blur-xl border border-[#E8EAF2] rounded-xl shadow-md hover:shadow-lg text-[11px] font-bold text-slate-700 hover:text-[#635BFF] flex items-center gap-1.5 transition-all"
        >
          <Info className="w-3.5 h-3.5 text-[#635BFF]" />
          <span>{showLegend ? 'Hide Legend' : 'Map Legend'}</span>
        </button>

        {/* Campus Map Legend Pill */}
        {showLegend && (
          <div className="bg-white/95 backdrop-blur-2xl border border-[#E8EAF2] rounded-2xl shadow-xl p-3 w-56 text-xs text-slate-700 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-[11px] text-slate-900 border-b border-slate-100 pb-1.5">
              <span>Campus Legend</span>
              <button onClick={() => setShowLegend(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white flex items-center justify-center text-[8px] font-black">34</span>
                <span>Block 34 (School of CSE)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-[#635BFF] bg-white text-[#635BFF] flex items-center justify-center text-[8px] font-bold">32</span>
                <span>Academic Blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[8px]">🚪</span>
                <span>Campus Gates (G1 - G4)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px]">🛍️</span>
                <span>UniMall & Amenities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-[#635BFF] rounded-full"></div>
                <span>Pedestrian Walking Route</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FLOATING CAMPUS LOCATION BADGE (Bottom Left - Above Attribution) */}
      <div className="absolute bottom-4 left-4 z-10 hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md border border-[#E8EAF2] rounded-xl shadow-md text-xs text-slate-700 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-semibold text-[#0F172A]">Lovely Professional University</span>
        <span className="text-[#94A3B8]">·</span>
        <span className="text-slate-500 text-[11px]">Phagwara, Punjab (31.25°N, 75.70°E)</span>
      </div>

    </div>
  );
}
