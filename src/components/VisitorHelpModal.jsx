import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  PhoneCall, 
  Compass, 
  DoorOpen, 
  CheckSquare, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ArrowRight,
  Info
} from 'lucide-react';

export default function VisitorHelpModal({
  isOpen,
  onClose,
  onSelectStartGate
}) {
  const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'contacts' | 'gates' | 'checklist'
  const [checkedItems, setCheckedItems] = useState({});

  if (!isOpen) return null;

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const faqItems = [
    {
      q: "Where is Block 34 located on campus?",
      a: "Block 34 is the central flagship building of the School of Computer Science & Engineering. It is situated along the Central Academic Spine, directly northeast of the Central Fountain and north of the Central Library (Block 28). From Gate 1, walk straight down the Main GT Boulevard for approximately 390 meters."
    },
    {
      q: "Which entrance gate should first-time visitors and parents use?",
      a: "Gate 1 (Main GT Road Entrance) is the primary public and visitor entrance equipped with a visitor reception kiosk, automated security turnstiles, and direct pedestrian sidewalks towards academic blocks 13, 32, and 34."
    },
    {
      q: "How does the Last-50-Metre indoor navigation work?",
      a: "Once you arrive at your destination building (e.g. Block 34), standard outdoor maps fall short. Our Last-50m guidance gives landmark-based indoor visual cues: entering through the central sliding glass doors, elevator vs. staircase locations, and specific door plaques (such as Room 34-205 Seminar Hall on Floor 2)."
    },
    {
      q: "What should external exam candidates do during exam days?",
      a: "Switch to 'Events & Exams' in the top menu. Select your examination event to view designated entry gates, active quiet corridors, and 1-click directions straight to your designated examination hall."
    },
    {
      q: "How can I find a shaded or covered route during hot sunny days or rain?",
      a: "In the Route Planner, toggle 'Covered Walkways Prioritized'. The graph routing engine will penalize open roads and route you through shaded colonnades, covered pedestrian link bridges, and inter-block corridors."
    },
    {
      q: "Are the physical distances and walking times accurate?",
      a: "All positions and walking times in this demo prototype are illustrative schematic models for college project evaluation. They are calculated using standard human walking speed (~1.2 m/s). University administrators can import verified GIS surveys anytime via the Admin Data panel."
    }
  ];

  const emergencyContacts = [
    {
      role: "Central Security Control Room",
      location: "Gate 1 Main Post",
      contact: "+91 1824 517000 (Demo)",
      available: "24/7 Hours Active",
      badge: "Emergency"
    },
    {
      role: "Uni-Hospital & Medical Triage",
      location: "Next to UniMall & Food Park",
      contact: "+91 1824 517108 (Demo)",
      available: "24/7 Ambulance on Standby",
      badge: "Medical"
    },
    {
      role: "Visitor Reception & Admissions Desk",
      location: "Block 13 Foyer (Ground Floor)",
      contact: "+91 1824 517200 (Demo)",
      available: "09:00 AM – 05:30 PM",
      badge: "Helpdesk"
    },
    {
      role: "Examination Center Inquiry Cell",
      location: "Block 34 Floor 4 (Room 34-402)",
      contact: "+91 1824 517350 (Demo)",
      available: "Active on Exam Days",
      badge: "Academics"
    }
  ];

  const gatesList = [
    {
      id: "gate-1",
      name: "Gate 1 (Main GT Road)",
      bestFor: "First-time visitors, parents, admissions, and exam candidates.",
      highlights: "Direct boulevard to Block 34, Auto-rickshaw stand, Visitor reception.",
      color: "border-emerald-200 bg-emerald-50/50"
    },
    {
      id: "gate-2",
      name: "Gate 2 (North Gate)",
      bestFor: "Girls Hostels, North Residential Area, and Auditorium access.",
      highlights: "Close to Shanti Devi Mittal Auditorium and Unipolis amphitheater.",
      color: "border-sky-200 bg-sky-50/50"
    },
    {
      id: "gate-3",
      name: "Gate 3 (Sports Complex Gate)",
      bestFor: "Athletes, sports events, indoor stadiums, and convocation bus bays.",
      highlights: "Direct access to Olympic pool, gymnasium, and sports arenas.",
      color: "border-purple-200 bg-purple-50/50"
    },
    {
      id: "gate-4",
      name: "Gate 4 (UniMall & Commercial Gate)",
      bestFor: "Delivery riders, postal parcels, banking, and dining visitors.",
      highlights: "Instant drop-off for UniMall, banks, food plaza, and campus hospital.",
      color: "border-amber-200 bg-amber-50/50"
    }
  ];

  const checklistItems = [
    "Identify your assigned entry gate (e.g. Gate 1 on GT Road).",
    "Scan the physical QR waypoint signboard at the gate or choose Gate 1 in the app.",
    "Search for your target block (e.g. Block 34) or specific room (e.g. 34-205).",
    "Review the calculated shortest path, distance (~390m), and estimated walking time.",
    "Toggle 'Covered Walkways Prioritized' if traveling during peak sun or rainfall.",
    "Follow turn-by-turn waypoint cues past the Central Fountain roundabout.",
    "On reaching the building, launch 'Last-50m Guidance' for floor and door cues.",
    "Confirm your arrival to conclude the navigation."
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8EAF2] overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-white p-5 flex items-center justify-between border-b border-[#E8EAF2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F3F0FF] text-[#635BFF]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#635BFF] uppercase">
                Campus Navigation Guide
              </span>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Visitor Help, FAQs & Campus Guide
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-[#E8EAF2] overflow-x-auto">
          {[
            { id: 'faq', label: 'Frequently Asked Questions', icon: <Compass className="w-3.5 h-3.5" /> },
            { id: 'gates', label: 'Campus Gate Directory', icon: <DoorOpen className="w-3.5 h-3.5" /> },
            { id: 'checklist', label: 'Visitor Checklist', icon: <CheckSquare className="w-3.5 h-3.5" /> },
            { id: 'contacts', label: 'Emergency & Helpdesks', icon: <PhoneCall className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#635BFF] shadow-xs border border-[#E8EAF2]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 mb-1 flex items-start gap-2">
                    <span className="text-orange-600 font-black">Q{idx + 1}.</span>
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-5">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: GATES DIRECTORY */}
          {activeTab === 'gates' && (
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs text-orange-950 flex items-center gap-2">
                <Info className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>
                  Select any gate below to immediately set it as your navigation starting point.
                </span>
              </div>

              {gatesList.map((g) => (
                <div key={g.id} className={`p-4 rounded-2xl border ${g.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{g.name}</span>
                    </div>
                    <p className="text-xs text-slate-700"><strong>Best For:</strong> {g.bestFor}</p>
                    <p className="text-[11px] text-slate-500"><strong>Key Landmarks:</strong> {g.highlights}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectStartGate(g.id);
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-[#635BFF] hover:bg-[#5145E5] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    <span>Start from {g.name.split(' (')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                A simple step-by-step checklist to guide first-time visitors, parents, and examination candidates from arrival to destination.
              </p>
              <div className="space-y-2">
                {checklistItems.map((item, idx) => (
                  <label
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      checkedItems[idx] 
                        ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 line-through' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[idx]}
                      onChange={() => {}}
                      className="w-4 h-4 text-[#635BFF] rounded mt-0.5"
                    />
                    <span className="text-xs font-medium leading-relaxed">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Academic Simulation Notice:</strong> The contact numbers below are representative campus hotline extensions designed for college project presentation.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyContacts.map((contact, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {contact.badge}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {contact.available}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">{contact.role}</h5>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#635BFF]" /> {contact.location}
                    </div>
                    <div className="text-xs font-mono font-bold text-[#0F172A] pt-1">
                      {contact.contact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-[#E8EAF2] flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Campus Navigator • Visitor Support System
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
