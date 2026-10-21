import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Navigation & Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import CommunityPage from './pages/CommunityPage';
import CommunityPostDetailPage from './pages/CommunityPostDetailPage';
import EventsPage from './pages/EventsPage';
import HelpPage from './pages/HelpPage';
import ProfilePage from './pages/ProfilePage';

// Modals & Academic Showcase Modules
import Last50mGuidance from './components/Last50mGuidance';
import FavoritesModal from './components/FavoritesModal';
import VisitorHelpModal from './components/VisitorHelpModal';
import QRWayfinding from './components/QRWayfinding';
import UsabilityTestLab from './components/UsabilityTestLab';
import ResearchEmpathy from './components/ResearchEmpathy';
import ProjectReport from './components/ProjectReport';
import ProjectPresentation from './components/ProjectPresentation';
import AdminManager from './components/AdminManager';

// Dataset & Utilities
import { 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  ROOMS_CATALOG 
} from './data/campusData';

// Automatic Scroll-to-Top on Route Navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

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

  // --- Favorites & Recent Searches ---
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('p10_favorites');
    return saved ? JSON.parse(saved) : ['block-34', 'room-34-205', 'gate-1'];
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('p10_recent_searches');
    return saved ? JSON.parse(saved) : ['Block 34', 'Gate 1', 'Room 34-205'];
  });

  // --- Modals & Drawers ---
  const [showLast50mModal, setShowLast50mModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeAcademicModule, setActiveAcademicModule] = useState(null); // 'report' | 'presentation' | 'usability' | 'qr' | 'research' | 'admin'

  // --- Accessibility States ---
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

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

  // Handlers
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

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('p10_recent_searches');
  };

  // Reset to default dataset
  const handleResetToDefault = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setRooms(ROOMS_CATALOG);
    localStorage.removeItem('p10_campus_nodes');
    localStorage.removeItem('p10_campus_edges');
    localStorage.removeItem('p10_campus_rooms');
    setFavorites(['block-34', 'room-34-205', 'gate-1']);
    setRecentSearches(['Block 34', 'Gate 1', 'Room 34-205']);
    alert("Reset successful: Campus dataset and preferences restored to university default.");
  };

  // Active target node for Last 50m guidance
  const defaultHeroNode = nodes.find(n => n.id === 'block-34');
  const defaultSeminarRoom = rooms.find(r => r.id === '34-205');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#F3F0FF] selection:text-[#23187F]">
      <ScrollToTop />

      {/* Shared Navigation Header */}
      <Navbar
        favoritesCount={favorites.length}
        onOpenFavorites={() => setShowFavoritesModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        onSelectModule={(moduleId) => setActiveAcademicModule(moduleId)}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        isLargeText={isLargeText}
        onToggleLargeText={() => setIsLargeText(!isLargeText)}
      />

      {/* Main Page Routing */}
      {/* Main Page Content with Route-aware page transition */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeAcademicModule ? (
          /* ACADEMIC SHOWCASE OVERLAY VIEW */
          <div className="w-full max-w-7xl mx-auto px-4 py-8 page-transition-enter">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-[#E8EAF2]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                Academic Capstone Module: {activeAcademicModule.toUpperCase()}
              </span>
              <button
                onClick={() => setActiveAcademicModule(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-semibold"
              >
                Close Module View & Return
              </button>
            </div>

            {activeAcademicModule === 'report' && <ProjectReport />}
            {activeAcademicModule === 'presentation' && (
              <ProjectPresentation onSwitchToMap={() => {
                setActiveAcademicModule(null);
                navigate('/map');
              }} />
            )}
            {activeAcademicModule === 'usability' && (
              <UsabilityTestLab
                nodes={nodes}
                onSelectRouteForTest={(startId, destId) => {
                  setActiveAcademicModule(null);
                  navigate(`/map?start=${startId}&dest=${destId}`);
                }}
              />
            )}
            {activeAcademicModule === 'qr' && (
              <QRWayfinding
                nodes={nodes}
                onSetStartWaypoint={(id) => {
                  setActiveAcademicModule(null);
                  navigate(`/map?start=${id}`);
                }}
                onNavigateToBlock34={(startId) => {
                  setActiveAcademicModule(null);
                  navigate(`/map?start=${startId}&dest=block-34`);
                }}
              />
            )}
            {activeAcademicModule === 'research' && <ResearchEmpathy />}
            {activeAcademicModule === 'admin' && (
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
          </div>
        ) : (
          <div key={location.pathname} className="flex-1 flex flex-col page-transition-enter">
            <Routes>
              {/* 1. Home Page: / */}
              <Route 
                path="/" 
                element={
                  <HomePage
                    nodes={nodes}
                    rooms={rooms}
                    edges={edges}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    recentSearches={recentSearches}
                    onAddRecentSearch={handleAddRecentSearch}
                  />
                } 
              />

              {/* 2. Explore Map: /map (Full-viewport Google Maps style interface) */}
              <Route 
                path="/map" 
                element={
                  <MapPage
                    nodes={nodes}
                    edges={edges}
                    rooms={rooms}
                    onOpenLast50m={() => setShowLast50mModal(true)}
                    recentSearches={recentSearches}
                    onAddRecentSearch={handleAddRecentSearch}
                  />
                } 
              />

              {/* 3. Destinations: /destinations */}
              <Route 
                path="/destinations" 
                element={
                  <DestinationsPage
                    nodes={nodes}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                } 
              />

              {/* 4. Destination Details: /destinations/:id */}
              <Route 
                path="/destinations/:id" 
                element={
                  <DestinationDetailPage
                    nodes={nodes}
                    rooms={rooms}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenLast50m={() => setShowLast50mModal(true)}
                  />
                } 
              />

              {/* 5. Campus Community: /community */}
              <Route 
                path="/community" 
                element={
                  <CommunityPage nodes={nodes} />
                } 
              />

              {/* 6. Community Post Details: /community/:postId */}
              <Route 
                path="/community/:postId" 
                element={
                  <CommunityPostDetailPage />
                } 
              />

              {/* 7. Events: /events */}
              <Route 
                path="/events" 
                element={
                  <EventsPage />
                } 
              />

              {/* 8. Help and FAQs: /help */}
              <Route 
                path="/help" 
                element={
                  <HelpPage />
                } 
              />

              {/* 9. User Profile: /profile */}
              <Route 
                path="/profile" 
                element={
                  <ProfilePage
                    nodes={nodes}
                    rooms={rooms}
                    favorites={favorites}
                    onRemoveFavorite={handleToggleFavorite}
                    recentSearches={recentSearches}
                    onClearRecentSearches={handleClearRecentSearches}
                    onResetToDefault={handleResetToDefault}
                    isHighContrast={isHighContrast}
                    onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
                    isLargeText={isLargeText}
                    onToggleLargeText={() => setIsLargeText(!isLargeText)}
                  />
                } 
              />
            </Routes>
          </div>
        )}
      </main>

      {/* Shared Footer (Hidden on /map to give 100% full-screen map experience) */}
      {location.pathname !== '/map' && (
        <Footer
          onOpenHelp={() => setShowHelpModal(true)}
          onSelectModule={(moduleId) => setActiveAcademicModule(moduleId)}
        />
      )}

      {/* Last-50-Metre Final Approach Modal */}
      {showLast50mModal && (
        <Last50mGuidance
          destinationNode={defaultHeroNode}
          selectedRoom={defaultSeminarRoom}
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
          setShowFavoritesModal(false);
          if (item.type === 'room') {
            navigate(`/map?dest=${item.nodeId}&room=${item.roomObj.id}`);
          } else {
            navigate(`/map?dest=${item.nodeId}`);
          }
        }}
        onRemoveFavorite={handleToggleFavorite}
      />

      {/* Visitor Help & FAQ Modal */}
      <VisitorHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        onSelectStartGate={(gateId) => {
          setShowHelpModal(false);
          navigate(`/map?start=${gateId}`);
        }}
        onSelectDestination={(destId) => {
          setShowHelpModal(false);
          navigate(`/map?dest=${destId}`);
        }}
      />
    </div>
  );
}
