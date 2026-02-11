
import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, icon, children }) => {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-lg">
          {icon}
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      <div className="pl-2 border-l border-slate-800/50 ml-6">
        {children}
      </div>
    </section>
  );
};

export default Section;
