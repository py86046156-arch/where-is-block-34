import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Users, 
  CheckSquare, 
  Target, 
  ShieldAlert, 
  Compass, 
  ClipboardList
} from 'lucide-react';

export default function ResearchEmpathy() {
  const [activeTab, setActiveTab] = useState('overview'); 
  // 'overview' | 'personas' | 'empathy' | 'interviews' | 'observations' | 'matrix' | 'feedback'

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-2xl border border-orange-500/20">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
              Design Thinking, Research & Empathy
            </h2>
            <p className="text-xs text-slate-500">
              User-centric research framework, field questionnaires, persona templates, and HMW formulations.
            </p>
          </div>
        </div>

        {/* Academic Integrity Notice */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Academic Integrity Notice:</strong> All interview transcripts, field checklists, and persona quotes presented here are structured academic templates and illustrative sample entries. Field study data should be populated with verified on-ground responses during the university evaluation cycle.
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 mb-6 pb-2">
        {[
          { id: 'overview', label: 'Problem & HMW' },
          { id: 'personas', label: 'User Personas (3)' },
          { id: 'empathy', label: 'Empathy Maps' },
          { id: 'interviews', label: 'Interview Questions' },
          { id: 'observations', label: 'Observation Checklist' },
          { id: 'matrix', label: 'Idea Screening Matrix' },
          { id: 'feedback', label: 'Testing Protocol (SUS)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-navy-900 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW, POV & HMW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Hero HMW Card */}
          <div className="p-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-3xl shadow-xl">
            <span className="text-[11px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block mb-3">
              Core Design Thinking Challenge (HMW)
            </span>
            <h3 className="text-xl sm:text-2xl font-black leading-snug">
              “How might we get a first-time visitor from any gate to the right room with confidence?”
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 mt-2 max-w-2xl">
              Focusing on reducing anxiety for first-time exam candidates, parents, delivery personnel, and guests navigating LPU’s multi-acre campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Background & Context */}
            <div className="bg-white p-5 rounded-2xl shadow border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-orange-600" />
                Background & Campus Context
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lovely Professional University (LPU) operates one of the largest single-campus educational facilities in India, accommodating over 35,000 students and hundreds of academic, administrative, and residential blocks.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                While numbered blocks (e.g. Block 32 through Block 38) are organized along central spines, first-time visitors entering via disparate gates (Gate 1, 2, 3, or 4) struggle to identify the correct building, correct floor, and target hall without repeated physical inquiries.
              </p>
            </div>

            {/* Point of View (POV) Statement */}
            <div className="bg-white p-5 rounded-2xl shadow border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Point of View (POV) Statement
              </h4>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-2">
                <div><strong>User:</strong> First-time campus visitor (Parent or Exam candidate).</div>
                <div><strong>Need:</strong> A trustworthy, step-by-step wayfinding guide from gate arrival to indoor room threshold.</div>
                <div><strong>Insight:</strong> Generic mapping apps fail once inside the gate; visitors need landmark cues, covered walkway options, and floor-level room pointers to eliminate disorientation.</div>
              </div>
            </div>
          </div>

          {/* Research Plan */}
          <div className="bg-white p-5 rounded-2xl shadow border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              Four-Phase Research Methodology Plan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-orange-600 block mb-1">Phase 1: Shadowing</span>
                Observe physical visitor flow and direction inquiries at Gate 1 and Gate 4 security kiosks.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-orange-600 block mb-1">Phase 2: Interviews</span>
                Administer structured 5-minute surveys to guards, parents, delivery riders, and candidates.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-orange-600 block mb-1">Phase 3: Prototyping</span>
                Build schematic graph model with Dijkstra routing and last-50m landmark cues.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-orange-600 block mb-1">Phase 4: Lab Testing</span>
                Conduct timed task evaluations with 10 participants recording confusion points.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER PERSONAS */}
      {activeTab === 'personas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* Persona 1: Parent */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 font-black text-lg flex items-center justify-center">
                RK
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Ramesh Kumar (52)</h4>
                <span className="text-[11px] text-slate-500">Parent (Visiting from Patna, Bihar)</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <div><strong>Goal:</strong> Accompany son for admissions counseling in Block 34 without getting lost in the heat.</div>
              <div><strong>Pain Point:</strong> Confused by building numbers (32 vs 34); anxious about long walking distances.</div>
              <div><strong>Quote (Illustrative):</strong> <em>“Everything looks identical; I keep asking guards where Block 34 is.”</em></div>
            </div>
          </div>

          {/* Persona 2: External Exam Candidate */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-black text-lg flex items-center justify-center">
                PS
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Priya Sharma (21)</h4>
                <span className="text-[11px] text-slate-500">External Examination Candidate</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <div><strong>Goal:</strong> Reach Room 34-205 examination hall 20 minutes prior to gate closure.</div>
              <div><strong>Pain Point:</strong> Entered through Gate 2 instead of Gate 1; running late and stressed about finding the right floor.</div>
              <div><strong>Quote (Illustrative):</strong> <em>“I only have 15 minutes before the exam begins and I don't know which staircase to take.”</em></div>
            </div>
          </div>

          {/* Persona 3: Delivery Partner */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center">
                VS
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Vikram Singh (26)</h4>
                <span className="text-[11px] text-slate-500">Courier / Food Delivery Partner</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <div><strong>Goal:</strong> Deliver parcel to faculty office in Block 34 within 10-minute SLA.</div>
              <div><strong>Pain Point:</strong> Gate security halts bike; must navigate on foot quickly to Dean's office on Floor 3.</div>
              <div><strong>Quote (Illustrative):</strong> <em>“Every wasted minute hurts my delivery rating. A quick QR code map saves my day.”</em></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMPATHY MAPS */}
      {activeTab === 'empathy' && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-fadeIn">
          <div className="mb-4">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
              Empathy Matrix Template
            </span>
            <h4 className="text-base font-extrabold text-slate-900 mt-1">
              Visitor Empathy Map: First-Time Campus Arrival
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Says */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="font-extrabold text-slate-900 text-sm mb-2 text-orange-600">SAYS (Verbalized)</h5>
              <ul className="list-disc ml-4 space-y-1.5 text-slate-600">
                <li>“Which gate did the auto-rickshaw drop me at?”</li>
                <li>“Is Block 34 near the central fountain or the library?”</li>
                <li>“Is there a lift or do I have to climb four flights with luggage?”</li>
              </ul>
            </div>

            {/* Thinks */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="font-extrabold text-slate-900 text-sm mb-2 text-indigo-600">THINKS (Internal Monologue)</h5>
              <ul className="list-disc ml-4 space-y-1.5 text-slate-600">
                <li>“I hope I don’t miss the reporting time for the counseling session.”</li>
                <li>“The campus is overwhelmingly huge; Google Maps isn’t showing internal rooms.”</li>
                <li>“I feel shy asking the guard for the third time.”</li>
              </ul>
            </div>

            {/* Does */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="font-extrabold text-slate-900 text-sm mb-2 text-emerald-600">DOES (Observable Actions)</h5>
              <ul className="list-disc ml-4 space-y-1.5 text-slate-600">
                <li>Stops at every corridor intersection to squint at wall signage boards.</li>
                <li>Checks admission letter repeatedly to verify room numbers (e.g. 34-205).</li>
                <li>Walks back and forth between adjacent blocks (32 and 34) due to similar facades.</li>
              </ul>
            </div>

            {/* Feels */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="font-extrabold text-slate-900 text-sm mb-2 text-rose-600">FEELS (Emotional State)</h5>
              <ul className="list-disc ml-4 space-y-1.5 text-slate-600">
                <li>Anxious and time-pressured before exam or interview deadlines.</li>
                <li>Physically fatigued after walking in Punjab's sunny afternoon weather.</li>
                <li>Relieved when clear landmark cues (e.g. "near the central fountain") confirm they are on track.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERVIEW QUESTIONNAIRES */}
      {activeTab === 'interviews' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Field Interview Question Protocols (5 Stakeholder Groups)
            </h4>
            <p className="text-slate-500">
              Structured questionnaires designed for on-ground field evaluation across LPU campus touchpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Security Guards */}
            <div className="p-4 bg-white rounded-xl shadow border border-slate-200 text-xs space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-orange-600">
                <Users className="w-4 h-4" /> 1. Security Guards (Gate 1 & Gate 4)
              </h5>
              <ol className="list-decimal ml-4 space-y-1 text-slate-600">
                <li>How many times per shift do visitors ask for directions to Block 34?</li>
                <li>Which blocks or rooms cause the greatest confusion among first-timers?</li>
                <li>What verbal directions or landmarks do you usually offer to guide them?</li>
              </ol>
            </div>

            {/* Information Desk Staff */}
            <div className="p-4 bg-white rounded-xl shadow border border-slate-200 text-xs space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-indigo-600">
                <Users className="w-4 h-4" /> 2. Information Desk Staff
              </h5>
              <ol className="list-decimal ml-4 space-y-1 text-slate-600">
                <li>What printed or digital navigation aids are currently given to parents?</li>
                <li>During major exam days or tech fests, how do bottlenecks develop?</li>
                <li>Do visitors struggle more with outdoor walkways or indoor floor rooms?</li>
              </ol>
            </div>

            {/* Students & Candidates */}
            <div className="p-4 bg-white rounded-xl shadow border border-slate-200 text-xs space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-emerald-600">
                <Users className="w-4 h-4" /> 3. First-Time Students & Exam Candidates
              </h5>
              <ol className="list-decimal ml-4 space-y-1 text-slate-600">
                <li>When you first arrived, how easily did you pinpoint your assigned room?</li>
                <li>Did you rely on phone maps, physical signboards, or asking passersby?</li>
                <li>What would have given you confidence when approaching the building?</li>
              </ol>
            </div>

            {/* Delivery Partners & Parents */}
            <div className="p-4 bg-white rounded-xl shadow border border-slate-200 text-xs space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-rose-600">
                <Users className="w-4 h-4" /> 4. Parents & Delivery Personnel
              </h5>
              <ol className="list-decimal ml-4 space-y-1 text-slate-600">
                <li>How critical are shaded corridors and elevator information for you?</li>
                <li>Would a QR code placed at gate entrances be easy for you to scan?</li>
                <li>What information was missing when you finally reached the door?</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OBSERVATION CHECKLIST */}
      {activeTab === 'observations' && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-fadeIn space-y-4">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
              Field Audit Instrument
            </span>
            <h4 className="text-base font-extrabold text-slate-900 mt-1">
              Physical Walkway & Signage Observation Checklist
            </h4>
            <p className="text-xs text-slate-500">
              Audit criteria used when inspecting actual campus routes between Gate 1, Gate 4, and Block 34.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              "Signboard visibility from 25m distance in bright sunlight.",
              "Presence of covered corridors / pergolas along main boulevard.",
              "Bilingual signage (English and Hindi) at critical decision points.",
              "Wheelchair ramp gradients and step-free access indicators.",
              "Clear distinction between adjacent blocks (Block 32 vs Block 34).",
              "Atrium floor directories listing HOD offices and labs.",
              "Elevator status signage (operational vs service only).",
              "QR waypoint readability under varying outdoor lighting conditions."
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: IDEA SCREENING MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-fadeIn space-y-4">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
              Decision Analysis
            </span>
            <h4 className="text-base font-extrabold text-slate-900 mt-1">
              Ideation Log & Screening Matrix (Feasibility vs Impact)
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-800 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Solution Concept</th>
                  <th className="p-3">Feasibility (1-5)</th>
                  <th className="p-3">Impact (1-5)</th>
                  <th className="p-3">Cost / Effort</th>
                  <th className="p-3">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-orange-50/50 font-medium">
                  <td className="p-3 font-bold text-slate-900">
                    Schematic Interactive Web Map + Dijkstra + Last-50m
                  </td>
                  <td className="p-3 font-bold text-emerald-600">5 / 5</td>
                  <td className="p-3 font-bold text-emerald-600">5 / 5</td>
                  <td className="p-3">Low (Browser-native React)</td>
                  <td className="p-3 font-bold text-orange-600">Selected (Core Project)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-800">
                    QR Waypoint Signs at Gates & Corridors
                  </td>
                  <td className="p-3">5 / 5</td>
                  <td className="p-3">4.5 / 5</td>
                  <td className="p-3">Low (Printable Acrylic Signs)</td>
                  <td className="p-3 font-bold text-emerald-600">Selected (Integrated)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-800">
                    Augmented Reality (AR) Camera Overlays
                  </td>
                  <td className="p-3">2 / 5</td>
                  <td className="p-3">4 / 5</td>
                  <td className="p-3">High (Device battery & gyro drift)</td>
                  <td className="p-3 text-slate-400">Future Scope (Phase 2)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-800">
                    BLE Bluetooth Beacons on every door
                  </td>
                  <td className="p-3">2.5 / 5</td>
                  <td className="p-3">4 / 5</td>
                  <td className="p-3">High hardware maintenance</td>
                  <td className="p-3 text-slate-400">Deferred</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: TESTING FEEDBACK PROTOCOL */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-fadeIn space-y-4">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
              Evaluation Instrument
            </span>
            <h4 className="text-base font-extrabold text-slate-900 mt-1">
              System Usability Scale (SUS) Testing Feedback Protocol
            </h4>
            <p className="text-xs text-slate-500">
              Standardized 5-point Likert questions administered to participants following a guided navigation task.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {[
              "1. I think that I would like to use this system frequently when visiting campus.",
              "2. I found the system unnecessarily complex.",
              "3. I thought the system was easy to use.",
              "4. I think that I would need the support of a technical person to navigate.",
              "5. I found the various functions in this system were well integrated.",
              "6. I thought there was too much inconsistency in the navigation instructions.",
              "7. I would imagine that most people would learn to use this system very quickly.",
              "8. I found the system very cumbersome to use.",
              "9. I felt very confident using the navigation system.",
              "10. I needed to learn a lot of things before I could get going with this system."
            ].map((q, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-slate-700">
                <span>{q}</span>
                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-3">
                  1 (Strongly Disagree) to 5 (Strongly Agree)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
