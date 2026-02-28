import React from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS, RAJESH_DATA } from '../constants';

const ProjectGallery: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-4 sm:p-6 pb-12">
      {PROJECTS.map((project) => (
        <Link
          key={project.id}
          to={`/project/${project.id}`}
          className="group relative block"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0c] aspect-video mb-8 border border-white/5 group-hover:border-white/20 transition-all duration-700 shadow-2xl overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-30 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-40"></div>

            <div className="absolute top-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 hover:bg-white hover:text-black text-white hover:scale-110 transition-all z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <div className="absolute bottom-8 left-8 flex flex-wrap gap-3">
              {project.tags.map((tag, i) => (
                <span key={i} className="text-[9px] px-3 py-1.5 bg-white/5 backdrop-blur-xl rounded-lg text-white mono border border-white/10 font-black uppercase tracking-[0.2em]">{tag}</span>
              ))}
            </div>
          </div>
          <div className="px-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
              <h4 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tighter uppercase leading-none">{project.title}</h4>
            </div>
            <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed font-medium pl-4">{project.description}</p>
          </div>
        </Link>
      ))}
      <a
        href={RAJESH_DATA.socials.github}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center obsidian-card rounded-[2.5rem] border-dashed border-2 border-white/5 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer group aspect-video md:aspect-auto min-h-[400px]"
      >
        <div className="text-center p-12">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all shadow-2xl border border-white/5">
            <span className="text-4xl font-light">+</span>
          </div>
          <p className="text-xs mono text-slate-500 group-hover:text-white uppercase tracking-[0.5em] font-black transition-colors">See_All_Deployments</p>
        </div>
      </a>
    </div>
  );
};

export default ProjectGallery;
