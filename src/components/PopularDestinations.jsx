import React from 'react';
import { 
  Building2, 
  Layers, 
  DoorOpen, 
  BookOpen, 
  ShoppingBag, 
  HeartPulse, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function PopularDestinations({ 
  onSelectDestination, 
  onSelectRoom, 
  rooms = [] 
}) {
  const destinations = [
    {
      id: 'block-34',
      name: 'Block 34',
      subtitle: 'School of Computer Science & Engineering',
      category: 'Academic Hub',
      type: 'block',
      targetNodeId: 'block-34',
      icon: <Building2 className="w-4 h-4 text-[#635BFF]" />,
      badge: 'Hero Block',
      isHero: true,
    },
    {
      id: 'room-34-205',
      name: 'Room 304-205',
      subtitle: 'Grand Seminar Hall & Auditorium',
      category: 'Lecture Hall',
      type: 'room',
      roomId: '34-205',
      targetNodeId: 'block-34',
      icon: <Layers className="w-4 h-4 text-[#635BFF]" />,
      badge: 'Popular',
    },
    {
      id: 'gate-1',
      name: 'Gate 1',
      subtitle: 'Main GT Road Entrance & Reception',
      category: 'Campus Entry',
      type: 'gate',
      targetNodeId: 'gate-1',
      icon: <DoorOpen className="w-4 h-4 text-[#635BFF]" />,
      badge: 'Primary Gate',
    },
    {
      id: 'block-28',
      name: 'Block 28',
      subtitle: 'Central University Library & Research Center',
      category: 'Library',
      type: 'block',
      targetNodeId: 'block-28',
      icon: <BookOpen className="w-4 h-4 text-[#635BFF]" />,
      badge: 'Study Zone',
    },
    {
      id: 'block-25',
      name: 'Block 25',
      subtitle: 'UniMall Commercial Plaza & Banking Hub',
      category: 'Commercial',
      type: 'block',
      targetNodeId: 'block-25',
      icon: <ShoppingBag className="w-4 h-4 text-[#635BFF]" />,
      badge: 'Dining & Retail',
    },
    {
      id: 'hospital',
      name: 'Uni-Hospital',
      subtitle: 'Emergency Medical Services & Health Center',
      category: 'Healthcare',
      type: 'landmark',
      targetNodeId: 'hospital',
      icon: <HeartPulse className="w-4 h-4 text-[#635BFF]" />,
      badge: '24/7 Care',
    },
  ];

  const handleDestinationClick = (item) => {
    if (item.type === 'room') {
      const roomObj = rooms.find(r => r.id === item.roomId || r.id === '34-205');
      if (roomObj && onSelectRoom) {
        onSelectRoom(roomObj);
      }
      if (onSelectDestination) {
        onSelectDestination(item.targetNodeId);
      }
    } else {
      if (onSelectDestination) {
        onSelectDestination(item.targetNodeId);
      }
    }

    // Smooth scroll to map
    const mapEl = document.getElementById('campus-map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="w-full my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3F0FF] text-[#635BFF]">
              <TrendingUp className="w-3 h-3" />
              Frequently Visited
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
            Popular Destinations
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Select any location to immediately plan a route or view on the map.
        </p>
      </div>

      {/* Grid of 6 Compact Horizontal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {destinations.map((item, idx) => (
          <ScrollReveal key={item.id} direction="up" delay={idx * 50}>
            <div
              onClick={() => handleDestinationClick(item)}
              className="group relative bg-white hover:bg-[#FAF9FF] rounded-2xl border border-[#E8EAF2] hover:border-[#C7BDFF] p-4 shadow-sm hover:shadow-card-hover transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 text-left h-full"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Category Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#F3F0FF] group-hover:bg-[#E0DBFF] flex items-center justify-center flex-shrink-0 transition-colors">
                  {item.icon}
                </div>

                {/* Text Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#635BFF] transition-colors truncate">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-medium text-[#64748B] bg-slate-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Icon */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="hidden xl:inline text-xs font-semibold text-[#64748B] group-hover:text-[#635BFF] transition-colors">
                  Navigate
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#635BFF] text-[#64748B] group-hover:text-white flex items-center justify-center transition-all duration-200">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
