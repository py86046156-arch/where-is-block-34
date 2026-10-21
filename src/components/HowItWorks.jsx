import React from 'react';
import { Search, MapPin, Navigation, Compass } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const STEPS = [
  {
    num: "01",
    title: "Search for a destination",
    desc: "Type an academic block, lecture hall, gate, or faculty department into the smart search bar.",
    icon: <Search className="w-4 h-4 text-[#635BFF]" />,
  },
  {
    num: "02",
    title: "Select a building or landmark",
    desc: "Choose from verified campus locations, entrance gates, or specific room numbers like 34-205.",
    icon: <MapPin className="w-4 h-4 text-[#635BFF]" />,
  },
  {
    num: "03",
    title: "Calculate shortest walking route",
    desc: "The Dijkstra routing engine computes the optimal pedestrian path with distance and time estimates.",
    icon: <Navigation className="w-4 h-4 text-[#635BFF]" />,
  },
  {
    num: "04",
    title: "Follow indoor guidance",
    desc: "Follow the turn-by-turn timeline and switch to last-50m indoor elevator and door plaque assistance.",
    icon: <Compass className="w-4 h-4 text-[#635BFF]" />,
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full my-12 pt-4">
      {/* Section Heading */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-[#F3F0FF] text-[#635BFF] text-xs font-semibold uppercase tracking-wider mb-2">
          How It Works
        </span>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
          Intelligent navigation in four simple steps
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
          Designed for seamless campus wayfinding with zero learning curve.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {STEPS.map((step, idx) => (
          <ScrollReveal key={step.num} direction="up" delay={idx * 60}>
            <div
              className="relative bg-white rounded-2xl border border-[#E8EAF2] p-5 shadow-sm hover:shadow-card-hover hover:border-[#C7BDFF] transition-all duration-200 flex flex-col justify-between h-full"
            >
              <div>
                {/* Header: Number and Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold font-mono text-[#635BFF] bg-[#F3F0FF] px-2 py-0.5 rounded-md">
                    Step {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                {/* Title & Desc */}
                <h4 className="font-bold text-sm text-[#0F172A] leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
