import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  QrCode, 
  FlaskConical, 
  FileText, 
  Presentation, 
  Database, 
  Star, 
  Menu, 
  X, 
  HelpCircle,
  ChevronDown,
  Search,
  Sparkles,
  Users,
  User,
  Layers
} from 'lucide-react';

export default function Navbar({
  favoritesCount = 0,
  onOpenFavorites,
  onOpenHelp,
  onSelectModule,
  isHighContrast,
  onToggleHighContrast,
  isLargeText,
  onToggleLargeText,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const secondaryModules = [
    { id: 'qr', label: 'QR Waypoints', icon: <QrCode className="w-4 h-4 text-[#635BFF]" />, desc: 'Physical sign simulator' },
    { id: 'usability', label: 'Usability Lab', icon: <FlaskConical className="w-4 h-4 text-emerald-600" />, desc: 'Task time & SUS scoring' },
    { id: 'research', label: 'Research & Empathy', icon: <Sparkles className="w-4 h-4 text-amber-500" />, desc: 'User persona & journey map' },
    { id: 'report', label: 'Academic Report', icon: <FileText className="w-4 h-4 text-sky-600" />, desc: 'Formal B.Tech capstone' },
    { id: 'presentation', label: 'Pitch Deck (13 Slides)', icon: <Presentation className="w-4 h-4 text-purple-600" />, desc: 'Evaluator presentation' },
    { id: 'admin', label: 'Data Manager', icon: <Database className="w-4 h-4 text-slate-600" />, desc: 'Node & edge JSON tools' },
  ];

  const handleModuleClick = (id) => {
    setMoreMenuOpen(false);
    setMobileMenuOpen(false);
    if (onSelectModule) {
      onSelectModule(id);
    }
  };

  const navLinkClass = ({ isActive }) => 
    `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[14px] font-medium whitespace-nowrap transition-all duration-200 ${
      isActive
        ? 'text-[#635BFF] font-semibold bg-[#F3F0FF] shadow-xs'
        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#E8EAF2] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-6">
          
          {/* Group 1 (Left): Brand Logo, Product Name, LPU Campus label */}
          <Link 
            to="/" 
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            {/* Custom Location Pin Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#8075FF] text-white flex items-center justify-center shadow-md shadow-[#635BFF]/20 group-hover:scale-105 transition-all duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" fillOpacity="0.2" />
                <circle cx="12" cy="9" r="2.5" fill="white" />
              </svg>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[17px] font-bold tracking-tight text-[#0F172A] group-hover:text-[#635BFF] transition-colors whitespace-nowrap">
                Campus Navigator
              </span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3F0FF] text-[#635BFF] border border-[#E0DBFF] whitespace-nowrap">
                LPU Campus
              </span>
            </div>
          </Link>

          {/* Group 2 (Center): Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 flex-shrink-0">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/map" className={navLinkClass}>
              <Compass className="w-4 h-4 text-[#635BFF]" />
              <span>Explore Map</span>
            </NavLink>

            <NavLink to="/destinations" className={navLinkClass}>
              Destinations
            </NavLink>

            <NavLink to="/community" className={navLinkClass}>
              <Users className="w-4 h-4 text-[#635BFF]" />
              <span>Community</span>
            </NavLink>

            <NavLink to="/events" className={navLinkClass}>
              Events
            </NavLink>

            <NavLink to="/help" className={navLinkClass}>
              Help
            </NavLink>

            {/* Academic Tools / Modules Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70 transition-colors whitespace-nowrap"
                aria-haspopup="true"
                aria-expanded={moreMenuOpen}
              >
                <span>Modules</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E8EAF2] py-2 z-50 animate-fadeIn">
                  <div className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    Academic Showcase Tools
                  </div>
                  {secondaryModules.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleModuleClick(m.id)}
                      className="w-full px-3.5 py-2 text-left flex items-start gap-3 hover:bg-slate-50 transition-colors text-[#0F172A]"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100/80 mt-0.5">
                        {m.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#0F172A]">{m.label}</div>
                        <div className="text-[11px] text-[#64748B]">{m.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Group 3 (Right): Accessibility, Saved Places, User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* Accessibility Controls */}
            <div className="hidden sm:flex items-center bg-slate-100/80 border border-[#E8EAF2] rounded-xl p-0.5 text-xs">
              <button
                onClick={onToggleLargeText}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  isLargeText ? 'bg-[#635BFF] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="Accessibility: Increase text size"
                aria-label="Toggle larger text size"
              >
                A+
              </button>
              <button
                onClick={onToggleHighContrast}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  isHighContrast ? 'bg-amber-400 text-black font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="Accessibility: High contrast mode"
                aria-label="Toggle high contrast display"
              >
                Contrast
              </button>
            </div>

            {/* Saved Destinations (Star + Count) */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2.5 text-[#64748B] hover:text-amber-500 hover:bg-amber-50/70 rounded-xl border border-[#E8EAF2] transition-colors"
              title="Saved places"
              aria-label="View saved places"
            >
              <Star className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#635BFF] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar Link */}
            <NavLink
              to="/profile"
              className={({ isActive }) => `p-2.5 rounded-xl border transition-colors ${
                isActive 
                  ? 'bg-[#F3F0FF] border-[#C7BDFF] text-[#635BFF]' 
                  : 'border-[#E8EAF2] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
              }`}
              title="My Profile & Settings"
              aria-label="User profile and settings"
            >
              <User className="w-4 h-4" />
            </NavLink>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#0F172A]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8EAF2] bg-white/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#E8EAF2]">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${isActive ? 'bg-[#F3F0FF] text-[#635BFF]' : 'bg-slate-50 text-[#0F172A]'}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${isActive ? 'bg-[#F3F0FF] text-[#635BFF]' : 'bg-[#635BFF] text-white'}`}
            >
              Explore Map
            </NavLink>
            <NavLink
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${isActive ? 'bg-[#F3F0FF] text-[#635BFF]' : 'bg-slate-50 text-[#0F172A]'}`}
            >
              Destinations
            </NavLink>
            <NavLink
              to="/community"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${isActive ? 'bg-[#F3F0FF] text-[#635BFF]' : 'bg-slate-50 text-[#0F172A]'}`}
            >
              Community
            </NavLink>
            <NavLink
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${isActive ? 'bg-[#F3F0FF] text-[#635BFF]' : 'bg-slate-50 text-[#0F172A]'}`}
            >
              Events
            </NavLink>
            <NavLink
              to="/help"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${isActive ? 'bg-[#F3F0FF] text-[#635BFF]' : 'bg-slate-50 text-[#0F172A]'}`}
            >
              Help & FAQs
            </NavLink>
            <NavLink
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `col-span-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left flex items-center gap-2 ${isActive ? 'bg-[#F3F0FF] text-[#635BFF]' : 'bg-slate-50 text-[#0F172A]'}`}
            >
              <User className="w-3.5 h-3.5" />
              <span>My Profile & Saved Destinations</span>
            </NavLink>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-1">
              Modules & Project Tools
            </span>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {secondaryModules.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleModuleClick(m.id)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center gap-2 border border-[#E8EAF2] bg-white text-[#64748B]"
                >
                  {m.icon}
                  <span className="truncate">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
