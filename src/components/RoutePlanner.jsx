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
  ArrowUpDown
} from 'lucide-react';

export default function RoutePlanner({
  nodes = [],
  edges = [],
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

  // Split nodes for start vs destination dropdown
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
    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200/90 p-5 md:p-6 mb-6">
      {/* Planner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <Navigation className="w-4 h-4" />
            </div>
            <span>Campus Route Planner</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dijkstra shortest-path algorithm over simulated campus pedestrian walkways.
          </p>
        </div>

        {/* Shaded Walkways Toggle */}
        <button
          onClick={onTogglePreferCovered}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
            preferCovered
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title="Prioritize shaded corridors during rain or harsh sun"
        >
          <Umbrella className="w-3.5 h-3.5 text-amber-600" />
          <span>{preferCovered ? 'Covered Walkways Prioritized' : 'All Walkways'}</span>
        </button>
      </div>

      {/* Origin & Destination Pickers */}
      <div className="space-y-3 mb-4">
        {/* Origin / Starting Point */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
              Starting Point (Gate / Landmark)
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSetStart('gate-1')}
                className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors"
              >
                Set Gate 1
              </button>
            </div>
          </div>

          <select
            value={startNodeId || ''}
            onChange={(e) => onSetStart(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="">Choose where you are currently located...</option>
            <optgroup label="Entrance Gates">
              {gateNodes.map(n => (
                <option key={n.id} value={n.id}>
                  🚪 {n.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Academic Blocks & Facilities">
              {otherNodes.map(n => (
                <option key={n.id} value={n.id}>
                  📍 {n.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={handleSwapPoints}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-orange-100 text-slate-500 hover:text-orange-600 border border-slate-200 transition-colors shadow-xs"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Point */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-orange-100 animate-pulse"></span>
              Destination (Academic Block / Hub)
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSetDestination('block-34')}
                className="text-[10px] font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 px-2 py-0.5 rounded-md transition-colors"
              >
                Set Block 34
              </button>
            </div>
          </div>

          <select
            value={destinationNodeId || ''}
            onChange={(e) => onSetDestination(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          >
            <option value="">Choose target block, room, or gate...</option>
            <optgroup label="Academic Blocks">
              {nodes.filter(n => n.category === 'block').map(n => (
                <option key={n.id} value={n.id}>
                  🏢 {n.name} {n.isHeroBlock ? '★ (Hero Target)' : ''}
                </option>
              ))}
            </optgroup>
            <optgroup label="Campus Landmarks & Facilities">
              {nodes.filter(n => n.category === 'landmark').map(n => (
                <option key={n.id} value={n.id}>
                  🏛️ {n.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Campus Gates">
              {gateNodes.map(n => (
                <option key={n.id} value={n.id}>
                  🚪 {n.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Target Room Badge */}
      {selectedRoom && destinationNodeId === selectedRoom.blockId && (
        <div className="mb-4 p-3 bg-purple-50/80 border border-purple-200 rounded-2xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-purple-950">
                Target Room: {selectedRoom.roomNumber} ({selectedRoom.name})
              </div>
              <div className="text-[11px] text-purple-700">
                Floor: {selectedRoom.floorName} • Indoor navigation guidance ready.
              </div>
            </div>
          </div>
          <button
            onClick={onOpenLast50m}
            className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs"
          >
            View Indoor
          </button>
        </div>
      )}

      {/* Action Buttons: Find Route & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onCalculateRoute}
            disabled={!startNodeId || !destinationNodeId}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all ${
              startNodeId && destinationNodeId
                ? 'bg-orange-600 hover:bg-orange-500 text-white hover:shadow-orange-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Navigation className="w-4 h-4" />
            Calculate Shortest Route
          </button>

          {(startNodeId || destinationNodeId || activeRoute) && (
            <button
              onClick={onResetRoute}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

        {/* Alternative Route Switcher */}
        {alternativeRoute && alternativeRoute.success && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setUseAlternative(false)}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                !useAlternative ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
              }`}
            >
              Primary ({activeRoute?.totalDistance}m)
            </button>
            <button
              onClick={() => setUseAlternative(true)}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                useAlternative ? 'bg-white shadow-xs text-orange-600' : 'text-slate-500'
              }`}
            >
              Alternative ({alternativeRoute.totalDistance}m)
            </button>
          </div>
        )}
      </div>

      {/* Calculated Route Summary Card */}
      {currentRoute && currentRoute.success && (
        <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 p-3 bg-orange-50/70 rounded-2xl border border-orange-200/80">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Distance
              </span>
              <div className="text-base sm:text-lg font-black text-orange-950 flex items-center gap-1 mt-0.5">
                <Footprints className="w-4 h-4 text-orange-600" />
                ~{currentRoute.totalDistance}m
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Est. Walking Time
              </span>
              <div className="text-base sm:text-lg font-black text-orange-950 flex items-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-orange-600" />
                ~{currentRoute.estimatedMinutes} min
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Segments
              </span>
              <div className="text-base sm:text-lg font-black text-slate-800 mt-0.5">
                {currentRoute.path.length} points
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Data Status
              </span>
              <div className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                Demo Model
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Guide Trigger or Active Card */}
          {!isNavActive ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-navy-950 text-white rounded-2xl shadow-lg">
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-orange-400" />
                  Turn-by-Turn Navigation Ready
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Follow turn indicators, walkway intersections, and landmark cues.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleStartNav}
                  className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Start Navigation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onOpenLast50m}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                >
                  Last-50m
                </button>
              </div>
            </div>
          ) : (
            /* Active Step Guidance Box */
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-extrabold text-orange-400 uppercase tracking-wider">
                  Step {navStepIndex + 1} of {currentRoute.steps.length}
                </span>
                <button
                  onClick={() => setIsNavActive(false)}
                  className="text-slate-400 hover:text-white underline text-xs font-medium"
                >
                  Exit Step Guide
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${((navStepIndex + 1) / currentRoute.steps.length) * 100}%` }}
                ></div>
              </div>

              {/* Current Step Instruction */}
              <div className="my-3">
                <div className="text-sm sm:text-base font-bold text-white mb-1 leading-snug">
                  {currentStep?.instruction}
                </div>
                {currentStep?.edgeDescription && (
                  <p className="text-xs text-slate-300 italic">
                    ℹ️ Landmark note: {currentStep.edgeDescription}
                  </p>
                )}
              </div>

              {/* Next / Previous Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={handlePrevStep}
                  disabled={navStepIndex === 0}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                    navStepIndex === 0
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>

                {isLastStep ? (
                  <button
                    onClick={onOpenLast50m}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Open Last-50m Guide
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    Next Turn <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Collapsible Waypoint Sequence */}
          <div className="mt-4">
            <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              All Route Waypoints ({currentRoute.steps.length} segments)
            </h5>
            <ol className="relative border-l border-slate-200 ml-3 space-y-3">
              {currentRoute.steps.map((st, i) => (
                <li key={i} className="ml-4">
                  <div className={`absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full border-2 border-white ${
                    st.isArrival ? 'bg-emerald-500' : 'bg-orange-500'
                  }`}></div>
                  <div className="text-xs font-bold text-slate-900">
                    {st.instruction}
                  </div>
                  {st.distance > 0 && (
                    <div className="text-[11px] text-slate-500">
                      Segment distance: ~{st.distance}m
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
            <h4 className="font-extrabold text-sm text-rose-950">Route Not Found</h4>
            <p className="text-xs text-rose-700 mt-0.5">
              {currentRoute.error || "No continuous simulated pathway exists between the chosen locations."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
