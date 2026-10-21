/**
 * Campus Graph Routing Engine using Dijkstra's Algorithm
 * 
 * Computes shortest paths, step-by-step turn-by-turn pedestrian directions,
 * and estimated walking times over the campus walkway network.
 * 
 * DISCLAIMER:
 * Calculations are based on configured illustrative demo edge weights.
 * All walking times and distances are clearly labeled as estimates.
 */

/**
 * Builds an adjacency list representation of the campus graph.
 * @param {Array} nodes 
 * @param {Array} edges 
 * @param {Object} options - { avoidUncovered: boolean }
 */
export function buildGraph(nodes, edges, options = {}) {
  const adj = {};
  
  nodes.forEach(n => {
    adj[n.id] = [];
  });

  edges.forEach(edge => {
    if (!adj[edge.source] || !adj[edge.target]) return;
    
    let weight = edge.distance;
    
    // If user prefers covered walkways in bad weather or sun
    if (options.preferCovered && edge.type !== 'covered') {
      weight = weight * 1.5;
    }

    adj[edge.source].push({
      to: edge.target,
      weight,
      originalDistance: edge.distance,
      type: edge.type,
      description: edge.description,
    });

    adj[edge.target].push({
      to: edge.source,
      weight,
      originalDistance: edge.distance,
      type: edge.type,
      description: edge.description,
    });
  });

  return adj;
}

/**
 * Determines cardinal direction based on coordinate vector
 */
function getHeading(fromNode, toNode) {
  if (!fromNode || !toNode) return "ahead";
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y; // note SVG y points downwards

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  if (angle >= -22.5 && angle < 22.5) return "east";
  if (angle >= 22.5 && angle < 67.5) return "south-east";
  if (angle >= 67.5 && angle < 112.5) return "south";
  if (angle >= 112.5 && angle < 157.5) return "south-west";
  if ((angle >= 157.5 && angle <= 180) || (angle >= -180 && angle < -157.5)) return "west";
  if (angle >= -157.5 && angle < -112.5) return "north-west";
  if (angle >= -112.5 && angle < -67.5) return "north";
  if (angle >= -67.5 && angle < -22.5) return "north-east";
  return "ahead";
}

/**
 * Dijkstra's Shortest Path Algorithm
 */
