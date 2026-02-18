
import React from 'react';
import { PROJECTS } from '../constants';

const ProjectGallery: React.FC = () => {
  return (
    <div className="flex overflow-x-auto gap-8 pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth">
      {PROJECTS.map((project) => (
        <div key={project.id} className="min-w-[300px] sm:min-w-[420px] group snap-center relative">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 aspect-video mb-6 border border-white/5 group-hover:border-cyan-500/30 transition-all duration-700 shadow-2xl">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700"></div>
            
            <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
               <div className="w-10 h-10 rounded-2xl obsidian-panel flex items-center justify-center border border-white/10 hover:border-cyan-400 transition-colors">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
               </div>
            </div>

            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
               {project.tags.slice(0, 3).map((tag, i) => (
                 <span key={i} className="text-[8px] px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-cyan-300 mono border border-white/5 font-bold uppercase tracking-widest">{tag}</span>
               ))}
            </div>
          </div>
          <div className="px-4">
            <h4 className="text-lg font-black group-hover:text-cyan-400 transition-colors tracking-tighter uppercase">{project.title}</h4>
            <p className="text-slate-500 text-[11px] mt-2 line-clamp-2 leading-relaxed font-medium">{project.description}</p>
          </div>
        </div>
      ))}
      <div className="min-w-[300px] sm:min-w-[420px] flex items-center justify-center obsidian-panel rounded-[2rem] border-dashed border-2 border-white/5 hover:border-cyan-500/30 hover:bg-white/5 transition-all cursor-pointer group snap-center">
         <div className="text-center p-8">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
              <span className="text-3xl text-slate-700 group-hover:text-cyan-400">+</span>
            </div>
            <p className="text-[10px] mono text-slate-500 group-hover:text-cyan-400 uppercase tracking-[0.4em] font-black">View_All</p>
         </div>
      </div>
    </div>
  );
};

export default ProjectGallery;
