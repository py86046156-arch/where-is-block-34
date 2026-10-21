import React from 'react';
import { 
  Calendar, 
  AlertCircle, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Clock, 
  Info
} from 'lucide-react';
import { DEMO_EVENTS } from '../data/campusData';

export default function EventMode({
  onSelectEventRoute,
  activeEventNotice,
  onDismissNotice,
}) {
  const getEventIcon = (category) => {
    switch (category) {
      case 'exam':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'ceremony':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'placement':
        return <Briefcase className="w-5 h-5 text-amber-600" />;
      default:
        return <Calendar className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Header Banner */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-2xl border border-orange-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
              Campus Event & Exam Navigation Mode
            </h2>
            <p className="text-xs text-slate-500">
              Simplified wayfinding for external candidates, parents, and convocation guests.
            </p>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Simulated Event Schedules:</strong> The following events and designated gates are sample demonstration entries for project demonstration.
          </span>
        </div>
      </div>

      {/* Temporary Route Advisory Banner */}
      {activeEventNotice && (
        <div className="mb-6 p-4 bg-orange-500 text-white rounded-2xl shadow-lg flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-100 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest bg-orange-700/60 px-2 py-0.5 rounded-full inline-block mb-1">
                Active Campus Transit Advisory
              </span>
              <p className="text-xs sm:text-sm font-bold">
                {activeEventNotice}
              </p>
            </div>
          </div>
          {onDismissNotice && (
            <button
              onClick={onDismissNotice}
              className="text-xs text-orange-200 hover:text-white underline whitespace-nowrap"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DEMO_EVENTS.map(evt => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 flex flex-col justify-between hover:border-orange-300 hover:shadow-xl transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {getEventIcon(evt.category)}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  evt.urgency === 'high'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {evt.urgency === 'high' ? 'High Traffic' : 'Special Mode'}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 leading-snug mb-1">
                {evt.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                {evt.date}
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {evt.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Recommended Gate:</span>
                  <span className="font-bold text-slate-900 uppercase">{evt.recommendedGate}</span>
                </div>
                {evt.primaryRoomId && (
                  <div className="flex items-center justify-between text-purple-800">
                    <span className="text-slate-500">Target Hall:</span>
                    <span className="font-bold">Room {evt.primaryRoomId}</span>
                  </div>
                )}
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 italic">
                  💡 {evt.notes}
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectEventRoute(evt)}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Navigate for This Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