export function findShortestPath(nodes, edges, startId, destinationId, options = {}) {
  if (!startId || !destinationId) return null;
  if (startId === destinationId) {
    const node = nodes.find(n => n.id === startId);
    return {
      success: true,
      path: [startId],
      totalDistance: 0,
      estimatedMinutes: 0,
      steps: [
        {
          stepNumber: 1,
          instruction: `You are already at ${node ? node.name : 'the destination'}.`,
          distance: 0,
          type: "arrival",
          targetNodeId: startId,
        }
      ],
      nodesInPath: [node],
      isAlternative: false,
    };
  }

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const adj = buildGraph(nodes, edges, options);

  const distances = {};
  const previous = {};
  const unvisited = new Set();

  nodes.forEach(n => {
    distances[n.id] = Infinity;
    previous[n.id] = null;
    unvisited.add(n.id);
  });

  distances[startId] = 0;

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current = null;
    let minDistance = Infinity;

    unvisited.forEach(nodeId => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        current = nodeId;
      }
    });

    if (current === null || minDistance === Infinity) break;
    if (current === destinationId) break;

    unvisited.delete(current);

    const neighbors = adj[current] || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.to)) continue;

      const alt = distances[current] + neighbor.weight;
      if (alt < distances[neighbor.to]) {
        distances[neighbor.to] = alt;
        previous[neighbor.to] = {
          from: current,
          distance: neighbor.originalDistance,
          type: neighbor.type,
          description: neighbor.description,
        };
      }
    }
  }

  // If unreachable
  if (distances[destinationId] === Infinity) {
    return {
      success: false,
      error: "No simulated pathway exists between the chosen locations.",
      path: [],
      steps: [],
    };
  }

  // Reconstruct path
  const path = [];
  let curr = destinationId;
  let totalPhysicalDistance = 0;

  while (curr !== null) {
    path.unshift(curr);
    const prevInfo = previous[curr];
    if (prevInfo) {
      totalPhysicalDistance += prevInfo.distance;
      curr = prevInfo.from;
    } else {
      curr = null;
    }
  }

  // Compute estimated walking time (72 meters per minute at 1.2 m/s standard human walking speed)
  const estimatedMinutes = Math.max(1, Math.ceil(totalPhysicalDistance / 72));

  // Generate Turn-by-Turn English Instructions
  const steps = [];
  for (let i = 0; i < path.length - 1; i++) {
    const fromId = path[i];
    const toId = path[i + 1];
    const fromNode = nodeMap.get(fromId);
    const toNode = nodeMap.get(toId);

    // find original edge
    const edge = edges.find(
      e => (e.source === fromId && e.target === toId) || (e.source === toId && e.target === fromId)
    );

    const distance = edge ? edge.distance : 100;
    const pathType = edge ? edge.type : "walkway";
    const direction = getHeading(fromNode, toNode);

    let instruction = "";
    if (i === 0) {
      instruction = `Start at ${fromNode.name}. Head ${direction} along the ${pathType === 'covered' ? 'covered corridor' : pathType === 'boulevard' ? 'main boulevard' : 'walkway'} towards ${toNode.name} (${distance}m).`;
    } else {
      instruction = `At ${fromNode.name}, continue ${direction} on the ${pathType === 'covered' ? 'shaded covered path' : 'pedestrian walkway'} towards ${toNode.name} (${distance}m).`;
    }

    steps.push({
      stepNumber: i + 1,
      fromNode,
      toNode,
      distance,
      direction,
      pathType,
      instruction,
      edgeDescription: edge ? edge.description : null,
    });
  }

  // Final step
  const destNode = nodeMap.get(destinationId);
  steps.push({
    stepNumber: steps.length + 1,
    fromNode: destNode,
    toNode: destNode,
    distance: 0,
    direction: "arrived",
    pathType: "destination",
    instruction: `Arrive at ${destNode.name}. Proceed to the main entrance portico for last-50m indoor navigation.`,
    isArrival: true,
  });

  const nodesInPath = path.map(id => nodeMap.get(id)).filter(Boolean);

  return {
    success: true,
    path,
    nodesInPath,
    totalDistance: totalPhysicalDistance,
    estimatedMinutes,
    steps,
    isAlternative: options.isAlternative || false,
  };
}

/**
 * Calculates an alternative route by penalizing the primary route edges
 */
export function findAlternativeRoute(nodes, edges, startId, destinationId, primaryPath) {
  if (!primaryPath || primaryPath.length < 3) return null;

  // Clone edges and heavily penalize the segments used in primary path
  const penalizedEdges = edges.map(edge => {
    const isUsed = primaryPath.some((nodeId, idx) => {
      if (idx === primaryPath.length - 1) return false;
      const nextId = primaryPath[idx + 1];
      return (edge.source === nodeId && edge.target === nextId) ||
             (edge.source === nextId && edge.target === nodeId);
    });

    if (isUsed) {
      return { ...edge, distance: edge.distance * 3 };
    }
    return edge;
  });

  const altResult = findShortestPath(nodes, penalizedEdges, startId, destinationId, { isAlternative: true });
  
  // If the alternative route is identical to the primary route, return null
  if (altResult.success && JSON.stringify(altResult.path) === JSON.stringify(primaryPath)) {
    return null;
  }

  // Recalculate true physical distance for alternative route
  if (altResult.success) {
    let trueDistance = 0;
    for (let i = 0; i < altResult.path.length - 1; i++) {
      const from = altResult.path[i];
      const to = altResult.path[i + 1];
      const origEdge = edges.find(
        e => (e.source === from && e.target === to) || (e.source === to && e.target === from)
      );
      if (origEdge) trueDistance += origEdge.distance;
    }
    altResult.totalDistance = trueDistance;
    altResult.estimatedMinutes = Math.max(1, Math.ceil(trueDistance / 72));
    altResult.isAlternative = true;
  }

  return altResult;
}
