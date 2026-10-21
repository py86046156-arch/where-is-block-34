import React, { useState } from 'react';
import { 
  Navigation, 
  Clock, 
  Footprints, 
  RotateCcw, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Umbrella, 
  ArrowUpDown,
  CornerDownRight
} from 'lucide-react';

export default function RoutePlanner({
  nodes = [],
  _edges = [],
  startNodeId,
  destinationNodeId,
  onSetStart,
  onSetDestination,
  activeRoute,
  alternativeRoute,
  onCalculateRoute,
  onResetRoute,
  onOpenLast50m,
  selectedRoom = null,
  preferCovered = false,
  onTogglePreferCovered,
}) {
  const [navStepIndex, setNavStepIndex] = useState(0);
  const [isNavActive, setIsNavActive] = useState(false);
  const [useAlternative, setUseAlternative] = useState(false);

  const currentRoute = useAlternative && alternativeRoute ? alternativeRoute : activeRoute;

  // Split nodes for dropdowns
  const gateNodes = nodes.filter(n => n.category === 'gate');
  const otherNodes = nodes.filter(n => n.category !== 'gate');

  const handleStartNav = () => {
    setIsNavActive(true);
    setNavStepIndex(0);
  };

  const handleNextStep = () => {
    if (currentRoute && navStepIndex < currentRoute.steps.length - 1) {
      setNavStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (navStepIndex > 0) {
      setNavStepIndex(prev => prev - 1);
    }
  };

  // Swap Origin and Destination
  const handleSwapPoints = () => {
    const temp = startNodeId;
    onSetStart(destinationNodeId);
    onSetDestination(temp);
  };

  const currentStep = currentRoute?.steps?.[navStepIndex];
  const isLastStep = currentRoute && navStepIndex === currentRoute.steps.length - 1;

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-[#E8EAF2] p-6 mb-6">
      
      {/* Planner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8EAF2]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#F3F0FF] text-[#635BFF] flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </span>
            <span>Plan your route</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Find the best walking route between campus destinations.
          </p>
        </div>

        {/* Shaded Walkways Toggle */}
        <button
          onClick={onTogglePreferCovered}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            preferCovered
              ? 'bg-[#F3F0FF] text-[#635BFF] border border-[#C7BDFF]'
              : 'bg-slate-100 hover:bg-slate-200/70 text-[#64748B]'
          }`}
          title="Prioritize shaded corridors during rain or heat"
        >
          <Umbrella className="w-3.5 h-3.5 text-[#635BFF]" />
          <span>{preferCovered ? 'Covered Walkways' : 'All Walkways'}</span>
        </button>
      </div>

      {/* Origin & Destination Inputs */}
      <div className="space-y-3 mb-5">
        
        {/* Starting Point (A) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] ring-4 ring-emerald-50"></span>
              Starting point
            </label>
            <button
              type="button"
              onClick={() => onSetStart('gate-1')}
              className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors"
            >
              Use Gate 1 (Main)
            </button>
          </div>

          <div className="relative">
            <select
              value={startNodeId || ''}
              onChange={(e) => onSetStart(e.target.value)}
              className="w-full py-2.5 pl-3 pr-8 bg-slate-50 border border-[#E8EAF2] rounded-xl text-xs sm:text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all cursor-pointer"
            >
              <option value="">Select origin location...</option>
              <optgroup label="Entrance Gates">
                {gateNodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Academic Blocks & Facilities">
                {otherNodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Swap Origin & Destination Button */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            type="button"
            onClick={handleSwapPoints}
            className="p-1.5 rounded-full bg-white hover:bg-slate-50 text-[#64748B] hover:text-[#635BFF] border border-[#E8EAF2] shadow-xs hover:shadow-sm transition-all"
            title="Swap locations"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination (B) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF] ring-4 ring-brand-50"></span>
              Destination
            </label>
            <button
              type="button"
              onClick={() => onSetDestination('block-34')}
              className="text-[11px] font-semibold text-[#635BFF] bg-[#F3F0FF] hover:bg-[#E0DBFF] px-2 py-0.5 rounded-md transition-colors"
            >
              Set Block 34 (Hero)
            </button>
          </div>

          <div className="relative">
            <select
              value={destinationNodeId || ''}
              onChange={(e) => onSetDestination(e.target.value)}
              className="w-full py-2.5 pl-3 pr-8 bg-slate-50 border border-[#E8EAF2] rounded-xl text-xs sm:text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all cursor-pointer"
            >
              <option value="">Select target destination...</option>
              <optgroup label="Academic Blocks">
                {nodes.filter(n => n.category === 'block').map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name} {n.isHeroBlock ? '★' : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Campus Facilities & Landmarks">
                {nodes.filter(n => n.category === 'landmark').map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Campus Gates">
                {gateNodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Target Room Badge (if selected) */}
      {selectedRoom && destinationNodeId === selectedRoom.blockId && (
        <div className="mb-5 p-3.5 bg-[#FAF9FF] border border-[#E0DBFF] rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F3F0FF] text-[#635BFF] flex items-center justify-center flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A]">
                Room {selectedRoom.roomNumber} ({selectedRoom.name})
              </div>
              <div className="text-[11px] text-[#64748B]">
                Floor: {selectedRoom.floorName} • Indoor navigation ready
              </div>
            </div>
          </div>
          <button
            onClick={onOpenLast50m}
            className="px-3 py-1.5 bg-[#635BFF] hover:bg-[#5145E5] text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shadow-xs"
          >
            Indoor Guide
          </button>
        </div>
      )}

      {/* Primary & Secondary Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={onCalculateRoute}
            disabled={!startNodeId || !destinationNodeId}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all ${
              startNodeId && destinationNodeId
                ? 'bg-[#635BFF] hover:bg-[#5145E5] text-white shadow-brand-500/20 hover:shadow-md'
                : 'bg-slate-100 text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Find Best Route</span>
          </button>

          {(startNodeId || destinationNodeId || activeRoute) && (
            <button
              onClick={onResetRoute}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-[#64748B] hover:text-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Alternative Route Switcher */}
        {alternativeRoute && alternativeRoute.success && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setUseAlternative(false)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                !useAlternative ? 'bg-white shadow-xs text-[#0F172A]' : 'text-[#64748B]'
              }`}
            >
              Primary ({activeRoute?.totalDistance}m)
            </button>
            <button
              onClick={() => setUseAlternative(true)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                useAlternative ? 'bg-white shadow-xs text-[#635BFF]' : 'text-[#64748B]'
              }`}
            >
              Alternative ({alternativeRoute.totalDistance}m)
            </button>
          </div>
        )}
      </div>

      {/* Route Result Card */}
      {currentRoute && currentRoute.success && (
        <div className="mt-4 pt-5 border-t border-[#E8EAF2] animate-fadeIn">
          
          {/* Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 p-3.5 bg-slate-50 rounded-2xl border border-[#E8EAF2]">
            <div>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Distance
              </span>
              <div className="text-base font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
                <Footprints className="w-4 h-4 text-[#635BFF]" />
                ~{currentRoute.totalDistance} m
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Walking Time
              </span>
              <div className="text-base font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-[#635BFF]" />
                ~{currentRoute.estimatedMinutes} min
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Route Segments
              </span>
              <div className="text-base font-bold text-[#0F172A] mt-0.5">
                {currentRoute.path.length} points
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Data Mode
              </span>
              <div className="text-[11px] font-semibold text-[#635BFF] bg-[#F3F0FF] px-2 py-0.5 rounded-md inline-block mt-1">
                Demo
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Guidance Mode vs Summary View */}
          {!isNavActive ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#FAF9FF] border border-[#E0DBFF] rounded-2xl">
              <div>
                <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#635BFF]" />
                  Turn-by-turn directions ready
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Step-by-step corridor cues, turns, and landmark waypoints.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleStartNav}
                  className="w-full sm:w-auto px-4 py-2 bg-[#635BFF] hover:bg-[#5145E5] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Start Navigation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onOpenLast50m}
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E8EAF2] rounded-xl text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  Indoor Guide
                </button>
              </div>
            </div>
          ) : (
            /* Focused Navigation Mode */
            <div className="p-5 bg-white rounded-2xl border-2 border-[#635BFF] shadow-lg animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2.5">
                <span className="font-bold text-[#635BFF] uppercase tracking-wider">
                  Step {navStepIndex + 1} of {currentRoute.steps.length}
                </span>
                <button
                  onClick={() => setIsNavActive(false)}
                  className="text-[#64748B] hover:text-[#0F172A] text-xs font-semibold transition-colors"
                >
                  Exit Navigation
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-[#635BFF] transition-all duration-300"
                  style={{ width: `${((navStepIndex + 1) / currentRoute.steps.length) * 100}%` }}
                ></div>
              </div>

              {/* Current Step Instruction */}
              <div className="my-4">
                <div className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                  {currentStep?.instruction}
                </div>
                {currentStep?.edgeDescription && (
                  <p className="text-xs text-[#64748B] mt-1.5 flex items-center gap-1">
                    <CornerDownRight className="w-3.5 h-3.5 text-[#635BFF]" />
                    <span>{currentStep.edgeDescription}</span>
                  </p>
                )}
                {currentStep?.distance > 0 && (
                  <div className="text-xs text-[#94A3B8] font-medium mt-1">
                    Distance to next turn: ~{currentStep.distance} m
                  </div>
                )}
              </div>

              {/* Previous / Next Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E8EAF2]">
                <button
                  onClick={handlePrevStep}
                  disabled={navStepIndex === 0}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 ${
                    navStepIndex === 0
                      ? 'text-[#94A3B8] cursor-not-allowed'
                      : 'bg-slate-100 text-[#0F172A] hover:bg-slate-200'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>

                {isLastStep ? (
                  <button
                    onClick={onOpenLast50m}
                    className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm animate-pulse"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Open Indoor Guide
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-[#635BFF] hover:bg-[#5145E5] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    Next Turn <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Turn-by-Turn Vertical Timeline */}
          <div className="mt-6">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
              Route Timeline ({currentRoute.steps.length} Waypoints)
            </h5>
            <ol className="relative border-l-2 border-[#E8EAF2] ml-3 space-y-4">
              {currentRoute.steps.map((st, i) => (
                <li key={i} className="ml-4">
                  {/* Timeline Node Marker */}
                  <div className={`absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full border-2 border-white ${
                    st.isArrival 
                      ? 'bg-[#10B981]' 
                      : i === 0 
                      ? 'bg-emerald-600' 
                      : 'bg-[#635BFF]'
                  }`}></div>

                  <div className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                    {st.instruction}
                  </div>
                  {st.distance > 0 && (
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      Segment distance: ~{st.distance} m
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Unreachable Route Error */}
      {currentRoute && !currentRoute.success && (
        <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-rose-950">Route Not Found</h4>
            <p className="text-xs text-rose-700 mt-0.5">
              {currentRoute.error || "No continuous pathway exists between the chosen locations."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
