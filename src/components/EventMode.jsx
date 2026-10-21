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
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-[#F3F0FF] text-[#635BFF] rounded-2xl border border-[#E0DBFF]">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0F172A]">
              Campus Event & Exam Navigation Mode
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Streamlined wayfinding for external candidates, parents, and convocation guests.
            </p>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="p-3 bg-slate-50 rounded-xl border border-[#E8EAF2] text-xs text-[#64748B] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#635BFF] flex-shrink-0" />
          <span>
            <strong>Simulated Event Schedules:</strong> Sample demonstration entries illustrating designated gates and quiet zones during exams.
          </span>
        </div>
      </div>

      {/* Route Advisory Banner */}
      {activeEventNotice && (
        <div className="mb-6 p-4 bg-[#635BFF] text-white rounded-2xl shadow-md flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-white/80 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                Campus Transit Advisory
              </span>
              <p className="text-xs sm:text-sm font-semibold">
                {activeEventNotice}
              </p>
            </div>
          </div>
          {onDismissNotice && (
            <button
              onClick={onDismissNotice}
              className="text-xs text-white/80 hover:text-white underline whitespace-nowrap"
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
            className="bg-white rounded-2xl shadow-sm hover:shadow-card-hover border border-[#E8EAF2] hover:border-[#C7BDFF] p-5 flex flex-col justify-between transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {getEventIcon(evt.category)}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  evt.urgency === 'high'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {evt.urgency === 'high' ? 'High Traffic' : 'Special Mode'}
                </span>
              </div>

              <h3 className="font-bold text-base text-[#0F172A] leading-snug mb-1">
                {evt.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] mb-3">
                <Clock className="w-3.5 h-3.5 text-[#635BFF]" />
                {evt.date}
              </div>

              <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
                {evt.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-[#0F172A]">
                  <span className="text-[#64748B]">Recommended Gate:</span>
                  <span className="font-bold uppercase">{evt.recommendedGate}</span>
                </div>
                {evt.primaryRoomId && (
                  <div className="flex items-center justify-between text-[#635BFF]">
                    <span className="text-[#64748B]">Target Hall:</span>
                    <span className="font-bold">Room {evt.primaryRoomId}</span>
                  </div>
                )}
                <div className="text-[11px] text-[#94A3B8] pt-1 border-t border-slate-200/80 italic">
                  💡 {evt.notes}
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectEventRoute(evt)}
              className="w-full py-2.5 bg-[#635BFF] hover:bg-[#5145E5] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
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
