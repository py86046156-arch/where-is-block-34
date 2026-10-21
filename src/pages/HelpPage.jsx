import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  Compass, 
  DoorOpen, 
  CheckSquare, 
  PhoneCall, 
  Send, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ArrowRight,
  Info,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'gates' | 'checklist' | 'contacts' | 'report'
  const [checkedItems, setCheckedItems] = useState({});
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackLocation, setFeedbackLocation] = useState('');
  const navigate = useNavigate();

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setReportSubmitted(true);
    setFeedbackText('');
    setFeedbackLocation('');
  };

  const faqItems = [
    {
      q: "Where is Block 34 located on campus?",
      a: "Block 34 is the central flagship building of the School of Computer Science & Engineering. It is situated along the Central Academic Spine, directly northeast of the Central Fountain and north of the Central Library (Block 28). From Gate 1, walk straight down the Main Boulevard for approximately 390 meters."
    },
    {
      q: "Which entrance gate should first-time visitors and parents use?",
      a: "Gate 1 (Main GT Road Entrance) is the primary public and visitor entrance equipped with a visitor reception kiosk, security checkpoint, and direct pedestrian sidewalks towards academic blocks 13, 32, and 34."
    },
    {
      q: "How does the Last-50-Metre indoor navigation work?",
      a: "Once you arrive at your destination building (e.g. Block 34), standard outdoor maps fall short. Our Last-50m guidance gives landmark-based indoor visual cues: entering through the central sliding glass doors, elevator vs. staircase locations, and specific door plaques (such as Room 34-205 Seminar Hall on Floor 2)."
    },
    {
      q: "How can I find a shaded or covered route during hot sunny days or rain?",
      a: "In the Route Planner on the Explore Map page, toggle 'Covered Walkways'. The Dijkstra graph routing engine will penalize open roads and route you through shaded colonnades, covered pedestrian link bridges, and inter-block corridors."
    },
    {
      q: "What should external exam candidates do during exam days?",
      a: "Check the Events & Exam Mode page. Select your examination event to view designated entry gates, active quiet corridors, and 1-click directions straight to your designated examination hall."
    },
    {
      q: "Are the physical distances and walking times accurate?",
      a: "All positions and walking times in this demo prototype are illustrative schematic models for college project evaluation. They are calculated using standard human walking speed (~1.2 m/s). University administrators can import verified GIS surveys anytime via the Admin Data panel."
    }
  ];

  const gatesList = [
    {
      id: "gate-1",
      name: "Gate 1 (Main GT Road)",
      bestFor: "First-time visitors, parents, VIP guests, and general admissions.",
      highlights: "Central Visitor Reception, Security Kiosk, Auto & Cab Stand, GT Road frontage.",
      color: "border-emerald-200 bg-emerald-50/50"
    },
    {
      id: "gate-2",
      name: "Gate 2 (North / Girls Hostel Gate)",
      bestFor: "North residential hostels, girls residential apartments, and north parking.",
      highlights: "Hostel Checkpost, North Security Hub, Shuttle Stop.",
      color: "border-sky-200 bg-sky-50/50"
    },
    {
      id: "gate-3",
      name: "Gate 3 (East Sports Complex Gate)",
      bestFor: "Sports stadiums, multi-purpose athletic hall, and inter-university tournaments.",
      highlights: "Athletics Track, Sports Checkpoint, Bus Bays.",
      color: "border-amber-200 bg-amber-50/50"
    },
    {
      id: "gate-4",
      name: "Gate 4 (UniMall & Commercial Gate)",
      bestFor: "Courier deliveries, UniMall retail, dining plazas, and bank branches.",
      highlights: "Direct access to UniMall Commercial Hub, ATM plazas, Post Office.",
      color: "border-purple-200 bg-purple-50/50"
    }
  ];

  const checklistItems = [
    "Identify your assigned entry gate (e.g. Gate 1 on GT Road).",
    "Scan the physical QR waypoint signboard at the gate or choose Gate 1 in the app.",
    "Search for your target block (e.g. Block 34) or specific room (e.g. 34-205).",
    "Review the calculated shortest path, distance (~390m), and estimated walking time.",
    "Toggle 'Covered Walkways' if traveling during peak sun or rainfall.",
    "Follow turn-by-turn waypoint cues past the Central Fountain roundabout.",
    "On reaching the building, launch 'Last-50m Guidance' for floor and door cues.",
    "Confirm your arrival to conclude the navigation."
  ];

  const emergencyContacts = [
    {
      role: "Uni-Hospital 24/7 Emergency",
      contact: "Ext: 108 / +91-1824-517108",
      location: "Near Sports Complex",
      available: "24 Hours / 7 Days",
      badge: "Medical Dispatch"
    },
    {
      role: "Main Campus Security Control Room",
      contact: "Ext: 100 / +91-1824-517100",
      location: "Gate 1 Central Security Post",
      available: "24 Hours / 7 Days",
      badge: "Campus Police"
    },
    {
      role: "University Examination Helpline",
      contact: "Ext: 3401 / +91-1824-517340",
      location: "Block 34, Ground Floor Room 101",
      available: "08:30 AM – 05:30 PM",
      badge: "Exam Cell"
    },
    {
      role: "Lost & Found Central Desk",
      contact: "Ext: 2805 / +91-1824-517280",
      location: "Block 28 Library Entrance",
      available: "09:00 AM – 06:00 PM",
      badge: "Security Archive"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-[#E8EAF2]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F0FF] text-xs font-semibold text-[#635BFF] mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Support & Guidance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
          Help & Campus Guide
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-1">
          Everything you need to know about navigating Lovely Professional University campus with confidence.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-[#E8EAF2] overflow-x-auto no-scrollbar max-w-2xl">
        {[
          { id: 'faq', label: 'FAQs', icon: <Compass className="w-3.5 h-3.5" /> },
          { id: 'gates', label: 'Gate Guide', icon: <DoorOpen className="w-3.5 h-3.5" /> },
          { id: 'checklist', label: 'Visitor Checklist', icon: <CheckSquare className="w-3.5 h-3.5" /> },
          { id: 'contacts', label: 'Helplines', icon: <PhoneCall className="w-3.5 h-3.5" /> },
          { id: 'report', label: 'Report Issue', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#635BFF] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <ScrollReveal direction="up" delay={80}>
        <div className="bg-white rounded-3xl border border-[#E8EAF2] p-6 sm:p-8 shadow-sm">
        
        {/* TAB 1: FAQS */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A]">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {item.q}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: GATE GUIDE */}
        {activeTab === 'gates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Campus Gate Directory
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Click any gate to launch navigation starting directly from that gate.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gatesList.map((g) => (
                <div key={g.id} className={`p-5 rounded-2xl border ${g.color} flex flex-col justify-between space-y-3`}>
                  <div>
                    <h3 className="font-bold text-sm text-[#0F172A]">{g.name}</h3>
                    <p className="text-xs text-[#64748B] mt-1"><strong>Best for:</strong> {g.bestFor}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-1"><strong>Key Highlights:</strong> {g.highlights}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/map?start=${g.id}`)}
                    className="self-start px-3.5 py-1.5 bg-[#635BFF] hover:bg-[#5145E5] text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <span>Start from {g.name.split(' (')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VISITOR CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                First-Time Visitor & Parent Checklist
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Check off each step as you travel through campus to guarantee you reach the right room.
              </p>
            </div>

            <div className="space-y-2">
              {checklistItems.map((item, idx) => (
                <label
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    checkedItems[idx] 
                      ? 'bg-emerald-50/70 border-emerald-200 text-slate-900 line-through' 
                      : 'bg-slate-50 border-slate-200/80 text-[#0F172A] hover:bg-slate-100/70'
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

        {/* TAB 4: HELPLINES */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                Campus Emergency & Helpdesks
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                University hotlines, dispensary assistance, and security control rooms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#635BFF] border border-[#E8EAF2]">
                      {contact.badge}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {contact.available}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#0F172A]">{contact.role}</h4>
                  <div className="text-xs text-[#64748B] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#635BFF]" /> {contact.location}
                  </div>
                  <div className="text-xs font-mono font-bold text-[#0F172A] pt-1">
                    {contact.contact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REPORT ISSUE */}
        {activeTab === 'report' && (
          <div className="max-w-xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                Report Incorrect Campus Information
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Spotted a relocated department, closed gate, or blocked corridor? Let our team know.
              </p>
            </div>

            {reportSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm text-emerald-950">Thank you for your report!</h3>
                <p className="text-xs text-emerald-700">
                  Our student wayfinding team will inspect this location and update the dataset in the next release.
                </p>
                <button
                  onClick={() => setReportSubmitted(false)}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold mt-2"
                >
                  Submit Another Report
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1">
                    Location or Building Name
                  </label>
                  <input
                    type="text"
                    value={feedbackLocation}
                    onChange={(e) => setFeedbackLocation(e.target.value)}
                    placeholder="e.g. Block 34, Floor 2 elevator or Gate 3..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E8EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1">
                    Description of Issue
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Describe what needs correction (e.g. room name changed, temporary walkway closure)..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E8EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#5145E5] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Correction Report</span>
                </button>
              </form>
            )}
          </div>
        )}

        </div>
      </ScrollReveal>

    </div>
  );
}
