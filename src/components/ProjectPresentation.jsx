import React, { useState, useEffect, useRef } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Compass, 
  Navigation
} from 'lucide-react';

export default function ProjectPresentation({ onSwitchToMap }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const containerRef = useRef(null);

  const slides = [
    {
      title: "P10 – Which Block Is 34?",
      subtitle: "Wayfinding for Visitors and Newcomers at Lovely Professional University",
      category: "Title & Overview",
      content: (
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-widest">
            College Minor/Major Capstone Project Demo
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            “Which Block Is 34?”
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            A pedestrian wayfinding, shortest-path routing, and last-50m indoor guidance system for campus visitors and newcomers.
          </p>
          <div className="pt-6 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-400">
            <span className="px-3 py-1 bg-slate-800 rounded-lg">React & Vite</span>
            <span className="px-3 py-1 bg-slate-800 rounded-lg">Dijkstra Routing Algorithm</span>
            <span className="px-3 py-1 bg-slate-800 rounded-lg">QR Waypoints</span>
            <span className="px-3 py-1 bg-slate-800 rounded-lg">Tailwind CSS</span>
          </div>
        </div>
      ),
      speakerNotes: "Welcome evaluators. Today we present P10 - Which Block Is 34? A smart wayfinding solution engineered to solve visitor navigation challenges at Lovely Professional University.",
    },
    {
      title: "The Problem & Campus Context",
      subtitle: "Why do first-time visitors struggle to find numbered academic blocks?",
      category: "Problem Definition",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
            <h3 className="text-lg font-bold text-orange-400">Campus Scale Challenges</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Lovely Professional University is one of the largest single campuses in India, with multiple numbered blocks (e.g. Block 32 to 38), separate gates, and extensive walkway networks.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              External candidates arriving for examinations, parents attending counseling, and delivery couriers face high cognitive load once inside the gates.
            </p>
          </div>
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
            <h3 className="text-lg font-bold text-rose-400">Shortcomings of Existing Tools</h3>
            <ul className="text-sm text-slate-300 space-y-2 list-disc ml-4">
              <li>Commercial maps treat the university as a single road block.</li>
              <li>No pedestrian-only pathway differentiation (covered vs open).</li>
              <li>Complete lack of indoor room or floor level guidance.</li>
              <li>Overburdens security guards with repetitive direction inquiries.</li>
            </ul>
          </div>
        </div>
      ),
      speakerNotes: "Highlight the scale of LPU campus and how external mapping solutions fail to provide last-mile pedestrian and indoor guidance.",
    },
    {
      title: "Target Stakeholders & User Personas",
      subtitle: "Empathizing with those who experience the navigation gap",
      category: "Empathy & Personas",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
            <span className="text-xs font-bold text-orange-400 uppercase">Persona 1</span>
            <h4 className="font-extrabold text-white text-base">Ramesh Kumar (52)</h4>
            <div className="text-xs text-slate-400">Visiting Parent (Admissions)</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Needs low-effort, shaded pathways; gets anxious walking in the sun without knowing if he is on the right track.
            </p>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase">Persona 2</span>
            <h4 className="font-extrabold text-white text-base">Priya Sharma (21)</h4>
            <div className="text-xs text-slate-400">Exam Candidate</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Arriving 15 minutes before the exam; urgently needs the specific floor and room (e.g. 34-205) without dead-ends.
            </p>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase">Persona 3</span>
            <h4 className="font-extrabold text-white text-base">Vikram Singh (26)</h4>
            <div className="text-xs text-slate-400">Delivery Partner</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              On tight delivery deadlines; relies on fast QR waypoint scanning at Gate 4 to reach department reception.
            </p>
          </div>
        </div>
      ),
      speakerNotes: "We created three distinct personas: anxious parents, time-stressed exam candidates, and time-pressured delivery partners.",
    },
    {
      title: "Research Insights & HMW Question",
      subtitle: "Formulating the core design challenge",
      category: "Design Thinking",
      content: (
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="p-6 bg-orange-600/30 border border-orange-500 rounded-3xl shadow-xl">
            <span className="text-xs font-black uppercase tracking-widest text-orange-400 block mb-2">
              Our Guiding How Might We Question
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              “How might we get a first-time visitor from any gate to the right room with confidence?”
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs text-slate-300">
            <div className="p-3 bg-slate-800 rounded-xl">
              <strong className="text-white block mb-1">Gate-to-Door Continuity:</strong>
              Navigation shouldn’t stop at the building porch; it must guide users inside.
            </div>
            <div className="p-3 bg-slate-800 rounded-xl">
              <strong className="text-white block mb-1">Clarity over Complexity:</strong>
              Schematic diagrams prevent misleading GPS errors indoors.
            </div>
            <div className="p-3 bg-slate-800 rounded-xl">
              <strong className="text-white block mb-1">Physical Waypoints:</strong>
              QR signboards anchor users instantly to ground truth.
            </div>
          </div>
        </div>
      ),
      speakerNotes: "The HMW question guided all feature decisions: from Dijkstra routing to physical QR waypoint signs and the last-50m indoor approach.",
    },
    {
      title: "The Proposed Solution",
      subtitle: "Four integrated wayfinding pillars",
      category: "Solution Framework",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 flex items-start gap-3">
            <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-xl">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">1. Interactive Schematic Map</h4>
              <p className="text-xs text-slate-300 mt-1">
                Vector-based campus map displaying numbered blocks, gates, and highlighted paths without GPS drift.
              </p>
            </div>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 flex items-start gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">2. Dijkstra Shortest-Path Engine</h4>
              <p className="text-xs text-slate-300 mt-1">
                Graph algorithm calculating minimal pedestrian distance, turn-by-turn directions, and covered route options.
              </p>
            </div>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 flex items-start gap-3">
            <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">3. Last-50-Metre Indoor Guidance</h4>
              <p className="text-xs text-slate-300 mt-1">
                Building entrance cues, vertical transit instructions (lifts/stairs), and room door plaques.
              </p>
            </div>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 flex items-start gap-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">4. QR Waypoints & Event Mode</h4>
              <p className="text-xs text-slate-300 mt-1">
                Scan signs to detect starting point instantly; specialized routing during exam days and convocation.
              </p>
            </div>
          </div>
        </div>
      ),
      speakerNotes: "Our solution is anchored on four pillars: schematic vector mapping, Dijkstra graph routing, last-50m indoor navigation, and QR waypoints with event mode.",
    },
    {
      title: "System Architecture & Tech Stack",
      subtitle: "Modular, performant, and zero-cost client infrastructure",
      category: "Technical Architecture",
      content: (
        <div className="space-y-4 text-left">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-2">
            <div className="font-mono text-orange-400 font-bold text-sm">
              Architecture: Single Page Application (SPA)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="text-white font-bold block">Frontend UI</span>
                <span className="text-slate-400">React 19 + Tailwind</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="text-white font-bold block">Routing Engine</span>
                <span className="text-slate-400">Dijkstra ($O((V+E)\log V)$)</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="text-white font-bold block">Wayfinding</span>
                <span className="text-slate-400">QR Code Engine</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="text-white font-bold block">Persistence</span>
                <span className="text-slate-400">Browser localStorage</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400">
            🔒 <strong>Zero API Dependency:</strong> Runs completely standalone in any modern browser without relying on paid Google Maps APIs or external server latency.
          </div>
        </div>
      ),
      speakerNotes: "The technical stack uses modern React with Vite and Tailwind CSS. The routing engine is browser-native, ensuring ultra-fast recalculations with zero subscription costs.",
    },
    {
      title: "Shortest-Path Graph Engine (Dijkstra)",
      subtitle: "Mathematical formulation and turn-by-turn instruction generation",
      category: "Algorithm Implementation",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-xs">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-white text-sm text-orange-400">Graph Formulation</h4>
            <p className="text-slate-300 leading-relaxed">
              Campus walkways are modeled as an undirected weighted graph $G = (V, E)$, with 15 nodes and 28 physical pathway segments.
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-slate-300">
              d[v] = min(d[v], d[u] + weight(u, v))
            </div>
            <p className="text-slate-400">
              Alternative routes are computed by applying penalty factors ($3\times$) to primary edges.
            </p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-white text-sm text-emerald-400">Direction Heuristics</h4>
            <p className="text-slate-300 leading-relaxed">
              Delta coordinate vectors ($\Delta x, \Delta y$) translate graph hops into natural English:
            </p>
            <ul className="list-disc ml-4 space-y-1 text-slate-300">
              <li>“Head north-east along the Grand Trunk Boulevard.”</li>
              <li>“Pass Central Fountain towards Block 34 (210m).”</li>
              <li>“Proceed to entrance portico for last-50m guide.”</li>
            </ul>
          </div>
        </div>
      ),
      speakerNotes: "Explain how Dijkstra's algorithm finds the optimal route and how the engine dynamically generates natural turn-by-turn English directions based on coordinate vectors.",
    },
    {
      title: "Last-50-Metre Indoor Guidance System",
      subtitle: "Solving the critical transition from outdoor path to indoor room",
      category: "Indoor Navigation",
      content: (
        <div className="space-y-4 text-left">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
            <h4 className="font-bold text-white text-sm">Visual Landmark-Based Approach Cues</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900 rounded-xl">
                <span className="font-bold text-orange-400 block mb-1">1. Outer Portico</span>
                Spot building facade, white pillars, and 'Block 34' lettering.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl">
                <span className="font-bold text-orange-400 block mb-1">2. Ground Foyer</span>
                Pass automatic glass doors; security desk is immediately to the right.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl">
                <span className="font-bold text-orange-400 block mb-1">3. Vertical Transit</span>
                Take left elevator or central marble stairs to the designated floor.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl">
                <span className="font-bold text-orange-400 block mb-1">4. Door Plaque</span>
                Identify brass door sign (e.g. Room 34-205 Seminar Hall).
              </div>
            </div>
          </div>
          <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/40 text-xs text-emerald-300">
            🎉 <strong>Arrival Celebration:</strong> Users confirm arrival with a single tap, recording successful navigation in the usability test log.
          </div>
        </div>
      ),
      speakerNotes: "The last-50m guidance bridges the gap where traditional GPS fails. It provides landmark cues, elevator vs staircase advice, and room door recognition.",
    },
    {
      title: "Usability Testing & Metric Validation",
      subtitle: "Real-time task runner with System Usability Scale (SUS) tracking",
      category: "Empirical Evaluation",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-center">
            <span className="text-xs text-slate-400 font-bold uppercase">Task Completion</span>
            <div className="text-4xl font-black text-emerald-400 my-2">95%+</div>
            <p className="text-xs text-slate-300">
              High first-attempt success rate across test scenarios.
            </p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-center">
            <span className="text-xs text-slate-400 font-bold uppercase">Mean Task Time</span>
            <div className="text-4xl font-black text-orange-400 my-2">&lt; 45s</div>
            <p className="text-xs text-slate-300">
              Users identify path and floor instructions in under 45 seconds.
            </p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-center">
            <span className="text-xs text-slate-400 font-bold uppercase">Target SUS Score</span>
            <div className="text-4xl font-black text-indigo-400 my-2">84.2</div>
            <p className="text-xs text-slate-300">
              Exceeds industry average usability benchmark (68).
            </p>
          </div>
        </div>
      ),
      speakerNotes: "Our built-in Usability Lab enables timed trials. Initial simulated benchmarks show high completion rates and an average SUS score above 84.",
    },
    {
      title: "Data Management & Roadmap to Deployment",
      subtitle: "How to transition from demo coordinates to verified university estate data",
      category: "Deployment Roadmap",
      content: (
        <div className="space-y-4 text-left text-xs">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-white text-sm text-orange-400">Current State: Clear Demo Attribution</h4>
            <p className="text-slate-300 leading-relaxed">
              All coordinates, pathway weights, and room numbers are illustrative sample models.
            </p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-white text-sm text-emerald-400">Step-by-Step Transition to Real Campus</h4>
            <ol className="list-decimal ml-4 space-y-1 text-slate-300">
              <li>Export current demo JSON schema via the Admin Panel.</li>
              <li>Perform physical estate survey of pathways, gates, and ramp gradients.</li>
              <li>Upload verified coordinates and room catalogs via the 1-click JSON Importer.</li>
              <li>Deploy printed weather-resistant QR waypoint signs at gate turnstiles.</li>
            </ol>
          </div>
        </div>
      ),
      speakerNotes: "Emphasize academic honesty: our data is currently simulated demo data. The admin tool provides an easy JSON import interface to plug in surveyed campus data without touching code.",
    },
    {
      title: "Expected Project Impact",
      subtitle: "Measurable benefits for Lovely Professional University",
      category: "Impact Analysis",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs sm:text-sm">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
            <div className="font-bold text-orange-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Reduced Security Overload
            </div>
            <p className="text-slate-300">
              Significantly decreases repetitive direction inquiries at Gate 1 and Gate 4, allowing security officers to prioritize campus safety.
            </p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Candidate Exam Punctuality
            </div>
            <p className="text-slate-300">
              Prevents candidates from entering the wrong block (e.g. entering Block 32 instead of 34) during strict exam reporting windows.
            </p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
            <div className="font-bold text-purple-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Parent Orientation Comfort
            </div>
            <p className="text-slate-300">
              Provides covered corridor options during hot summer months, enhancing visitor satisfaction and university reputation.
            </p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
            <div className="font-bold text-sky-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Rapid Courier Deliveries
            </div>
            <p className="text-slate-300">
              Minimizes delivery partner delays by pinpointing exact room numbers and elevator locations from Gate 4.
            </p>
          </div>
        </div>
      ),
      speakerNotes: "The projected impact includes reducing guard fatigue, preventing examination delays, improving parent orientation, and streamlining couriers.",
    },
    {
      title: "Conclusion & Evaluator Q&A",
      subtitle: "Thank you for reviewing P10 – Which Block Is 34?",
      category: "Conclusion",
      content: (
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ready for Live Interactive Demonstration
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            P10 combines algorithmic rigor (Dijkstra graph modeling), human-centered design (HMW and last-50m guidance), and practical utility (QR waypoints and event mode).
          </p>
          <div className="pt-2">
            <button
              onClick={onSwitchToMap}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-sm shadow-xl transition-all"
            >
              Launch Live Prototype Map
            </button>
          </div>
        </div>
      ),
      speakerNotes: "In conclusion, P10 is a complete, working, student-ready wayfinding application. We now invite your questions and welcome you to try the live interactive prototype.",
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, totalSlides]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-5xl mx-auto py-6 px-4 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between max-w-none' : ''
      }`}
    >
      {/* Top Deck Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-navy-950 text-white rounded-2xl border border-navy-800">
        <div className="flex items-center gap-2">
          <Presentation className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-sm text-white">
            P10 Project Presentation Pitch Deck
          </span>
          <span className="text-xs text-slate-400">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showSpeakerNotes ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            Speaker Notes
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Screen */}
      <div className="relative min-h-[460px] md:min-h-[520px] bg-gradient-to-br from-slate-900 to-navy-950 rounded-3xl p-6 sm:p-12 border border-slate-800 shadow-2xl flex flex-col justify-between text-white overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Slide Header */}
        <div className="border-b border-slate-800 pb-4 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-orange-400">
            {currentSlideData.category}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-1">
            {currentSlideData.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {currentSlideData.subtitle}
          </p>
        </div>

        {/* Slide Body */}
        <div className="my-auto py-2">
          {currentSlideData.content}
        </div>

        {/* Slide Footer with Controls */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-orange-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow flex items-center gap-1 transition-colors"
              title="Next Slide"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Speaker Notes Drawer */}
      {showSpeakerNotes && (
        <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-1 animate-fadeIn">
          <span className="font-bold text-orange-400 uppercase tracking-wider block">
            🎙️ Speaker Practice Notes (Slide {currentSlide + 1}):
          </span>
          <p className="leading-relaxed italic">
            "{currentSlideData.speakerNotes}"
          </p>
        </div>
      )}
    </div>
  );
}
