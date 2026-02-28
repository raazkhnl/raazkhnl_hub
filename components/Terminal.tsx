
import React, { useState, useRef, useEffect } from 'react';

interface TerminalProps {
  onCommand: (cmd: string) => void;
  output: string[];
}

const Terminal: React.FC<TerminalProps> = ({ onCommand, output }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand(input.trim());
    setInput('');
  };

  return (
    <div className="obsidian-card rounded-[2rem] overflow-hidden border-white/5 flex flex-col h-[340px] relative group">
      <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-20"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-20"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-20"></div>
        </div>
        <span className="text-[9px] mono text-slate-500 font-black tracking-[0.4em] uppercase">Neural_Deck_Interface.sh</span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto mono text-[11px] leading-relaxed no-scrollbar relative z-10 scroll-smooth">
        {output.map((line, i) => (
          <div key={i} className="mb-2 flex gap-4 opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-cyan-500/40 font-black">{i.toString().padStart(2, '0')}</span>
            <span className="text-slate-400 transition-colors">{line}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 bg-white/5 border-t border-white/5 flex items-center relative z-10 group/input">
        <span className="text-white mono mr-3 font-black animate-pulse opacity-40">_</span>
        <input

          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Initiate Command Sequence..."
          className="bg-transparent border-none outline-none flex-1 mono text-white placeholder:text-slate-800 text-[11px] uppercase font-black"
        />
        <div className="text-[8px] mono text-slate-600 font-black uppercase tracking-tighter">SECURE_SHELL.v3</div>
      </form>
    </div>
  );
};

export default Terminal;
