
import React from 'react';
import { SKILLS, RAJESH_DATA } from '../constants';

const BentoGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Mission profile - Compact & Premium */}
      <div className="md:col-span-2 obsidian-card p-8 rounded-[2rem] flex flex-col justify-center relative overflow-hidden group border-white/5">
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-[0.03] font-black group-hover:rotate-6 transition-transform duration-700 select-none">DATA</div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-cyan-400 rounded-full"></div>
          <h3 className="text-[10px] font-black mono text-cyan-400 tracking-[0.4em] uppercase">Mission_Directive</h3>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed font-medium opacity-90">
          {RAJESH_DATA.bio}
        </p>
      </div>

      {/* Origin/Education Module */}
      <div className="md:col-span-1 obsidian-card p-8 rounded-[2rem] flex flex-col items-center justify-center text-center group transition-all border-white/5">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all border border-white/10 shadow-lg shadow-black">
          <span className="text-xl">🎓</span>
        </div>
        <p className="text-[9px] mono text-cyan-400 font-black uppercase tracking-widest mb-1">IOE Pulchowk</p>
        <p className="text-[8px] text-slate-500 font-black italic tracking-tighter uppercase">'24 BE COMPUTER</p>
      </div>

      {/* Tech Matrix - Reorganized for vertical efficiency */}
      <div className="md:col-span-3 obsidian-card p-8 rounded-[2.5rem] border-white/5 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[80px] rounded-full group-hover:bg-cyan-500/10 transition-all duration-1000"></div>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
          <h3 className="text-[10px] font-black mono text-slate-300 tracking-[0.4em] uppercase">Stack_Matrix.db</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {SKILLS.map((cat, i) => (
            <div key={i} className="relative">
              <p className="text-[8px] mono text-slate-600 font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-4">
                {cat.category}
                <span className="h-px flex-1 bg-white/5"></span>
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((s, si) => (
                  <span key={si} className="px-3 py-1.5 obsidian-card rounded-xl text-[9px] mono text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-default font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
