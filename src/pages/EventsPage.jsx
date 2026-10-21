import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Search, 
  Clock, 
  MapPin, 
  ArrowRight, 
  AlertCircle, 
  Info,
  GraduationCap,
  Briefcase,
  FileText,
  DoorOpen
} from 'lucide-react';
import { DEMO_EVENTS } from '../data/campusData';
import ScrollReveal from '../components/ScrollReveal';

export default function EventsPage({ onDismissNotice }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeNotice, setActiveNotice] = useState(
    "CAMPUS EXAM ADVISORY: Mid-Term Examination active in Block 34 & Block 32. External candidates report via Gate 1."
  );
  const navigate = useNavigate();

  const getEventIcon = (category) => {
    switch (category) {
      case 'exam':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'ceremony':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'placement':
        return <Briefcase className="w-5 h-5 text-amber-600" />;
      default:
        return <Calendar className="w-5 h-5 text-[#635BFF]" />;
    }
  };

  const filteredEvents = useMemo(() => {
    return DEMO_EVENTS.filter(evt => {
      const matchesCategory = selectedCategory === 'all' || evt.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesQuery = !q ||
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.recommendedGate.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8EAF2]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F0FF] text-xs font-semibold text-[#635BFF] mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Schedules</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Campus Events & Exam Mode
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-1">
            Exam schedules, placement interview halls, convocation guides, and venue navigation.
          </p>
        </div>
      </div>

      {/* Advisory Banner */}
      {activeNotice && (
        <div className="p-4 bg-[#635BFF] text-white rounded-2xl shadow-sm flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-white/80 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                Active Transit Advisory
              </span>
              <p className="text-xs sm:text-sm font-semibold">
                {activeNotice}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveNotice('')}
            className="text-xs text-white/80 hover:text-white underline whitespace-nowrap"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8EAF2] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, exams, or halls..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E8EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 text-[#0F172A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'exam', label: 'Examinations' },
            { id: 'ceremony', label: 'Ceremonies' },
            { id: 'placement', label: 'Placements' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#635BFF] text-white shadow-xs'
                  : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt, idx) => (
          <ScrollReveal key={evt.id} direction="up" delay={Math.min(idx * 50, 200)}>
            <div
              className="bg-white rounded-2xl shadow-sm hover:shadow-card-hover border border-[#E8EAF2] hover:border-[#C7BDFF] p-6 flex flex-col justify-between transition-all duration-200 h-full"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-[#F3F0FF]">
                    {getEventIcon(evt.category)}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    evt.urgency === 'high'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {evt.urgency === 'high' ? 'High Traffic Exam' : 'Official Notice'}
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
                onClick={() => {
                  navigate(`/map?dest=${evt.primaryDestinationId}&start=${evt.recommendedGate}${evt.primaryRoomId ? `&room=${evt.primaryRoomId}` : ''}`);
                }}
                className="w-full py-2.5 bg-[#635BFF] hover:bg-[#5145E5] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Navigate to Venue on Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        ))}
      </div>

    </div>
  );
}
