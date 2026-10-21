import React from 'react';
import { 
  Building2, 
  Layers, 
  GraduationCap, 
  DoorOpen, 
  Compass, 
  ShieldAlert, 
  ArrowRight 
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function DestinationDiscovery({
  onSelectCategory,
  onSelectQuickDestination,
}) {
  const categories = [
    {
      id: 'academic-blocks',
      title: 'Academic Blocks',
      description: 'Explore schools of Computer Science, Engineering, Business, and Arts.',
      icon: <Building2 className="w-5 h-5 text-[#635BFF]" />,
      iconBg: 'bg-[#F3F0FF]',
      actionNodeId: 'block-34',
    },
    {
      id: 'classrooms-labs',
      title: 'Classrooms & Labs',
      description: 'Find lecture halls, AI research clusters, physics labs, and workshops.',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      iconBg: 'bg-indigo-50',
      actionRoomId: '34-205',
    },
    {
      id: 'examination-halls',
      title: 'Examination Halls',
      description: 'Locate designated exam centers, seating notices, and reporting blocks.',
      icon: <GraduationCap className="w-5 h-5 text-violet-600" />,
      iconBg: 'bg-violet-50',
      actionView: 'events',
    },
    {
      id: 'campus-gates',
      title: 'Campus Gates',
      description: 'Directions from Gate 1 (GT Road), Gate 2, Gate 3, and Gate 4.',
      icon: <DoorOpen className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
      actionNodeId: 'gate-1',
    },
    {
      id: 'student-facilities',
      title: 'Student Facilities',
      description: 'Access the Central Library, UniMall retail, dining plazas, and banks.',
      icon: <Compass className="w-5 h-5 text-sky-600" />,
      iconBg: 'bg-sky-50',
      actionNodeId: 'block-28',
    },
    {
      id: 'emergency-services',
      title: 'Emergency Services',
      description: '24/7 University Hospital, ambulance access, and security posts.',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
      iconBg: 'bg-rose-50',
      actionNodeId: 'hospital',
    },
  ];

  return (
    <section id="destinations-section" className="w-full my-8 scroll-mt-20">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
          Where do you need to go?
        </h2>
        <p className="text-sm sm:text-base text-[#64748B] mt-1">
          Explore the places that matter across campus.
        </p>
      </div>

      {/* Grid of 6 Clean Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat, idx) => (
          <ScrollReveal key={cat.id} direction="up" delay={idx * 50}>
            <div
              onClick={() => {
                if (cat.actionView) {
                  if (onSelectCategory) onSelectCategory(cat.actionView);
                } else if (cat.actionNodeId) {
                  if (onSelectQuickDestination) onSelectQuickDestination(cat.actionNodeId);
                } else if (cat.actionRoomId) {
                  if (onSelectQuickDestination) onSelectQuickDestination('block-34', cat.actionRoomId);
                }
              }}
              className="group relative bg-white rounded-2xl border border-[#E8EAF2] p-5 sm:p-6 shadow-sm hover:shadow-card-hover hover:border-[#C7BDFF] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full"
            >
              <div>
                {/* Icon Container with restrained tint */}
                <div className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-200`}>
                  {cat.icon}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#635BFF] transition-colors leading-snug">
                  {cat.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Navigation Affordance Arrow */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#64748B] group-hover:text-[#635BFF] transition-colors">
                <span>View places</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
