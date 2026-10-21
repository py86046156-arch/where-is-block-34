import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  MapPin, 
  Navigation, 
  X
} from 'lucide-react';

export default function CampusMap({
  nodes = [],
  edges = [],
  startNodeId,
  destinationNodeId,
  activeRoute = null,
  onSelectNode,
  onSetStart,
  onSetDestination,
  selectedRoom = null
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeNodeDetail, setActiveNodeDetail] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'block' | 'gate' | 'landmark'
  const svgRef = useRef(null);

  // Sync activeNodeDetail when start or destination changes
  useEffect(() => {
    if (destinationNodeId) {
      const dest = nodes.find(n => n.id === destinationNodeId);
      if (dest) setActiveNodeDetail(dest);
    }
  }, [destinationNodeId, nodes]);

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(Number((prev + 0.25).toFixed(2)), 2.8));
  const handleZoomOut = () => setZoom(prev => Math.max(Number((prev - 0.25).toFixed(2)), 0.65));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.classList.contains('map-bg')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch pan handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Node lookup map
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Check if edge is in route
  const isEdgeInRoute = (sourceId, targetId) => {
    if (!activeRoute || !activeRoute.path || activeRoute.path.length < 2) return false;
    for (let i = 0; i < activeRoute.path.length - 1; i++) {
      const u = activeRoute.path[i];
      const v = activeRoute.path[i + 1];
      if ((u === sourceId && v === targetId) || (u === targetId && v === sourceId)) {
        return true;
      }
    }
    return false;
  };

  // SVG dimensions
  const mapWidth = 1000;
  const mapHeight = 620;

  const filteredNodes = filterCategory === 'all' 
    ? nodes 
    : nodes.filter(n => n.category === filterCategory);

  return (
    <div className="relative w-full bg-slate-950 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 select-none">
      {/* Top Map Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl text-xs text-slate-300 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse"></span>
          <span className="font-extrabold text-white tracking-wide">Interactive Campus Map</span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-amber-400 font-semibold text-[11px]">
            Illustrative Schematic Model
          </span>
        </div>

        {/* Category Filter Pills on Map */}
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'block', label: 'Blocks' },
            { id: 'gate', label: 'Gates' },
            { id: 'landmark', label: 'Landmarks' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterCategory(f.id)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                filterCategory === f.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Map Controls (Right Top) */}
      <div className="absolute right-4 top-16 z-20 flex flex-col gap-1.5 bg-slate-900/95 backdrop-blur border border-slate-700 p-1.5 rounded-2xl shadow-xl">
        <button
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[9px] font-mono font-bold text-center text-slate-400">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset View (1:1)"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border-t border-slate-700/80"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Compass Rose Indicator (Left Bottom) */}
      <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 text-xs pointer-events-none">
        <Compass className="w-4 h-4 text-orange-400 animate-spin-slow" />
        <span className="font-extrabold text-white text-[11px]">N ↑</span>
        <span className="text-[10px] text-slate-400 hidden sm:inline">Schematic Grid</span>
      </div>

      {/* Map Legend (Right Bottom) */}
      <div className="absolute right-4 bottom-4 z-20 hidden md:flex items-center gap-3 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
          <span>Gates</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-orange-500 border border-white"></span>
          <span>Block 34 (Hero)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-sky-400"></span>
          <span>Academic Blocks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 bg-orange-400 rounded"></span>
          <span>Active Route</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="w-full h-[520px] md:h-[620px] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <defs>
          {/* Subtle Grid pattern */}
          <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6" />
          </pattern>
          {/* Route Gradient */}
          <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          {/* Filter for glowing active pin */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Pan and Zoom Layer */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Background Grid & Campus Boundary */}
          <rect width={mapWidth} height={mapHeight} fill="#090f1f" className="map-bg" />
          <rect width={mapWidth} height={mapHeight} fill="url(#campusGrid)" className="map-bg" />

          {/* Landscaped Green Lawns & Courtyards */}
          <g opacity="0.9">
            {/* Central Academic Courtyard Lawn */}
            <rect x="330" y="240" width="430" height="130" rx="20" fill="#062e24" stroke="#0d523f" strokeWidth="1.5" />
            <text x="545" y="275" fill="#10b981" fontSize="11" opacity="0.5" textAnchor="middle" fontWeight="bold" letterSpacing="3">
              CENTRAL ACADEMIC SPINE
            </text>

            {/* Unipolis Open Plaza Lawn */}
            <circle cx="480" cy="110" r="64" fill="#1e1b4b" stroke="#3730a3" strokeWidth="1.5" strokeDasharray="5 5" />
            
            {/* Library Lawn */}
            <rect x="420" y="410" width="120" height="70" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

            {/* Sports Grounds Area */}
            <rect x="800" y="80" width="130" height="190" rx="18" fill="#064e3b" stroke="#059669" strokeWidth="1.5" opacity="0.6" />
            <text x="865" y="105" fill="#34d399" fontSize="10" opacity="0.7" textAnchor="middle" fontWeight="bold">
              SPORTS ARENA
            </text>

            {/* GT Road Southern Border Highway */}
            <rect x="0" y="580" width={mapWidth} height="40" fill="#020617" />
            <line x1="0" y1="600" x2={mapWidth} y2="600" stroke="#facc15" strokeWidth="2.5" strokeDasharray="18 12" />
            <text x="500" y="595" fill="#9ca3af" fontSize="10" textAnchor="middle" letterSpacing="4" fontWeight="bold">
              NATIONAL HIGHWAY 1 (GT ROAD - MAIN CAMPUS FRONTAGE)
            </text>
          </g>

          {/* Campus Walkways & Roads (Inactive Background Edges) */}
          <g>
            {edges.map((edge, idx) => {
              const src = nodeMap.get(edge.source);
              const tgt = nodeMap.get(edge.target);
              if (!src || !tgt) return null;

              const inRoute = isEdgeInRoute(edge.source, edge.target);
              if (inRoute) return null; // Active route rendered separately on top

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={edge.type === 'boulevard' ? '#334155' : '#1e293b'}
                    strokeWidth={edge.type === 'boulevard' ? 6 : 3.5}
                    strokeDasharray={edge.type === 'covered' ? '4 3' : 'none'}
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </g>
              );
            })}
          </g>

          {/* Active Shortest-Path Route (Dijkstra Result) */}
          {activeRoute && activeRoute.path && activeRoute.path.length > 1 && (
            <g>
              {/* Outer Glow Halo */}
              {activeRoute.path.map((nodeId, idx) => {
                if (idx === activeRoute.path.length - 1) return null;
                const nextId = activeRoute.path[idx + 1];
                const src = nodeMap.get(nodeId);
                const tgt = nodeMap.get(nextId);
                if (!src || !tgt) return null;

                return (
                  <line
                    key={`glow-${idx}`}
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke="#ea580c"
                    strokeWidth="14"
                    strokeLinecap="round"
                    opacity="0.4"
                    filter="url(#glow)"
                  />
                );
              })}

              {/* Animated Walking Route Line */}
              {activeRoute.path.map((nodeId, idx) => {
                if (idx === activeRoute.path.length - 1) return null;
                const nextId = activeRoute.path[idx + 1];
                const src = nodeMap.get(nodeId);
                const tgt = nodeMap.get(nextId);
                if (!src || !tgt) return null;

                return (
                  <line
                    key={`active-${idx}`}
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke="url(#routeGlow)"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    className="route-dash"
                  />
                );
              })}
            </g>
          )}

          {/* Campus Nodes (Gates, Blocks, Landmarks) */}
          <g>
            {filteredNodes.map((node) => {
              const isStart = node.id === startNodeId;
              const isDest = node.id === destinationNodeId;
              const isHero = node.isHeroBlock;
              const isSelected = activeNodeDetail?.id === node.id;
              const isInActiveRoute = activeRoute?.path?.includes(node.id);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer transition-transform duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveNodeDetail(node);
                    if (onSelectNode) onSelectNode(node);
                  }}
                >
                  {/* HERO BLOCK 34 SPECIAL ACCENT HALO */}
                  {isHero && (
                    <circle
                      r="38"
                      fill="#ea580c"
                      opacity={isDest ? 0.4 : 0.2}
                      className="animate-pulse"
                    />
                  )}

                  {/* SELECTION RING IF CLICKED */}
                  {isSelected && (
                    <circle
                      r="32"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* GATE NODES */}
                  {node.category === 'gate' && (
                    <g>
                      <circle
                        r={isStart ? 24 : 20}
                        fill={isStart ? '#10b981' : '#065f46'}
                        stroke={isStart ? '#ffffff' : '#34d399'}
                        strokeWidth={isStart ? 3.5 : 2}
                        filter={isStart ? 'url(#glow)' : 'none'}
                      />
                      <text
                        textAnchor="middle"
                        y="4"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {node.code}
                      </text>
                      <text
                        textAnchor="middle"
                        y={isStart ? 35 : 31}
                        fill="#a7f3d0"
                        fontSize="9.5"
                        fontWeight="700"
                      >
                        {node.name.split(' (')[0]}
                      </text>
                    </g>
                  )}

                  {/* ACADEMIC BLOCK NODES */}
                  {node.category === 'block' && (
                    <g>
                      <rect
                        x="-24"
                        y="-18"
                        width="48"
                        height="36"
                        rx="9"
                        fill={
                          isDest
                            ? '#ea580c'
                            : isStart
                            ? '#10b981'
                            : isHero
                            ? '#9a3412'
                            : isInActiveRoute
                            ? '#1e3a8a'
                            : '#1e293b'
                        }
                        stroke={
                          isDest
                            ? '#fed7aa'
                            : isHero
                            ? '#f97316'
                            : isSelected
                            ? '#38bdf8'
                            : '#475569'
                        }
                        strokeWidth={isDest || isHero || isSelected ? 3 : 1.5}
                        filter={isDest || isHero ? 'url(#glow)' : 'none'}
                      />
                      <text
                        textAnchor="middle"
                        y="5"
                        fill="#ffffff"
                        fontSize={isHero ? "14" : "12"}
                        fontWeight="bold"
                      >
                        {node.code}
                      </text>
                      <text
                        textAnchor="middle"
                        y="29"
                        fill={isHero ? "#fb923c" : "#94a3b8"}
                        fontSize="9.5"
                        fontWeight={isHero ? "bold" : "600"}
                      >
                        Blk {node.code}
                      </text>
                    </g>
                  )}

                  {/* LANDMARK NODES */}
                  {node.category === 'landmark' && (
                    <g>
                      <polygon
                        points="-18,-14 18,-14 24,0 18,14 -18,14 -24,0"
                        fill={
                          isDest
                            ? '#ea580c'
                            : isStart
                            ? '#10b981'
                            : '#312e81'
                        }
                        stroke={isSelected ? '#38bdf8' : '#6366f1'}
                        strokeWidth={isSelected ? 3 : 2}
                      />
                      <text
                        textAnchor="middle"
                        y="4"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {node.code.length > 5 ? node.code.slice(0, 4) : node.code}
                      </text>
                      <text
                        textAnchor="middle"
                        y="27"
                        fill="#c7d2fe"
                        fontSize="9"
                        fontWeight="600"
                      >
                        {node.name.split(' ')[0]}
                      </text>
                    </g>
                  )}

                  {/* START PIN BADGE */}
                  {isStart && (
                    <g transform="translate(0, -32)" className="pin-glow">
                      <rect x="-30" y="-12" width="60" height="20" rx="10" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="0" y="2" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
                        START (A)
                      </text>
                      <polygon points="-4,8 4,8 0,13" fill="#10b981" />
                    </g>
                  )}

                  {/* DESTINATION PIN BADGE */}
                  {isDest && (
                    <g transform="translate(0, -34)" className="pin-glow">
                      <rect x="-34" y="-12" width="68" height="20" rx="10" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="0" y="2" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
                        DEST (B) 📍
                      </text>
                      <polygon points="-4,8 4,8 0,13" fill="#ea580c" />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Persistent Selected Node Drawer / Card */}
      {activeNodeDetail && (
        <div className="absolute left-4 bottom-14 md:bottom-auto md:top-16 z-30 max-w-sm w-[calc(100%-2rem)] md:w-80 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-1">
                {activeNodeDetail.category.toUpperCase()} • {activeNodeDetail.zone}
              </span>
              <h4 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                {activeNodeDetail.name}
              </h4>
            </div>
            <button
              onClick={() => setActiveNodeDetail(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {activeNodeDetail.description}
          </p>

          {activeNodeDetail.popularDestinations && activeNodeDetail.popularDestinations.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Popular Rooms in this Block:
              </span>
              <div className="flex flex-wrap gap-1">
                {activeNodeDetail.popularDestinations.map((roomName, i) => (
                  <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                    {roomName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons: Set as Start & Navigate */}
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (onSetStart) onSetStart(activeNodeDetail.id);
              }}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow"
            >
              <MapPin className="w-3.5 h-3.5" /> Set Start
            </button>
            <button
              onClick={() => {
                if (onSetDestination) onSetDestination(activeNodeDetail.id);
              }}
              className="px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow"
            >
              <Navigation className="w-3.5 h-3.5" /> Navigate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
