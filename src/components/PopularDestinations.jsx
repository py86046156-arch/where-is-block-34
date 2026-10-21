import React from 'react';
import { 
  Building2, 
  DoorOpen, 
  BookOpen, 
  ShoppingBag, 
  Sparkles, 
  HeartPulse, 
  Presentation,
  Compass,
  ArrowRight
} from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/campusData';

export default function PopularDestinations({ onSelectDestination, onSelectRoom, rooms = [] }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-orange-600" />;
      case 'DoorOpen':
        return <DoorOpen className="w-5 h-5 text-emerald-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-sky-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-teal-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Presentation':
        return <Presentation className="w-5 h-5 text-amber-600" />;
      default:
        return <Compass className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleCardClick = (dest) => {
    if (dest.type === 'room') {
      const roomObj = rooms.find(r => r.id === dest.roomId);
      if (roomObj && onSelectRoom) {
        onSelectRoom(roomObj);
      }
      if (onSelectDestination) {
        onSelectDestination(dest.targetNodeId);
      }
    } else {
      if (onSelectDestination) {
        onSelectDestination(dest.id);
      }
    }
  };

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>🔥 Popular Destinations</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">
              Quick Waypoints
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Frequently navigated locations by visitors, parents, and candidates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {POPULAR_DESTINATIONS.map((dest) => (
          <button
            key={dest.id}
            onClick={() => handleCardClick(dest)}
            className="group relative flex flex-col items-start p-3 bg-white hover:bg-orange-50/60 rounded-xl border border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white border border-slate-100 transition-colors">
                {getIcon(dest.icon)}
              </div>
              <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                {dest.badge}
              </span>
            </div>

            <span className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-orange-950">
              {dest.name}
            </span>

            <div className="mt-2 pt-1 border-t border-slate-100 w-full flex items-center justify-between text-[11px] text-slate-400 group-hover:text-orange-600">
              <span>Navigate</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
