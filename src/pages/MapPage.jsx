import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import CampusMap from '../components/CampusMap';
import { findShortestPath, findAlternativeRoute } from '../utils/dijkstra';
import { fetchPedestrianRoute } from '../utils/geoRouting';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Layers, 
  DoorOpen, 
  RotateCcw, 
  X,
  ArrowRight,
  Clock,
  Umbrella,
  ArrowUpDown,
  Compass,
  ChevronUp,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles
} from 'lucide-react';

export default function MapPage({
  nodes = [],
  edges = [],
  rooms = [],
  onOpenLast50m,
  recentSearches = [],
  onAddRecentSearch,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Route & Destination States
  const [startNodeId, setStartNodeId] = useState(() => searchParams.get('start') || 'gate-1');
  const [destinationNodeId, setDestinationNodeId] = useState(() => searchParams.get('dest') || 'block-34');
  const [selectedRoom, setSelectedRoom] = useState(() => {
    const rId = searchParams.get('room');
    return rId ? rooms.find(r => r.id === rId) || null : null;
  });
  const [preferCovered, setPreferCovered] = useState(false);

  // Active / Alternative Dijkstra routes
  const [activeRoute, setActiveRoute] = useState(null);
  const [alternativeRoute, setAlternativeRoute] = useState(null);
  const [useAlternative, setUseAlternative] = useState(false);

  // Geographic Pedestrian Route State (OpenStreetMap / OSRM)
  const [geoRouteCoordinates, setGeoRouteCoordinates] = useState(null);
  const [geoRouteInfo, setGeoRouteInfo] = useState(null);
  const [isGeoRoutingLoading, setIsGeoRoutingLoading] = useState(false);

  // Sidebar controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeMode, setActiveMode] = useState('explore'); // 'explore' | 'directions'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'block' | 'classroom' | 'gate' | 'landmark' | 'facility'

  // Focused Navigation mode
  const [isNavActive, setIsNavActive] = useState(false);
  const [navStepIndex, setNavStepIndex] = useState(0);

  // Floating destination preview
  const [focusedNode, setFocusedNode] = useState(null);

  // Mobile bottom sheet state
  const [mobileSheetExpanded, setMobileSheetExpanded] = useState(false);

  // Synchronize with URL query params
  useEffect(() => {
    const qStart = searchParams.get('start');
    const qDest = searchParams.get('dest');
    const qRoom = searchParams.get('room');

    if (qStart && qStart !== startNodeId) setStartNodeId(qStart);
    if (qDest && qDest !== destinationNodeId) {
      setDestinationNodeId(qDest);
      const matched = nodes.find(n => n.id === qDest);
      if (matched) setFocusedNode(matched);
    }
    if (qRoom) {
      const rm = rooms.find(r => r.id === qRoom);
      if (rm) setSelectedRoom(rm);
    }
  }, [searchParams, rooms, nodes]);

  // Route calculation: Dijkstra fallback + Real OSRM Pedestrian Footpath Route
  const handleCalculateRoute = useCallback(async () => {
    if (!startNodeId || !destinationNodeId) {
      setActiveRoute(null);
      setAlternativeRoute(null);
      setGeoRouteCoordinates(null);
      setGeoRouteInfo(null);
      return;
    }

    // 1. Instant Dijkstra graph route
    const route = findShortestPath(nodes, edges, startNodeId, destinationNodeId, {
      preferCovered,
    });
    setActiveRoute(route);

    if (route && route.success && route.path.length > 2) {
      const alt = findAlternativeRoute(nodes, edges, startNodeId, destinationNodeId, route.path);
      setAlternativeRoute(alt);
    } else {
      setAlternativeRoute(null);
    }

    // 2. Query Genuine Geographic Pedestrian Walking Route via OSRM
    const startNode = nodes.find(n => n.id === startNodeId);
    const destNode = nodes.find(n => n.id === destinationNodeId);

    if (startNode?.lat && startNode?.lng && destNode?.lat && destNode?.lng) {
      setIsGeoRoutingLoading(true);
      try {
        const geoResult = await fetchPedestrianRoute(
          { lat: startNode.lat, lng: startNode.lng },
          { lat: destNode.lat, lng: destNode.lng }
        );

        if (geoResult.success && geoResult.coordinates) {
          setGeoRouteCoordinates(geoResult.coordinates);
          setGeoRouteInfo(geoResult);
        } else {
          // Fallback to Dijkstra node coordinates
          setGeoRouteCoordinates(null);
          setGeoRouteInfo(null);
        }
      } catch (e) {
        setGeoRouteCoordinates(null);
        setGeoRouteInfo(null);
      } finally {
        setIsGeoRoutingLoading(false);
      }
    } else {
      setGeoRouteCoordinates(null);
      setGeoRouteInfo(null);
    }
  }, [startNodeId, destinationNodeId, nodes, edges, preferCovered]);

  useEffect(() => {
    if (startNodeId && destinationNodeId) {
      handleCalculateRoute();
    }
  }, [startNodeId, destinationNodeId, preferCovered, handleCalculateRoute]);

  const currentRoute = useAlternative && alternativeRoute ? alternativeRoute : activeRoute;

  // Handlers
  const handleSelectDestination = (nodeId) => {
    setDestinationNodeId(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) setFocusedNode(node);
    setSearchParams(prev => {
      prev.set('dest', nodeId);
      return prev;
    });
    if (onAddRecentSearch && node) {
      onAddRecentSearch(node.name);
    }
  };

  const handleSelectStart = (nodeId) => {
    setStartNodeId(nodeId);
    setSearchParams(prev => {
      prev.set('start', nodeId);
      return prev;
    });
  };

  const handleSwapLocations = () => {
    const prevStart = startNodeId;
    const prevDest = destinationNodeId;
    setStartNodeId(prevDest);
    setDestinationNodeId(prevStart);
    setSearchParams(prev => {
      if (prevDest) prev.set('start', prevDest);
      if (prevStart) prev.set('dest', prevStart);
      return prev;
    });
  };

  const handleResetRoute = () => {
    setStartNodeId('');
    setDestinationNodeId('');
    setSelectedRoom(null);
    setActiveRoute(null);
    setAlternativeRoute(null);
    setFocusedNode(null);
    setIsNavActive(false);
    setSearchParams({});
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setDestinationNodeId(room.blockId);
    setSearchParams(prev => {
      prev.set('dest', room.blockId);
      prev.set('room', room.id);
      return prev;
    });
    const blockNode = nodes.find(n => n.id === room.blockId);
    if (blockNode) setFocusedNode(blockNode);
    setActiveMode('directions');
  };

  // Node filtering for directory in Explore mode
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      let matchesCategory = true;
      if (activeCategory === 'block') matchesCategory = n.category === 'block';
      else if (activeCategory === 'gate') matchesCategory = n.category === 'gate';
      else if (activeCategory === 'landmark') matchesCategory = n.category === 'landmark';
      else if (activeCategory === 'facility') matchesCategory = n.category === 'facility';
      else if (activeCategory === 'classroom') matchesCategory = false; // classrooms handled separately

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = !query || 
        n.name.toLowerCase().includes(query) ||
        n.code.toLowerCase().includes(query) ||
        (n.description && n.description.toLowerCase().includes(query)) ||
        (n.zone && n.zone.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [nodes, activeCategory, searchQuery]);

  // Classroom search matches from ROOMS_CATALOG
  const filteredRooms = useMemo(() => {
    if (activeCategory !== 'all' && activeCategory !== 'classroom') return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query && activeCategory !== 'classroom') return [];
    return rooms.filter(r => 
      !query || 
      r.id.toLowerCase().includes(query) ||
      r.name.toLowerCase().includes(query) ||
      r.blockName.toLowerCase().includes(query) ||
      r.department.toLowerCase().includes(query)
    );
  }, [rooms, activeCategory, searchQuery]);

  // Gate nodes & other nodes for dropdowns
  const gateNodes = useMemo(() => nodes.filter(n => n.category === 'gate'), [nodes]);
  const destinationOptions = useMemo(() => nodes.filter(n => n.category !== 'gate'), [nodes]);

  const activeDestinationNode = useMemo(() => {
    return nodes.find(n => n.id === destinationNodeId) || null;
  }, [nodes, destinationNodeId]);

  const activeStartNode = useMemo(() => {
    return nodes.find(n => n.id === startNodeId) || null;
  }, [nodes, startNodeId]);

  return (
    <div className="relative w-full h-[calc(100dvh-72px)] overflow-hidden bg-[#F8FAFC]">

      {/* FULL-VIEWPORT MAP CANVAS (Background layer) */}
      <div className="absolute inset-0 z-0">
        <CampusMap
          nodes={nodes}
          edges={edges}
          startNodeId={startNodeId}
          destinationNodeId={destinationNodeId}
          activeRoute={currentRoute}
          geoRouteCoordinates={geoRouteCoordinates}
          onSelectNode={(node) => {
            setFocusedNode(node);
            if (!startNodeId) {
              handleSelectStart(node.id);
            } else {
              handleSelectDestination(node.id);
            }
          }}
          onSetStart={handleSelectStart}
          onSetDestination={handleSelectDestination}
          selectedRoom={selectedRoom}
        />
      </div>

      {/* COLLAPSED EXPAND BUTTON (Visible when desktop sidebar is closed) */}
      {isSidebarCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="hidden lg:flex items-center gap-2 absolute top-4 left-4 z-20 px-4 py-2.5 bg-white/95 backdrop-blur-xl border border-[#E8EAF2] rounded-2xl shadow-xl hover:shadow-2xl text-xs font-bold text-[#0F172A] hover:text-[#635BFF] transition-all group"
          title="Open Navigation & Search Sidebar"
        >
          <PanelLeftOpen className="w-4 h-4 text-[#635BFF] group-hover:scale-110 transition-transform" />
          <span>Explore & Routes</span>
          {activeDestinationNode && (
            <span className="max-w-[120px] truncate text-[11px] text-[#64748B] font-medium border-l border-slate-200 pl-2">
              {activeDestinationNode.name}
            </span>
          )}
        </button>
      )}

      {/* FLOATING LEFT SIDEBAR (QuickVet Layout Reference) */}
      <aside 
        className={`hidden lg:flex flex-col w-[390px] xl:w-[420px] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-[#E8EAF2] absolute top-4 left-4 bottom-4 z-20 overflow-hidden transition-all duration-300 ${
          isSidebarCollapsed ? '-translate-x-[110%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
        }`}
      >
        {/* Top Header & Search Bar */}
        <div className="p-4 border-b border-[#E8EAF2] bg-white/60 space-y-3 flex-shrink-0">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                LPU Campus Wayfinding
              </span>
            </div>

            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
              title="Collapse sidebar to view full map"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Large Search Input Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blocks, rooms, gates, landmarks..."
              className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-[#E8EAF2] focus:border-[#635BFF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/15 text-[#0F172A] placeholder:text-[#94A3B8] transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 p-0.5 text-[#94A3B8] hover:text-[#0F172A] rounded-lg"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Recent Locations Chips */}
          {recentSearches && recentSearches.length > 0 && !searchQuery && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase whitespace-nowrap">Recent:</span>
              {recentSearches.slice(0, 4).map((term, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const matched = nodes.find(n => n.name.toLowerCase().includes(term.toLowerCase()));
                    if (matched) handleSelectDestination(matched.id);
                    else setSearchQuery(term);
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-[#F3F0FF] text-[#64748B] hover:text-[#635BFF] text-[10px] font-medium rounded-lg whitespace-nowrap transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* Mode Switcher: Explore vs Directions */}
          <div className="grid grid-cols-2 gap-1 bg-slate-100/80 p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveMode('explore')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'explore'
                  ? 'bg-white text-[#635BFF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => setActiveMode('directions')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'directions'
                  ? 'bg-white text-[#635BFF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions</span>
            </button>
          </div>

          {/* Category Filter Chips (Explore mode) */}
          {activeMode === 'explore' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'block', label: 'Academic Blocks' },
                { id: 'classroom', label: 'Classrooms' },
                { id: 'gate', label: 'Gates' },
                { id: 'landmark', label: 'Landmarks' },
                { id: 'facility', label: 'Facilities' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#635BFF] text-white shadow-xs'
                      : 'bg-slate-100/80 hover:bg-slate-200/70 text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* SIDEBAR BODY (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ================= MODE 1: EXPLORE DIRECTORY ================= */}
          {activeMode === 'explore' && (
            <div className="space-y-3">
              
              {/* Classroom search matches if present */}
              {filteredRooms.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-1">
                    Matching Classrooms & Labs ({filteredRooms.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredRooms.slice(0, 6).map(room => (
                      <div
                        key={room.id}
                        onClick={() => handleSelectRoom(room)}
                        className="p-3 bg-white hover:bg-purple-50/50 border border-[#E8EAF2] hover:border-[#C7BDFF] rounded-2xl cursor-pointer transition-all shadow-xs flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <DoorOpen className="w-3.5 h-3.5 text-[#635BFF]" />
                            <span className="text-xs font-bold text-[#0F172A] truncate">
                              Room {room.id}
                            </span>
                            <span className="text-[10px] bg-[#F3F0FF] text-[#635BFF] font-semibold px-2 py-0.2 rounded-full">
                              Floor {room.floor}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                            {room.name} • {room.blockName}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectRoom(room);
                          }}
                          className="px-2.5 py-1 bg-[#635BFF] hover:bg-[#5145E5] text-white text-[10px] font-bold rounded-lg transition-colors flex-shrink-0"
                        >
                          Navigate
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Campus Destination Nodes List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Destinations ({filteredNodes.length})
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    Click to view on map
                  </span>
                </div>

                {filteredNodes.length === 0 && filteredRooms.length === 0 ? (
                  /* Designed Empty State */
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center mx-auto">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">No destinations found</h4>
                      <p className="text-xs text-[#64748B] max-w-xs mx-auto mt-1">
                        We couldn't find any location matching "{searchQuery}".
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                      className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold transition-colors"
                    >
                      Clear Search & Filters
                    </button>
                  </div>
                ) : (
                  filteredNodes.map(node => {
                    const isSelected = destinationNodeId === node.id;
                    const isStart = startNodeId === node.id;

                    return (
                      <div
                        key={node.id}
                        onClick={() => handleSelectDestination(node.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#F3F0FF]/80 border-[#C7BDFF] shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-[#E8EAF2]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-[#0F172A] truncate">
                                {node.name}
                              </span>
                              {isStart && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                  Start (A)
                                </span>
                              )}
                              {node.isHeroBlock && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                                  CSE Hub
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                              <span>{node.zone}</span>
                              <span>•</span>
                              <span className="uppercase text-[10px] font-semibold text-[#635BFF]">
                                {node.category}
                              </span>
                            </div>

                            {node.description && (
                              <p className="text-[11px] text-[#64748B] line-clamp-1 mt-1">
                                {node.description}
                              </p>
                            )}
                          </div>

                          <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 border ${
                            isSelected ? 'bg-[#635BFF] border-white ring-2 ring-[#635BFF]/30' : 'bg-slate-200 border-white'
                          }`} />
                        </div>

                        {/* Card Action Affordances */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[10px] font-medium text-[#94A3B8] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>~3-5 min walk</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectDestination(node.id);
                                setActiveMode('directions');
                              }}
                              className="px-2.5 py-1 bg-[#635BFF] hover:bg-[#5145E5] text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Directions</span>
                            </button>
                            <Link
                              to={`/destinations/${node.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-slate-100"
                              title="Full Directory Page"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* ================= MODE 2: ROUTE PLANNER ================= */}
          {activeMode === 'directions' && (
            <div className="space-y-4">
              
              {/* Origin & Destination Inputs Card */}
              <div className="p-4 bg-white rounded-2xl border border-[#E8EAF2] shadow-xs space-y-3">
                
                {/* Starting Point (A) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-emerald-100"></span>
                      <span>Starting Point (A)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSelectStart('gate-1')}
                      className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors"
                    >
                      Gate 1 (Main)
                    </button>
                  </div>

                  <select
                    value={startNodeId || ''}
                    onChange={(e) => handleSelectStart(e.target.value)}
                    className="w-full py-2 pl-3 pr-8 bg-slate-50 border border-[#E8EAF2] rounded-xl text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 cursor-pointer"
                  >
                    <option value="">Select origin location...</option>
                    <optgroup label="Entrance Gates">
                      {gateNodes.map(n => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Academic Blocks & Facilities">
                      {destinationOptions.map(n => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Swap Origin & Destination Button */}
                <div className="flex justify-center -my-1">
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    className="p-1.5 rounded-full bg-white hover:bg-slate-100 text-[#64748B] hover:text-[#635BFF] border border-[#E8EAF2] shadow-xs transition-all"
                    title="Swap locations"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Destination (B) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF] ring-2 ring-purple-100"></span>
                      <span>Destination (B)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSelectDestination('block-34')}
                      className="text-[10px] font-semibold text-[#635BFF] bg-[#F3F0FF] hover:bg-purple-100 px-2 py-0.5 rounded-md transition-colors"
                    >
                      Block 34 (CSE)
                    </button>
                  </div>

                  <select
                    value={destinationNodeId || ''}
                    onChange={(e) => handleSelectDestination(e.target.value)}
                    className="w-full py-2 pl-3 pr-8 bg-slate-50 border border-[#E8EAF2] rounded-xl text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 cursor-pointer"
                  >
                    <option value="">Select destination...</option>
                    <optgroup label="Academic Blocks">
                      {destinationOptions.filter(n => n.category === 'block').map(n => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Gates & Amenities">
                      {destinationOptions.filter(n => n.category !== 'block').map(n => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </optgroup>
                  </select>

                  {/* Selected Room Sub-Badge */}
                  {selectedRoom && (
                    <div className="mt-1.5 flex items-center justify-between px-2.5 py-1 rounded-lg bg-[#F3F0FF] border border-[#E0DBFF] text-[11px] text-[#635BFF]">
                      <span className="font-semibold truncate">
                        Room {selectedRoom.id} ({selectedRoom.name}) • Floor {selectedRoom.floor}
                      </span>
                      <button
                        onClick={() => setSelectedRoom(null)}
                        className="p-0.5 text-[#635BFF] hover:text-red-500 rounded"
                        title="Remove room filter"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Walkway preference & Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferCovered(!preferCovered)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                      preferCovered
                        ? 'bg-[#F3F0FF] text-[#635BFF] border border-[#C7BDFF]'
                        : 'bg-slate-100 hover:bg-slate-200/70 text-[#64748B]'
                    }`}
                  >
                    <Umbrella className="w-3 h-3" />
                    <span>{preferCovered ? 'Covered Walkways Active' : 'All Walkways'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetRoute}
                    className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-xl hover:bg-slate-100 transition-colors"
                    title="Reset Route"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* CALCULATED ROUTE RESULTS */}
              {currentRoute && currentRoute.success ? (
                <div className="space-y-3">
                  
                  {/* Route Summary Metrics Strip */}
                  <div className="p-3.5 bg-gradient-to-tr from-[#FAF9FF] to-[#F3F0FF] border border-[#E0DBFF] rounded-2xl space-y-2.5">
                    
                    {/* Routing Source Badge */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold uppercase tracking-wider text-[#94A3B8]">Routing Engine</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        geoRouteInfo 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${geoRouteInfo ? 'bg-emerald-500 animate-pulse' : 'bg-[#635BFF]'}`}></span>
                        <span>{geoRouteInfo ? 'OSM Footpath Network' : 'Campus Graph Model'}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white rounded-xl shadow-xs">
                        <span className="text-[10px] text-[#64748B] font-medium block">Walking Distance</span>
                        <span className="text-sm font-extrabold text-[#0F172A]">
                          {geoRouteInfo ? geoRouteInfo.totalDistance : currentRoute.distance} m
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-xl shadow-xs">
                        <span className="text-[10px] text-[#64748B] font-medium block">Est. Time</span>
                        <span className="text-sm font-extrabold text-[#635BFF]">
                          {geoRouteInfo ? geoRouteInfo.estimatedMinutes : currentRoute.timeMinutes} min
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-xl shadow-xs">
                        <span className="text-[10px] text-[#64748B] font-medium block">Est. Steps</span>
                        <span className="text-sm font-extrabold text-[#0F172A]">
                          ~{Math.round((geoRouteInfo ? geoRouteInfo.totalDistance : currentRoute.distance) * 1.3)}
                        </span>
                      </div>
                    </div>

                    {/* Alternative route toggle */}
                    {alternativeRoute && alternativeRoute.success && (
                      <div className="mt-1 pt-2 border-t border-[#E0DBFF] flex items-center justify-between text-[11px]">
                        <span className="text-[#64748B]">Alternative path available</span>
                        <button
                          onClick={() => setUseAlternative(!useAlternative)}
                          className="font-bold text-[#635BFF] hover:underline"
                        >
                          {useAlternative ? 'Switch to Shortest' : 'Switch to Alternative'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Navigation Mode Button */}
                  {(() => {
                    const effectiveSteps = (geoRouteInfo?.steps && geoRouteInfo.steps.length > 0) 
                      ? geoRouteInfo.steps 
                      : (currentRoute.steps || []);

                    return !isNavActive ? (
                      <button
                        onClick={() => {
                          setIsNavActive(true);
                          setNavStepIndex(0);
                        }}
                        className="w-full py-2.5 px-4 bg-[#635BFF] hover:bg-[#5145E5] text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Start Focused Navigation</span>
                      </button>
                    ) : (
                      /* Active Turn-by-Turn Guidance Banner */
                      <div className="p-3.5 bg-[#0F172A] text-white rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                            Step {navStepIndex + 1} of {effectiveSteps.length || 1}
                          </span>
                          <button
                            onClick={() => setIsNavActive(false)}
                            className="text-[10px] text-slate-400 hover:text-white underline"
                          >
                            Exit Navigation
                          </button>
                        </div>

                        <div className="text-xs font-semibold leading-relaxed">
                          {effectiveSteps[navStepIndex]?.instruction || 'Proceed along the path.'}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => setNavStepIndex(prev => Math.max(0, prev - 1))}
                            disabled={navStepIndex === 0}
                            className="px-2.5 py-1 bg-slate-800 disabled:opacity-40 text-xs rounded-lg font-medium"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setNavStepIndex(prev => Math.min((effectiveSteps.length || 1) - 1, prev + 1))}
                            disabled={navStepIndex === (effectiveSteps.length || 1) - 1}
                            className="px-3 py-1 bg-[#635BFF] hover:bg-[#5145E5] disabled:opacity-40 text-xs rounded-lg font-bold"
                          >
                            Next Step →
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Turn-by-Turn Instructions Timeline */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-1">
                      Turn-by-Turn Walkway Instructions
                    </span>
                    <div className="space-y-1.5">
                      {((geoRouteInfo?.steps && geoRouteInfo.steps.length > 0) ? geoRouteInfo.steps : (currentRoute.steps || [])).map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-colors ${
                            isNavActive && navStepIndex === idx
                              ? 'bg-[#F3F0FF] border-[#C7BDFF] text-[#0F172A] font-semibold'
                              : 'bg-white border-[#E8EAF2] text-[#64748B]'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-[#0F172A] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] leading-relaxed text-[#0F172A]">
                              {step.instruction}
                            </p>
                            {step.distance > 0 && (
                              <span className="text-[10px] text-[#94A3B8] block mt-0.5">
                                Walk ~{step.distance} meters
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Indoor Final Approach CTA */}
                  {destinationNodeId === 'block-34' && (
                    <button
                      onClick={onOpenLast50m}
                      className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-[#E8EAF2] rounded-xl text-xs font-semibold text-[#635BFF] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Open 3D Room & Floor Guide (Last 50m)</span>
                    </button>
                  )}

                </div>
              ) : startNodeId && destinationNodeId ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                  Calculating route or destinations currently not connected directly. Try selecting Gate 1 or another academic block.
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#94A3B8]">
                  Select both a starting point and destination above to compute walking directions.
                </div>
              )}

            </div>
          )}

        </div>

        {/* SIDEBAR FOOTER NOTE */}
        <div className="p-3 bg-slate-50 border-t border-[#E8EAF2] text-[10px] text-[#94A3B8] text-center flex-shrink-0">
          Schematic university navigation dataset · LPU Capstone Project
        </div>

      </aside>

      {/* FLOATING DESTINATION DETAILS CARD (When a marker or destination is selected) */}
      {focusedNode && (
        <div className="hidden sm:block absolute top-4 right-20 z-20 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-[#E8EAF2] p-4 text-[#0F172A] animate-fadeIn">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#F3F0FF] text-[#635BFF] border border-[#E0DBFF] mb-1">
                {focusedNode.category.toUpperCase()} • {focusedNode.zone}
              </span>
              <h4 className="font-bold text-sm text-[#0F172A] leading-tight">
                {focusedNode.name}
              </h4>
            </div>
            <button
              onClick={() => setFocusedNode(null)}
              className="p-1 text-[#94A3B8] hover:text-[#0F172A] rounded-lg transition-colors"
              title="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#64748B] mt-2 leading-relaxed line-clamp-2">
            {focusedNode.description}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                handleSelectStart(focusedNode.id);
                setActiveMode('directions');
              }}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Start Here</span>
            </button>

            <button
              onClick={() => {
                handleSelectDestination(focusedNode.id);
                setActiveMode('directions');
              }}
              className="px-2.5 py-1.5 bg-[#635BFF] hover:bg-[#5145E5] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions</span>
            </button>
          </div>

          <div className="mt-2 text-center">
            <Link
              to={`/destinations/${focusedNode.id}`}
              className="text-[11px] font-semibold text-[#635BFF] hover:underline"
            >
              View Full Building Directory →
            </Link>
          </div>
        </div>
      )}

      {/* MOBILE TOP SEARCH BAR & BOTTOM SHEET */}
      <div className="lg:hidden absolute top-3 left-3 right-3 z-30">
        <div className="bg-white/95 backdrop-blur-xl border border-[#E8EAF2] rounded-2xl shadow-lg p-2.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#635BFF] flex-shrink-0 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setMobileSheetExpanded(true);
            }}
            placeholder="Search blocks, rooms, gates..."
            className="w-full bg-transparent text-xs font-medium text-[#0F172A] focus:outline-none"
          />
          <button
            onClick={() => setMobileSheetExpanded(!mobileSheetExpanded)}
            className="p-1.5 bg-slate-100 text-[#0F172A] rounded-xl text-xs font-bold flex-shrink-0"
          >
            {mobileSheetExpanded ? 'Map' : 'List'}
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET (Compact & Expanded) */}
      <div className="lg:hidden absolute bottom-3 left-3 right-3 z-30">
        <div className="bg-white/95 backdrop-blur-2xl border border-[#E8EAF2] rounded-3xl shadow-2xl p-4">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF]"></span>
              <span className="text-xs font-bold text-[#0F172A]">
                {activeDestinationNode ? activeDestinationNode.name : 'Select Destination'}
              </span>
            </div>
            <button
              onClick={() => setMobileSheetExpanded(!mobileSheetExpanded)}
              className="text-xs font-semibold text-[#635BFF] flex items-center gap-1"
            >
              <span>{mobileSheetExpanded ? 'Collapse' : 'Details & Directions'}</span>
              {mobileSheetExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {currentRoute && currentRoute.success && (
            <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
              <span>{currentRoute.distance}m • {currentRoute.timeMinutes} min walk</span>
              <button
                onClick={() => setMobileSheetExpanded(true)}
                className="text-[11px] font-bold text-[#635BFF]"
              >
                Start Navigation →
              </button>
            </div>
          )}

          {mobileSheetExpanded && (
            <div className="max-h-[60vh] overflow-y-auto pt-3 border-t border-slate-100 space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectStart('gate-1')}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-left"
                >
                  Start: {activeStartNode?.name || 'Gate 1'}
                </button>
                <button
                  onClick={() => handleSelectDestination('block-34')}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-left"
                >
                  Dest: {activeDestinationNode?.name || 'Block 34'}
                </button>
              </div>

              {currentRoute && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Steps</span>
                  {currentRoute.steps?.slice(0, 4).map((s, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded-xl text-[11px] text-[#0F172A]">
                      {idx + 1}. {s.instruction}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
