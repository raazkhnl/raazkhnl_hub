import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROJECTS, RAJESH_DATA } from '../constants';

const ProjectDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);

    const project = PROJECTS.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030303] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                    <span className="mono text-[11px] text-cyan-500 tracking-[0.5em] animate-pulse">FETCHING_DATA</span>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-black mb-4">404 // NOT_FOUND</h1>
                <p className="text-slate-400 mb-8 mono uppercase tracking-widest">The requested project module does not exist.</p>
                <Link to="/" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-black text-[15px] uppercase tracking-widest">
                    Return_To_Hub
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030303] text-slate-200 selection:bg-cyan-500/30 font-sans pb-32">
            {/* Dynamic Header */}
            <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-5xl transition-all duration-500 opacity-90 backdrop-blur-3xl bg-black/60 border border-white/10 rounded-2xl h-14 shadow-lg shadow-cyan-900/10">
                <div className="flex items-center justify-between px-6 h-full">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-all">
                            <svg className="w-4 h-4 translate-x-[-1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white group-hover:text-cyan-400 transition-colors">Return_Hub</span>
                    </Link>
                    <div className="mono text-[10px] flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 bg-cyan-400 rounded-full glow-dot"></div>
                            <span className="text-slate-500 font-bold tracking-widest uppercase">Project_Module</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 px-4 sm:px-8 max-w-5xl mx-auto">
                {/* Banner Section */}
                <div className="relative rounded-[3rem] overflow-hidden aspect-[21/9] mb-12 border border-white/10 shadow-2xl">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-[#030303]/40 to-transparent"></div>

                    <div className="absolute bottom-10 left-10">
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
                            {project.title}
                        </h1>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 obsidian-card p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-black select-none pointer-events-none">
                            {'{}'}
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
                            <h2 className="mono text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Overview</h2>
                        </div>
                        <p className="text-lg text-slate-300 leading-relaxed font-normal">
                            {project.description}
                        </p>

                        <div className="mt-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-1 h-4 bg-white/20 rounded-full"></div>
                                <h2 className="mono text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Tech_Stack</h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[11px] mono text-cyan-50 font-black uppercase tracking-widest shadow-lg shadow-black/50">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        <div className="obsidian-card p-8 rounded-[2rem] border-white/5 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <h3 className="mono text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Repository</h3>
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[15px] font-black text-cyan-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
                            >
                                View Source <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        </div>

                        <div className="obsidian-card p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:border-cyan-500/30 transition-all cursor-pointer" onClick={() => window.open(RAJESH_DATA.socials.github, '_blank')}>
                            <div className="absolute -right-4 -bottom-4 text-7xl opacity-[0.03] font-black group-hover:text-cyan-500 transition-colors duration-500">GH</div>
                            <h3 className="mono text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Origin</h3>
                            <p className="text-[15px] font-black text-white hover:text-cyan-400 uppercase tracking-widest">
                                @raazkhnl / Github
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetails;
