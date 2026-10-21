import React from 'react';
import { QrCode, MapPin, Navigation, DoorOpen } from 'lucide-react';

const STEPS = [
  {
    icon: <DoorOpen className="w-6 h-6 text-white" />,
    bg: "bg-emerald-500",
    num: "01",
    title: "Arrive at a Gate",
    desc: "Enter through Gate 1 (GT Road), Gate 2, 3, or 4. Scan any physical QR waypoint sign posted at the entrance.",
  },
  {
    icon: <MapPin className="w-6 h-6 text-white" />,
    bg: "bg-orange-500",
    num: "02",
    title: "Search Your Destination",
    desc: "Type the block number, room code (e.g. 34-205), landmark, or exam hall name into the search bar.",
  },
  {
    icon: <Navigation className="w-6 h-6 text-white" />,
    bg: "bg-sky-500",
    num: "03",
    title: "Follow the Route",
    desc: "The Dijkstra engine highlights the shortest corridor path with turn-by-turn direction cards and covered walkway options.",
  },
  {
    icon: <QrCode className="w-6 h-6 text-white" />,
    bg: "bg-purple-500",
    num: "04",
    title: "Last-50m Indoor Guide",
    desc: "At the building portico, tap 'Last 50 m' for lift/staircase selection, floor plan view, and door plaque confirmation.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full my-6">
      <div className="mb-5 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
          How It Works
        </span>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          From Campus Gate to the Right Room in 4 Steps
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
          No map reading required. Just search, follow, and arrive.{' '}
          <span className="text-amber-600 font-medium">Demo data — update with verified LPU coordinates.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex flex-col gap-3 overflow-hidden"
          >
            {/* Step number watermark */}
            <span className="absolute top-3 right-4 text-5xl font-black text-slate-100 select-none leading-none">
              {step.num}
            </span>

            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.bg} shadow-sm`}>
              {step.icon}
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                {step.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
