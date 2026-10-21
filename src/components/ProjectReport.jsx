import React from 'react';
import { 
  FileText, 
  Printer
} from 'lucide-react';

export default function ProjectReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Top Action Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-600" />
          <span className="font-extrabold text-sm text-slate-800">
            Minor/Major Academic Project Documentation
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Report Document Sheet */}
      <div className="print-area bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-14 text-slate-900 font-sans space-y-10 leading-relaxed">
        {/* Cover / Title Block */}
        <div className="text-center border-b-2 border-slate-900 pb-8 space-y-2">
          <div className="text-[11px] font-black tracking-widest uppercase text-orange-600">
            LOVELY PROFESSIONAL UNIVERSITY • SCHOOL OF COMPUTER SCIENCE & ENGINEERING
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
            P10 – Which Block Is 34?
          </h1>
          <h2 className="text-base sm:text-lg font-bold text-slate-700">
            Campus Wayfinding and Navigation System for Visitors and Newcomers
          </h2>
          <div className="pt-4 text-xs font-semibold text-slate-500 flex flex-wrap justify-center gap-4">
            <span>Project Track: Minor/Major Project</span>
            <span>•</span>
            <span>Academic Year: 2026</span>
            <span>•</span>
            <span>Technology: React, Dijkstra Routing, Tailwind CSS</span>
          </div>
        </div>

        {/* Abstract */}
        <section className="space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1">
            Abstract
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            Navigating expansive university campuses presents significant cognitive friction for first-time visitors, admissions applicants, examination candidates, delivery couriers, and parents. On large university campuses such as Lovely Professional University (LPU), standard satellite-based navigation applications frequently fail to provide localized pedestrian wayfinding, covered corridor options, or last-50-metre indoor floor and room guidance. This project introduces <strong>“Which Block Is 34?”</strong>, an accessible, client-side web application incorporating a schematic vector graph model, Dijkstra’s shortest-path algorithm, physical QR waypoints, and specialized final-approach landmark guidance. The system reduces direction inquiry overhead on security staff, mitigates candidate exam anxiety, and provides a modular architecture ready for full-scale survey integration.
          </p>
        </section>

        {/* 1. Introduction & Background */}
        <section className="space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1">
            1. Introduction & Campus Context
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            Lovely Professional University features an expansive single-campus infrastructure spanning hundreds of acres with multi-storey numbered academic blocks, residential towers, sports arenas, and commercial complexes. While numbered blocks (e.g. Block 32 through Block 38) form organized clusters, newcomers arriving via distinct gates (Gate 1 on GT Road, Gate 2, Gate 3, or Gate 4) encounter significant navigational ambiguity. First-time visitors frequently misidentify adjacent structures, struggle in adverse weather, and fail to locate target classrooms without repeated inquiries to campus security.
          </p>
        </section>

        {/* 2. Problem Statement */}
        <section className="space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1">
            2. Problem Statement
          </h3>
          <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-200 text-xs sm:text-sm text-slate-800">
            <em>
              “How might we get a first-time visitor from any gate to the right room with confidence?”
            </em>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            Existing satellite mapping tools treat university campuses as monolithic polygons, lacking pedestrian-only walkways, floor numbers, room plaques, and covered pathway differentiators. Visitors lose crucial time during time-sensitive events such as examination check-ins, counseling interviews, and package deliveries.
          </p>
        </section>

        {/* 3. Objectives & Scope */}
        <section className="space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1">
            3. Project Objectives
          </h3>
          <ul className="list-disc ml-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
            <li><strong>Pedestrian Routing Engine:</strong> Implement Dijkstra’s shortest path algorithm over an adjacency graph of campus pathways.</li>
            <li><strong>Schematic Visual Vector Map:</strong> Provide an interactive, responsive vector map with zoom, pan, and real-time route rendering.</li>
            <li><strong>Last-50-Metre Indoor Guidance:</strong> Offer landmark-based cues, vertical transit instructions (lifts/stairs), and room door identification.</li>
            <li><strong>QR Waypoint Integration:</strong> Enable instant location detection via physical signboards mounted at gate turnstiles and corridor hubs.</li>
            <li><strong>Event & Exam Mode:</strong> Supply temporary navigation advisories and streamlined routes for high-traffic event days.</li>
            <li><strong>Accessibility by Design:</strong> Integrate WCAG high-contrast mode, scalable text options, and shaded walkway preferences.</li>
          </ul>
        </section>

        {/* 4. System Architecture & Methodology */}
        <section className="space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1">
            4. System Architecture & Routing Methodology
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            The application is built on a clean, component-driven client architecture leveraging React and Vite:
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-2 text-slate-800">
            <div><strong>Graph Model:</strong> $G = (V, E)$, where $V$ represents campus gates, blocks, and landmarks; $E$ represents physical pedestrian walkways with edge weight $w(u, v)$ denoting physical distance in meters.</div>
            <div><strong>Shortest Path Complexity:</strong> Standard Dijkstra using min-priority tracking operates in $O((|V| + |E|) \log |V|)$ time.</div>
            <div><strong>Walking Time Estimation:</strong> $T = \lceil D / (v \times 60) \rceil$, where $D$ is total distance in meters and $v = 1.2 \text{ m/s}$ is standard human walking velocity.</div>
          </div>
        </section>

        {/* 5. Functional & Non-Functional Requirements */}
        <section className="space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1">
            5. Requirements Specification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <h5 className="font-bold text-slate-900 text-orange-600">Functional Requirements</h5>
              <ul className="list-disc ml-4 space-y-1 text-slate-700">
                <li>Instant multi-token search for blocks, rooms, and gates.</li>
                <li>Interactive SVG map rendering with dynamic route overlays.</li>
                <li>Turn-by-turn instruction generation with direction heuristics.</li>
                <li>QR code scanner simulator and printable sign generator.</li>
                <li>Local data management for administrative testing.</li>
              </ul>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <h5 className="font-bold text-slate-900 text-indigo-600">Non-Functional Requirements</h5>
              <ul className="list-disc ml-4 space-y-1 text-slate-700">
                <li>Sub-50ms route recalculation performance.</li>
                <li>Fully responsive across mobile (iOS/Android), tablet, and desktop.</li>
                <li>Zero external paid API key requirements.</li>
                <li>Strict academic honesty with clear demo data disclaimers.</li>
                <li>High contrast and large text accessibility compliance.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Expected Outcomes & Impact */}
        <section className="space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1">
            6. Expected Project Outcomes
          </h3>
          <ul className="list-disc ml-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
            <li><strong>Reduce Repetitive Inquiries:</strong> Decrease verbal direction requests to gate security guards by an estimated 40-60%.</li>
            <li><strong>Candidate Stress Reduction:</strong> Enable external examination applicants to navigate directly to their assigned hall with confidence.</li>
            <li><strong>Orientation Efficiency:</strong> Accelerate parent and fresher orientation journeys during peak semester intake weeks.</li>
          </ul>
        </section>

        {/* 7. Limitations & Ethical Disclosures */}
        <section className="space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1">
            7. Limitations & Disclosures
          </h3>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-2">
            <p>
              <strong>Demo Data Limitation:</strong> All coordinates, distances, and walking times in the current prototype are illustrative models designed for academic demonstration. They must be validated against university estate surveys prior to physical deployment.
            </p>
            <p>
              <strong>Wheelchair Accessibility Note:</strong> While accessibility toggles exist in software, physical wheelchair ramps and elevator operational schedules must be certified on-ground before claiming compliance.
            </p>
          </div>
        </section>

        {/* 8. Future Scope */}
        <section className="space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1">
            8. Future Scope & Enhancements
          </h3>
          <ul className="list-disc ml-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
            <li><strong>Live Campus Bus & E-Rickshaw Tracking:</strong> Integration of GPS telemetry from internal electric shuttle buses.</li>
            <li><strong>Indoor BLE Beacon Positioning:</strong> Sub-meter positioning inside Block 34 multi-storey atriums.</li>
            <li><strong>Multilingual Audio Voice Guidance:</strong> Voice-directed navigation in Hindi, Punjabi, and English.</li>
          </ul>
        </section>

        {/* 9. References */}
        <section className="space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-orange-600 border-b border-orange-200 pb-1">
            9. References (Consulted Literature)
          </h3>
          <ol className="list-decimal ml-5 space-y-1 text-xs text-slate-600 font-mono">
            <li>Dijkstra, E. W. (1959). "A note on two problems in connexion with graphs". Numerische Mathematik, 1(1), 269–271.</li>
            <li>World Wide Web Consortium (W3C). Web Content Accessibility Guidelines (WCAG) 2.1 Standard.</li>
            <li>Lovely Professional University (LPU) Official Campus Map Overview and Visitor Guidelines (Academic Reference).</li>
            <li>Norman, D. (2013). "The Design of Everyday Things: Revised and Expanded Edition". Basic Books.</li>
          </ol>
        </section>

        {/* Signature / Submission Block */}
        <div className="pt-10 border-t border-slate-300 grid grid-cols-2 text-xs text-slate-600">
          <div>
            <div className="font-bold text-slate-900">Submitted by:</div>
            <div>P10 Project Candidate / Student Team</div>
            <div>B.Tech Computer Science & Engineering</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-900">Approved by:</div>
            <div>Departmental Project Mentor / Evaluator</div>
            <div>School of Computer Science & Engineering</div>
          </div>
        </div>
      </div>
    </div>
  );
}
