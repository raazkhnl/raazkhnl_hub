
import React, { useState, useEffect, useRef } from 'react';
import { RAJESH_DATA, EXPERIENCES, PROJECTS } from './constants';
import Terminal from './components/Terminal';
import BentoGrid from './components/BentoGrid';
import ProjectGallery from './components/ProjectGallery';
import ContactForm from './components/ContactForm';
import { askRajeshAI } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  const [battery, setBattery] = useState<string>("100%");
  const [latency, setLatency] = useState<number>(24);

  const contactRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    const clock = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((bat: any) => {
        setBattery(`${Math.round(bat.level * 100)}%`);
      });
    }

    setTerminalOutput([
      "Neural_Deck // Connection Established.",
      "Identifier: RaaZ Khanal // Pulchowk Campus",
      "Module_Load: Successful.",
      "Ask RaaZ-GPT anything about my career."
    ]);

    return () => {
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, []);

  const handleCommand = async (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    let newOutput = [...terminalOutput, `> ${cmd}`];

    if (command.startsWith('ask ')) {
      const question = cmd.substring(4);
      setIsAiThinking(true);
      newOutput.push(`[SYS]: Interrogating Neural Path...`);
      setTerminalOutput([...newOutput]);
      const answer = await askRajeshAI(question);
      setIsAiThinking(false);
      setTerminalOutput(prev => [...prev, `[AI]: ${answer}`]);
      return;
    }

    switch (command) {
      case 'help':
        newOutput.push("PROTOCOLS: about, registry, projects, contact, clear, ask <q>");
        break;
      case 'clear': setTerminalOutput(["System Reset."]); return;
      case 'projects': projectsRef.current?.scrollIntoView({ behavior: 'smooth' }); break;
      case 'contact': contactRef.current?.scrollIntoView({ behavior: 'smooth' }); break;
      default: newOutput.push(`ERR: Unrecognized command.`);
    }
    setTerminalOutput(newOutput);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#030303] z-[999] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <span className="mono text-[10px] text-cyan-500 tracking-[0.5em] animate-pulse">INIT_HUB</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200 selection:bg-cyan-500/30">
      
      {/* Floating Neural Deck (Header) */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-4xl hud-float">
        <div className="obsidian-card rounded-2xl h-14 flex items-center justify-between px-6 border-cyan-500/10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-black text-[10px]">RK</div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-black tracking-tight leading-none uppercase">Neural Hub</span>
              <span className="text-[7px] mono text-cyan-500/50 font-bold uppercase tracking-widest mt-0.5">RaaZ.Khanal.os</span>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 mono text-[10px] font-black text-slate-500">
              <button onClick={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors uppercase tracking-widest">Deployments</button>
              <button onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-cyan-400 transition-colors uppercase tracking-widest">Bridge</button>
            </div>
            <div className="h-6 w-px bg-white/5 mx-2"></div>
            <div className="mono text-[9px] flex items-center gap-3">
              <span className="text-cyan-400 font-bold">{currentTime}</span>
              <div className="flex items-center gap-1.5 opacity-60">
                <div className="w-1 h-1 bg-cyan-400 rounded-full glow-dot"></div>
                <span className="hidden xs:inline">STABLE</span>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-32 pb-32 px-4 sm:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Control Bar */}
        <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-32 h-fit">
          <section className="obsidian-card p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-4xl select-none">RAAZ</div>
            
            <div className="mb-10">
              <h1 className="text-7xl font-black tracking-tighter leading-[0.85] mb-4">
                RaaZ<br/><span className="text-cyan-400">KHANAL</span>
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-[2px] w-6 bg-cyan-400 rounded-full"></div>
                <p className="text-[10px] mono text-slate-500 font-bold uppercase tracking-[0.2em]">Computer Engineer / Full-Stack</p>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium opacity-80 italic">
                Architecting intelligent systems from the heart of Nepal. Graduated IOE Pulchowk '24.
              </p>
            </div>

            {/* Social Bridge */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {[
                { icon: 'GH', link: RAJESH_DATA.socials.github, color: 'hover:text-white' },
                { icon: 'LI', link: RAJESH_DATA.socials.linkedin, color: 'hover:text-blue-400' },
                { icon: 'IG', link: 'https://instagram.com/raazkhnl', color: 'hover:text-pink-400' },
                { icon: 'BL', link: RAJESH_DATA.socials.website, color: 'hover:text-cyan-400' }
              ].map(soc => (
                <a key={soc.icon} href={soc.link} target="_blank" rel="noreferrer" 
                   className={`h-10 obsidian-card flex items-center justify-center rounded-xl mono text-[10px] font-black transition-all ${soc.color} hover:bg-white/5`}>
                  {soc.icon}
                </a>
              ))}
            </div>

            <button 
              onClick={() => window.open(RAJESH_DATA.socials.website)}
              className="w-full py-4 bg-cyan-500 text-black font-black text-[10px] rounded-2xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-[0.3em] shadow-lg shadow-cyan-500/20"
            >
              Access_Resume_PDF
            </button>
          </section>

          <Terminal onCommand={handleCommand} output={terminalOutput} />
          {isAiThinking && <div className="h-0.5 bg-cyan-500/30 animate-pulse mx-4"></div>}
        </aside>

        {/* Dynamic Content Stream */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Section 01: Capabilities */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1 h-3 bg-cyan-500 rounded-full"></div>
              <h2 className="mono text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">01_Neural_Matrix</h2>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>
            <BentoGrid />
          </section>

          {/* Section 02: Deployments */}
          <section ref={projectsRef} className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1 h-3 bg-cyan-500 rounded-full"></div>
              <h2 className="mono text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">02_Live_Deployments</h2>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>
            <div className="obsidian-card p-2 sm:p-4 rounded-[3rem]">
               <ProjectGallery />
            </div>
          </section>

          {/* Section 03: Registry & Bridge */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="obsidian-card p-10 rounded-[2.5rem] flex flex-col h-full">
               <h3 className="mono text-[10px] font-black text-cyan-400 mb-10 uppercase tracking-[0.4em] flex items-center gap-3">
                 <div className="w-2 h-2 rounded bg-cyan-500 glow-dot"></div>Registry.log
               </h3>
               <div className="space-y-10 flex-1">
                 {EXPERIENCES.map((exp, i) => (
                   <div key={i} className="group relative pl-8 border-l border-white/5">
                     <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/10 group-hover:bg-cyan-500 group-hover:border-cyan-400 transition-all"></div>
                     <span className="text-[8px] mono text-slate-600 font-black mb-1 block">{exp.period}</span>
                     <h4 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors uppercase">{exp.role}</h4>
                     <p className="text-[10px] text-cyan-400/50 mono font-bold mb-3">{exp.company}</p>
                     <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{exp.description}</p>
                   </div>
                 ))}
               </div>
            </div>
            
            <div ref={contactRef} className="scroll-mt-32">
              <ContactForm />
            </div>
          </section>

        </div>
      </main>

      {/* System Status Ticker (Responsive Footer) */}
      <footer className="fixed bottom-0 left-0 w-full z-50 obsidian-card border-t border-white/5 backdrop-blur-3xl">
        <div className="flex items-center h-10 sm:h-12 overflow-hidden relative">
          <div className="bg-cyan-500 text-black px-4 sm:px-6 h-full flex items-center mono text-[9px] font-black z-20 shadow-[8px_0_12px_rgba(0,0,0,0.5)] whitespace-nowrap">STATUS_LIVE</div>
          <div className="flex whitespace-nowrap animate-[marquee_50s_linear_infinite] mono text-[8px] text-slate-600 gap-20 items-center px-10">
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500/50 rounded-full"></div> IDENTITY: RAAZ_KHANAL_COMPUTER_ENGINEER</span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500/50 rounded-full"></div> NODE: KTM_IOE_PULCHOWK</span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500/50 rounded-full"></div> PWR: {battery}</span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500/50 rounded-full"></div> LATENCY: {latency}MS</span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500/50 rounded-full"></div> SKILLS: REACT_PYTHON_ML_AWS_IOT_NLP_EXPRESS</span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-cyan-500/50 rounded-full"></div> IDENTITY: RAAZ_KHANAL_COMPUTER_ENGINEER</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 480px) {
          .marquee { animation-duration: 30s; }
        }
      `}</style>
    </div>
  );
};

export default App;
