import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import CampusMap from './components/CampusMap';
import SearchBar from './components/SearchBar';
import PopularDestinations from './components/PopularDestinations';
import RoutePlanner from './components/RoutePlanner';
import Last50mGuidance from './components/Last50mGuidance';
import QRWayfinding from './components/QRWayfinding';
import EventMode from './components/EventMode';
import UsabilityTestLab from './components/UsabilityTestLab';
import ResearchEmpathy from './components/ResearchEmpathy';
import ProjectReport from './components/ProjectReport';
import ProjectPresentation from './components/ProjectPresentation';
import AdminManager from './components/AdminManager';
import FavoritesModal from './components/FavoritesModal';
import VisitorHelpModal from './components/VisitorHelpModal';
import QuickActions from './components/QuickActions';
import HowItWorks from './components/HowItWorks';

import { 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  ROOMS_CATALOG
} from './data/campusData';

import { findShortestPath, findAlternativeRoute } from './utils/dijkstra';
import { 
  Building2,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // --- Persistent Campus Data ---
  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem('p10_campus_nodes');
    return saved ? JSON.parse(saved) : INITIAL_NODES;
  });

  const [edges, setEdges] = useState(() => {
    const saved = localStorage.getItem('p10_campus_edges');
    return saved ? JSON.parse(saved) : INITIAL_EDGES;
  });

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('p10_campus_rooms');
    return saved ? JSON.parse(saved) : ROOMS_CATALOG;
  });

  // --- Active View Navigation ---
  // 'map' | 'events' | 'qr' | 'usability' | 'research' | 'report' | 'presentation' | 'admin'
  const [currentView, setCurrentView] = useState('map');

  // --- Navigation & Routing State ---
  const [startNodeId, setStartNodeId] = useState('gate-1'); // Default start at Gate 1
  const [destinationNodeId, setDestinationNodeId] = useState('block-34'); // Default hero destination: Block 34
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [preferCovered, setPreferCovered] = useState(false);

  // Calculated Routes
  const [activeRoute, setActiveRoute] = useState(null);
  const [alternativeRoute, setAlternativeRoute] = useState(null);

  // --- Modals and Drawers ---
  const [showLast50mModal, setShowLast50mModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // --- Accessibility States ---
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  // --- Favorites & Recent Searches ---
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('p10_favorites');
    return saved ? JSON.parse(saved) : ['block-34', 'room-34-205', 'gate-1'];
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('p10_recent_searches');
    return saved ? JSON.parse(saved) : ['Block 34', 'Gate 1', 'Room 34-205'];
  });

  // --- Event Mode Notice ---
  const [activeEventNotice, setActiveEventNotice] = useState(
    "CAMPUS EXAM ADVISORY: Mid-Term Examination active in Block 34 & Block 32. External candidates report via Gate 1."
  );

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('p10_campus_nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('p10_campus_edges', JSON.stringify(edges));
  }, [edges]);

  useEffect(() => {
    localStorage.setItem('p10_campus_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('p10_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('p10_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Apply Accessibility Classes to Body
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    if (isLargeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [isLargeText]);

  // Dijkstra Route Calculation Trigger
  const handleCalculateRoute = useCallback(() => {
    if (!startNodeId || !destinationNodeId) return;

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
  }, [startNodeId, destinationNodeId, nodes, edges, preferCovered]);

  // Auto-calculate initial route on first load or selection changes
  useEffect(() => {
    if (startNodeId && destinationNodeId) {
      handleCalculateRoute();
    }
  }, [startNodeId, destinationNodeId, preferCovered, handleCalculateRoute]);

  const handleResetRoute = () => {
    setStartNodeId('');
    setDestinationNodeId('');
    setSelectedRoom(null);
    setActiveRoute(null);
    setAlternativeRoute(null);
  };

  // Selection Handlers
  const handleSelectDestination = (nodeId) => {
    setDestinationNodeId(nodeId);
    setCurrentView('map');
  };

  const handleSelectStart = (nodeId) => {
    setStartNodeId(nodeId);
    setCurrentView('map');
  };

  const handleSelectRoom = (roomObj) => {
    setSelectedRoom(roomObj);
    setDestinationNodeId(roomObj.blockId);
    setCurrentView('map');
  };

  const handleToggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleAddRecentSearch = (term) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 8);
    });
  };

  // Reset to default dataset
  const handleResetToDefault = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setRooms(ROOMS_CATALOG);
    localStorage.removeItem('p10_campus_nodes');
    localStorage.removeItem('p10_campus_edges');
    localStorage.removeItem('p10_campus_rooms');
    setStartNodeId('gate-1');
    setDestinationNodeId('block-34');
    setSelectedRoom(null);
  };

  // Event Selection Route Trigger
  const handleSelectEventRoute = (eventObj) => {
    if (eventObj.recommendedGate) {
      setStartNodeId(eventObj.recommendedGate);
    }
    setDestinationNodeId(eventObj.primaryDestinationId);
    if (eventObj.primaryRoomId) {
      const rm = rooms.find(r => r.id === eventObj.primaryRoomId);
      if (rm) setSelectedRoom(rm);
    }
    setCurrentView('map');
  };

  const destinationNode = useMemo(() => {
    return nodes.find(n => n.id === destinationNodeId) || null;
  }, [nodes, destinationNodeId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors">
      {/* Top Universal Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setShowFavoritesModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        isLargeText={isLargeText}
        onToggleLargeText={() => setIsLargeText(!isLargeText)}
      />

      {/* Main Content Area Based on Active View */}
      <main className="flex-1">
        {currentView === 'map' && (
          <div className="w-full">
            {/* HERO SECTION WITH HEADLINE “Never Get Lost on Campus Again” */}
            <section className="relative bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 text-white pt-10 pb-16 px-4 border-b border-navy-800 overflow-hidden">
              {/* Background Ambient Glows */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative max-w-5xl mx-auto text-center space-y-6">
                {/* University Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-orange-400 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  <span>Lovely Professional University • Campus Wayfinding System</span>
                </div>

                {/* Primary Headline Requested by User */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                  Never Get Lost on Campus Again.
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                  Interactive pedestrian wayfinding, shortest-path corridor routing, and last-50m indoor room guidance for visitors, parents, students, and exam candidates.
                </p>

                {/* Prominent Universal Search Bar Inside Hero */}
                <div className="pt-2 max-w-2xl mx-auto">
                  <SearchBar
                    nodes={nodes}
                    rooms={rooms}
                    onSelectDestination={handleSelectDestination}
                    onSelectStart={handleSelectStart}
                    onSelectRoom={handleSelectRoom}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    recentSearches={recentSearches}
                    onAddRecentSearch={handleAddRecentSearch}
                  />
                </div>

                {/* Key Status Tickers */}
                <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-300">
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-orange-400" />
                    <strong>Hero Block:</strong> Block 34 (CSE & Deans)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <strong>Primary Entry:</strong> Gate 1 (GT Road)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <strong>Avg. Walk:</strong> ~6 Minutes (~390m)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <strong>Navigation:</strong> Shaded Corridor Compatible
                  </span>
                </div>
              </div>
            </section>

            {/* MAIN WORKSPACE CONTENT */}
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
              {/* Quick Action Navigation Buttons */}
              <QuickActions
                onFindBlock={() => {
                  setDestinationNodeId('block-34');
                  window.scrollTo({ top: 480, behavior: 'smooth' });
                }}
                onFindRoom={() => {
                  const sampleRoom = rooms.find(r => r.id === '34-205');
                  if (sampleRoom) handleSelectRoom(sampleRoom);
                  setShowLast50mModal(true);
                }}
                onFindExamHall={() => {
                  setCurrentView('events');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onFindGate={() => {
                  setStartNodeId('gate-1');
                  window.scrollTo({ top: 480, behavior: 'smooth' });
                }}
                onOpenHelp={() => setShowHelpModal(true)}
              />

              {/* Popular Destinations Chips */}
              <PopularDestinations
                rooms={rooms}
                onSelectDestination={handleSelectDestination}
                onSelectRoom={handleSelectRoom}
              />

              {/* Interactive Campus Map & Route Planner Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Interactive Schematic Vector Map */}
                <div className="lg:col-span-7 xl:col-span-8">
                  <CampusMap
                    nodes={nodes}
                    edges={edges}
                    startNodeId={startNodeId}
                    destinationNodeId={destinationNodeId}
                    activeRoute={activeRoute}
                    onSelectNode={(node) => {
                      if (!startNodeId) {
                        setStartNodeId(node.id);
                      } else {
                        setDestinationNodeId(node.id);
                      }
                    }}
                    onSetStart={(id) => setStartNodeId(id)}
                    onSetDestination={(id) => setDestinationNodeId(id)}
                    selectedRoom={selectedRoom}
                  />
                </div>

                {/* Right: Dijkstra Route Planner & Turn-by-Turn Card */}
                <div className="lg:col-span-5 xl:col-span-4">
                  <RoutePlanner
                    nodes={nodes}
                    edges={edges}
                    startNodeId={startNodeId}
                    destinationNodeId={destinationNodeId}
                    onSetStart={setStartNodeId}
                    onSetDestination={setDestinationNodeId}
                    activeRoute={activeRoute}
                    alternativeRoute={alternativeRoute}
                    onCalculateRoute={handleCalculateRoute}
                    onResetRoute={handleResetRoute}
                    onOpenLast50m={() => setShowLast50mModal(true)}
                    selectedRoom={selectedRoom}
                    preferCovered={preferCovered}
                    onTogglePreferCovered={() => setPreferCovered(!preferCovered)}
                  />
                </div>
              </div>

              {/* How Wayfinding Works Accordion */}
              <HowItWorks />
            </div>
          </div>
        )}

        {/* EVENTS & EXAMS VIEW */}
        {currentView === 'events' && (
          <EventMode
            onSelectEventRoute={handleSelectEventRoute}
            activeEventNotice={activeEventNotice}
            onDismissNotice={() => setActiveEventNotice('')}
          />
        )}

        {/* QR WAYFINDING VIEW */}
        {currentView === 'qr' && (
          <QRWayfinding
            nodes={nodes}
            onSetStartWaypoint={(id) => {
              setStartNodeId(id);
              setCurrentView('map');
            }}
            onNavigateToBlock34={(startId) => {
              setStartNodeId(startId);
              setDestinationNodeId('block-34');
              setCurrentView('map');
            }}
          />
        )}

        {/* USABILITY TESTING LAB VIEW */}
        {currentView === 'usability' && (
          <UsabilityTestLab
            nodes={nodes}
            onSelectRouteForTest={(startId, destId) => {
              setStartNodeId(startId);
              setDestinationNodeId(destId);
              setCurrentView('map');
            }}
          />
        )}

        {/* RESEARCH & EMPATHY VIEW */}
        {currentView === 'research' && (
          <ResearchEmpathy />
        )}

        {/* ACADEMIC PROJECT REPORT VIEW */}
        {currentView === 'report' && (
          <ProjectReport />
        )}

        {/* PRESENTATION PITCH DECK VIEW */}
        {currentView === 'presentation' && (
          <ProjectPresentation
            onSwitchToMap={() => setCurrentView('map')}
          />
        )}

        {/* ADMIN / DATA MANAGEMENT VIEW */}
        {currentView === 'admin' && (
          <AdminManager
            nodes={nodes}
            edges={edges}
            rooms={rooms}
            onSaveNodes={setNodes}
            onSaveEdges={setEdges}
            onSaveRooms={setRooms}
            onResetToDefault={handleResetToDefault}
          />
        )}
      </main>

      {/* Last-50-Metre Final Approach Modal */}
      {showLast50mModal && (
        <Last50mGuidance
          destinationNode={destinationNode}
          selectedRoom={selectedRoom}
          onClose={() => setShowLast50mModal(false)}
          onCompleteArrival={(arrivalDetails) => {
            console.log("Arrival confirmed:", arrivalDetails);
          }}
        />
      )}

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={favorites}
        nodes={nodes}
        rooms={rooms}
        onSelectFavorite={(item) => {
          if (item.type === 'room') {
            handleSelectRoom(item.roomObj);
          } else {
            handleSelectDestination(item.nodeId);
          }
        }}
        onRemoveFavorite={handleToggleFavorite}
      />

      {/* Visitor Help & FAQ Modal */}
      <VisitorHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        onSelectStartGate={(gateId) => {
          setStartNodeId(gateId);
          setCurrentView('map');
        }}
        onSelectDestination={(destId) => {
          setDestinationNodeId(destId);
          setCurrentView('map');
        }}
      />

      {/* Universal Footer */}
      <footer className="no-print bg-navy-950 text-slate-400 border-t border-navy-800 text-xs py-10 px-4 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-600 text-white font-black text-base flex items-center justify-center">
                34
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  P10 – Which Block Is 34? | Campus Wayfinding
                </h4>
                <p className="text-[11px] text-slate-400">
                  Lovely Professional University • B.Tech Capstone Project 2026
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A modern, accessible pedestrian wayfinding system solving campus transit friction through Dijkstra shortest-path calculations, covered corridor options, QR waypoints, and last-50m indoor navigation.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-2">
            <h5 className="font-extrabold text-xs text-white uppercase tracking-wider">
              Application Modules
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('map')} className="hover:text-orange-400 transition-colors">
                  🗺️ Interactive Campus Map
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('events')} className="hover:text-orange-400 transition-colors">
                  ⚡ Events & Exam Mode
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('qr')} className="hover:text-orange-400 transition-colors">
                  📱 QR Wayfinding Signs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('usability')} className="hover:text-orange-400 transition-colors">
                  🧪 Usability Testing Lab
                </button>
              </li>
              <li>
                <button onClick={() => setShowHelpModal(true)} className="hover:text-orange-400 transition-colors">
                  ❓ Visitor Help & Gate Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Project Credits */}
          <div className="space-y-2">
            <h5 className="font-extrabold text-xs text-white uppercase tracking-wider">
              Academic Documentation
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('report')} className="hover:text-orange-400 transition-colors">
                  📄 Formal College Project Report
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('presentation')} className="hover:text-orange-400 transition-colors">
                  📊 Evaluator Pitch Deck (13 Slides)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('research')} className="hover:text-orange-400 transition-colors">
                  🔬 Design Thinking & HMW Research
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin')} className="hover:text-orange-400 transition-colors">
                  ⚙️ Admin Data Manager & JSON Importer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 P10 Student Project Team • School of Computer Science & Engineering, LPU
          </div>
          <div className="text-amber-400 text-center sm:text-right font-medium">
            ⚠️ Simulated Demonstration Data: All coordinates, pathways & rooms are illustrative models.
          </div>
        </div>
      </footer>
    </div>
  );
}
