import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  QrCode, 
  FlaskConical, 
  HeartHandshake, 
  FileText, 
  Presentation, 
  Database, 
  Star, 
  Menu, 
  X, 
  HelpCircle
} from 'lucide-react';

export default function Navbar({
  currentView,
  onSelectView,
  favoritesCount = 0,
  onOpenFavorites,
  onOpenHelp,
  isHighContrast,
  onToggleHighContrast,
  isLargeText,
  onToggleLargeText,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'map', label: 'Map & Nav', icon: <Compass className="w-4 h-4" /> },
    { id: 'events', label: 'Events & Exams', icon: <Calendar className="w-4 h-4" /> },
    { id: 'qr', label: 'QR Waypoints', icon: <QrCode className="w-4 h-4" /> },
    { id: 'usability', label: 'Usability Lab', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'research', label: 'Research & Empathy', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'report', label: 'Academic Report', icon: <FileText className="w-4 h-4" /> },
    { id: 'presentation', label: 'Presentation Deck', icon: <Presentation className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin Data', icon: <Database className="w-4 h-4" /> },
  ];

  const handleNavClick = (id) => {
    onSelectView(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors">
      {/* Topmost University & Demo Disclaimer Strip */}
      <div className="bg-navy-950 text-slate-300 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-navy-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span className="font-extrabold text-white tracking-wide">
            LOVELY PROFESSIONAL UNIVERSITY
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            P10 Academic Wayfinding Project
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Demo Badge */}
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
            DEMO MODE (Illustrative Data)
          </span>

          {/* Accessibility Toggles */}
          <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
            <button
              onClick={onToggleLargeText}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                isLargeText ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Toggle Large Text Mode (Accessibility)"
            >
              A{isLargeText ? '+' : ''}
            </button>
            <button
              onClick={onToggleHighContrast}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                isHighContrast ? 'bg-yellow-400 text-black' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Toggle High Contrast Mode (WCAG AAA)"
            >
              Contrast
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onSelectView('map')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            34
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight group-hover:text-orange-600 transition-colors">
                Which Block Is 34?
              </h1>
              <span className="hidden md:inline px-1.5 py-0.2 rounded text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-200">
                P10
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Wayfinding for Visitors and Newcomers • LPU Campus
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentView === item.id
                  ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Tools (Favorites, Help & Mobile Menu) */}
        <div className="flex items-center gap-2">
          {/* Visitor Help Modal Trigger */}
          <button
            onClick={onOpenHelp}
            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl border border-slate-200 transition-all flex items-center gap-1"
            title="Campus Visitor Help & FAQs"
          >
            <HelpCircle className="w-5 h-5 text-orange-500" />
            <span className="hidden md:inline text-xs font-bold text-slate-700">Help</span>
          </button>

          {/* Favorites Star Drawer Button */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 text-slate-600 hover:text-amber-500 hover:bg-amber-50 rounded-xl border border-slate-200 transition-all"
            title="Saved Favorite Destinations"
          >
            <Star className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-500' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            title="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  currentView === item.id
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
