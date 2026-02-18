
import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "c9115b88-1763-4903-b054-97274640196c"); 

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setStatus('LINK_STABLISHED: DATA_SYNCED');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('HANDSHAKE_ERROR: TRY_AGAIN');
      }
    } catch (err) {
      setStatus('OFFLINE_PROTOCOL: FAIL');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 6000);
    }
  };

  return (
    <div className="obsidian-panel p-8 sm:p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group premium-glow">
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl"></div>
      <h3 className="mono text-xs font-black mb-10 text-cyan-400 uppercase tracking-[0.4em] flex items-center gap-3">
        <span className="w-3 h-3 rounded-sm bg-cyan-500 animate-pulse"></span>
        Establish_Link
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="from_name" value="RaaZ Portfolio Hub" />
        <div className="grid grid-cols-1 gap-6">
          <div className="group/field">
            <label className="block text-[8px] mono text-slate-600 font-black uppercase mb-2 tracking-[0.3em] group-focus-within/field:text-cyan-400 transition-colors">Identifier</label>
            <input 
              name="name" 
              required 
              placeholder="Name or Alias"
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs focus:border-cyan-500 outline-none transition-all placeholder:text-slate-800 hover:border-white/10"
            />
          </div>
          <div className="group/field">
            <label className="block text-[8px] mono text-slate-600 font-black uppercase mb-2 tracking-[0.3em] group-focus-within/field:text-cyan-400 transition-colors">Channel (Email)</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="user@domain.xyz"
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs focus:border-cyan-500 outline-none transition-all placeholder:text-slate-800 hover:border-white/10"
            />
          </div>
        </div>
        <div className="group/field">
          <label className="block text-[8px] mono text-slate-600 font-black uppercase mb-2 tracking-[0.3em] group-focus-within/field:text-cyan-400 transition-colors">Data_Payload</label>
          <textarea 
            name="message" 
            required 
            rows={4}
            placeholder="Initialize conversation sequence..."
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs focus:border-cyan-500 outline-none transition-all resize-none placeholder:text-slate-800 hover:border-white/10 min-h-[140px]"
          ></textarea>
        </div>
        <button 
          disabled={loading}
          className="w-full py-4 bg-cyan-500 text-slate-950 font-black rounded-2xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/20 text-[10px] uppercase tracking-[0.5em]"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
          ) : 'Transmit_Data'}
        </button>
        {status && (
          <div className={`text-center py-3 rounded-xl mono text-[8px] font-black border tracking-widest ${status.includes('LINK') ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' : 'text-red-400 border-red-500/20 bg-red-500/5'}`}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
