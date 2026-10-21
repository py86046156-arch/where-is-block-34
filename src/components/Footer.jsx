import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ _onOpenHelp, onSelectModule }) {
  return (
    <footer className="no-print bg-white text-[#64748B] border-t border-[#E8EAF2] text-xs py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Info */}
        <div className="space-y-3.5 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#8075FF] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" fillOpacity="0.2" />
                <circle cx="12" cy="9" r="2.5" fill="white" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0F172A]">
                Campus Navigator
              </h4>
              <p className="text-[11px] text-[#94A3B8]">
                Lovely Professional University · Wayfinding Platform
              </p>
            </div>
          </div>
          
          <p className="text-xs text-[#64748B] leading-relaxed max-w-md">
            An intelligent pedestrian wayfinding and community platform solving university campus transit friction through Dijkstra shortest-path calculations, shaded walkway preferences, and last-50m indoor room guidance.
          </p>
        </div>

        {/* Navigation Pages */}
        <div className="space-y-2.5">
          <h5 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">
            Explore Campus
          </h5>
          <ul className="space-y-2 text-xs text-[#64748B]">
            <li>
              <Link to="/" className="hover:text-[#635BFF] transition-colors">
                Home Overview
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-[#635BFF] transition-colors font-medium text-[#635BFF]">
                Full-Screen Campus Map
              </Link>
            </li>
            <li>
              <Link to="/destinations" className="hover:text-[#635BFF] transition-colors">
                All Destinations
              </Link>
            </li>
            <li>
              <Link to="/community" className="hover:text-[#635BFF] transition-colors">
                Campus Connect Community
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-[#635BFF] transition-colors">
                Events & Exam Mode
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:text-[#635BFF] transition-colors">
                Help, FAQs & Gates
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-[#635BFF] transition-colors">
                My Profile & Saved Places
              </Link>
            </li>
          </ul>
        </div>

        {/* Academic Capstone Project Links */}
        <div className="space-y-2.5">
          <h5 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">
            Academic Showcase
          </h5>
          <ul className="space-y-2 text-xs text-[#64748B]">
            <li>
              <button 
                onClick={() => onSelectModule && onSelectModule('report')} 
                className="hover:text-[#635BFF] transition-colors text-left"
              >
                Formal Capstone Report
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectModule && onSelectModule('presentation')} 
                className="hover:text-[#635BFF] transition-colors text-left"
              >
                Evaluator Pitch Deck (13 Slides)
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectModule && onSelectModule('research')} 
                className="hover:text-[#635BFF] transition-colors text-left"
              >
                Design Thinking & Research
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectModule && onSelectModule('usability')} 
                className="hover:text-[#635BFF] transition-colors text-left"
              >
                Usability Testing Lab
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectModule && onSelectModule('qr')} 
                className="hover:text-[#635BFF] transition-colors text-left"
              >
                Physical QR Waypoint Signs
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectModule && onSelectModule('admin')} 
                className="hover:text-[#635BFF] transition-colors text-left"
              >
                Data Manager & JSON Import
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Attribution & Demo Notice */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#E8EAF2] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#94A3B8]">
        <div>
          © 2026 Campus Navigator · Lovely Professional University B.Tech Capstone Project
        </div>
        <div className="text-[#64748B] text-center sm:text-right font-medium">
          Illustrative schematic model & local prototype dataset for academic evaluation.
        </div>
      </div>
    </footer>
  );
}
