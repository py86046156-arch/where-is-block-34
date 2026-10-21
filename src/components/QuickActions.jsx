import React from 'react';
import { Building2, Layers, DoorOpen, HelpCircle, GraduationCap } from 'lucide-react';

export default function QuickActions({
  onFindBlock,
  onFindRoom,
  onFindGate,
  onOpenHelp,
  onFindExamHall,
}) {
  const actions = [
    {
      title: "Find a Block",
      desc: "Locate academic blocks 32, 34, 38, or 13",
      icon: <Building2 className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-50 hover:bg-orange-100/80 border-orange-200",
      iconBg: "bg-orange-100",
      handler: onFindBlock,
    },
    {
      title: "Find a Room / Lab",
      desc: "Floor directory & door plaque guidance",
      icon: <Layers className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50 hover:bg-purple-100/80 border-purple-200",
      iconBg: "bg-purple-100",
      handler: onFindRoom,
    },
    {
      title: "Exam Hall",
      desc: "Find your assigned examination block",
      icon: <GraduationCap className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50 hover:bg-amber-100/80 border-amber-200",
      iconBg: "bg-amber-100",
      handler: onFindExamHall,
    },
    {
      title: "Campus Gates",
      desc: "Directions from Gate 1, 2, 3, or 4",
      icon: <DoorOpen className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200",
      iconBg: "bg-emerald-100",
      handler: onFindGate,
    },
    {
      title: "Help & FAQ",
      desc: "QR scanning, gate guide & contacts",
      icon: <HelpCircle className="w-5 h-5 text-indigo-600" />,
      bg: "bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200",
      iconBg: "bg-indigo-100",
      handler: onOpenHelp,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 my-4">
      {actions.map((act, i) => (
        <button
          key={i}
          onClick={act.handler}
          className={`p-3.5 rounded-2xl border text-left transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-orange-400 ${act.bg}`}
        >
          <div className={`p-2 rounded-xl ${act.iconBg} shadow-xs inline-block mb-2 w-fit`}>
            {act.icon}
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
              {act.title}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
              {act.desc}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
