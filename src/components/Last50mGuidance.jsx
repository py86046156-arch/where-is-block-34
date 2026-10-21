import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  RotateCcw, 
  Eye, 
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Last50mGuidance({
  destinationNode,
  selectedRoom,
  onClose,
  onCompleteArrival
}) {
  const [hasArrived, setHasArrived] = useState(false);

  // Trigger celebration confetti
  const handleArrival = () => {
    setHasArrived(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#f97316', '#10b981', '#3b82f6', '#facc15']
    });

    if (onCompleteArrival) {
      onCompleteArrival({
        destination: destinationNode?.name,
        room: selectedRoom ? selectedRoom.roomNumber : null,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  const handleReset = () => {
    setHasArrived(false);
  };

  const isHeroBlock34 = destinationNode?.isHeroBlock || destinationNode?.code === '34';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-white p-5 flex items-center justify-between border-b border-[#E8EAF2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F3F0FF] text-[#635BFF]">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#635BFF] uppercase tracking-wider">
                Final Approach Navigation
              </span>
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                Last-50-Metre Guidance
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

        {/* Demo Data Disclaimer Badge */}
        <div className="px-5 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Simulated Guidance:</strong> Indoor corridors, elevator positions, and door identifiers are illustrative examples for academic demonstration.
          </span>
        </div>

        {!hasArrived ? (
          <div className="p-6 space-y-6">
            {/* Destination Target Banner */}
            <div className="flex items-start justify-between p-4 bg-orange-50/70 rounded-2xl border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500 text-white rounded-xl shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-orange-700">Approaching Building:</span>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {destinationNode?.name || 'Selected Campus Block'}
                  </h4>
                  {selectedRoom && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md inline-block">
                      <Layers className="w-3.5 h-3.5 inline mr-1" />
                      Target Room: {selectedRoom.roomNumber} ({selectedRoom.name})
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Landmark-Based Approach Checklist */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Visual Landmarks to Spot on Final 50 Metres:
              </h5>

              {/* Step 1: Outdoor Portico */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h6 className="text-sm font-bold text-slate-900">
                    Identify the Building Entrance Porch
                  </h6>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {isHeroBlock34
                      ? "Look for the large white portico with university crest pillars and the bold red 'Block 34 - School of Computer Science & Engineering' fascia."
                      : `Look for the prominent building entrance marked '${destinationNode?.name}'.`}
                  </p>
                </div>
              </div>

              {/* Step 2: Ground Floor Foyer & Security */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h6 className="text-sm font-bold text-slate-900">
                    Enter Through Central Glass Doors
                  </h6>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Pass through the automatic sliding doors into the central foyer. The security information desk is stationed immediately to your right.
                  </p>
                </div>
              </div>

              {/* Step 3: Vertical Transit (Stairs / Elevators) */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h6 className="text-sm font-bold text-slate-900">
                    Vertical Transit (Elevators & Stairs)
                  </h6>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {selectedRoom ? (
                      <>
                        For <strong>{selectedRoom.roomNumber}</strong>, take the central elevator or wide marble staircase up to <strong>{selectedRoom.floorName}</strong>.
                      </>
                    ) : (
                      "Elevators are located on the left wing; wide central stairs are straight ahead in the atrium."
                    )}
                  </p>
                </div>
              </div>

              {/* Step 4: Room Identification */}
              {selectedRoom ? (
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-200 text-purple-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-purple-950">
                      Locate Room Door & Plaque
                    </h6>
                    <p className="text-xs text-purple-900 mt-0.5 leading-relaxed">
                      {selectedRoom.indoorDirections}
                    </p>
                    <p className="text-xs text-purple-700 mt-1 italic">
                      📍 Visual Cue: {selectedRoom.landmarkNearRoom}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-slate-900">
                      Check Atrium Wayfinding Directory
                    </h6>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Consult the floor directory board situated next to the security desk for faculty cabins, classrooms, or examination halls.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Arrival Confirmation Action Button */}
            <div className="pt-2">
              <button
                onClick={handleArrival}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-extrabold text-sm shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                I Have Arrived at Destination!
              </button>
            </div>
          </div>
        ) : (
          /* Celebratory Arrival Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Destination Reached Confidently
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-2">
                Welcome to {destinationNode?.name || 'Block 34'}!
              </h4>
              {selectedRoom && (
                <p className="text-sm font-semibold text-purple-700 mt-1">
                  You have safely arrived at {selectedRoom.roomNumber} ({selectedRoom.name}).
                </p>
              )}
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You navigated using P10 campus wayfinding. We hope your journey was smooth, confident, and stress-free.
            </p>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Re-check Guidance
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow transition-colors"
              >
                Back to Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
