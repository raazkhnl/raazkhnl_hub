
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
    <div className="obsidian-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-[100px] rounded-full"></div>
      <h3 className="mono text-[10px] font-black mb-12 text-slate-200 uppercase tracking-[0.4em] flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></span>
        Establish_Link
      </h3>
      <form onSubmit={handleSubmit} className="space-y-8">
        <input type="hidden" name="from_name" value="RaaZ Portfolio Hub" />
        <div className="grid grid-cols-1 gap-8">
          <div className="group/field">
            <label className="block text-[8px] mono text-slate-600 font-black uppercase mb-3 tracking-[0.4em] group-focus-within/field:text-white transition-colors">Identifier</label>
            <input
              name="name"
              required
              placeholder="Name or Alias"
              className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 py-4.5 text-[11px] focus:border-white/20 outline-none transition-all placeholder:text-slate-800 hover:border-white/10 text-white"
            />
          </div>
          <div className="group/field">
            <label className="block text-[8px] mono text-slate-600 font-black uppercase mb-3 tracking-[0.4em] group-focus-within/field:text-white transition-colors">Channel (Email)</label>
            <input
              type="email"
              name="email"
              required
              placeholder="user@domain.xyz"
              className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 py-4.5 text-[11px] focus:border-white/20 outline-none transition-all placeholder:text-slate-800 hover:border-white/10 text-white"
            />
          </div>
        </div>
        <div className="group/field">
          <label className="block text-[8px] mono text-slate-600 font-black uppercase mb-3 tracking-[0.4em] group-focus-within/field:text-white transition-colors">Data_Payload</label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Initialize conversation sequence..."
            className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 py-4.5 text-[11px] focus:border-white/20 outline-none transition-all resize-none placeholder:text-slate-800 hover:border-white/10 text-white min-h-[160px]"
          ></textarea>
        </div>
        <button
          disabled={loading}
          className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-slate-200 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-4 shadow-2xl text-[10px] uppercase tracking-[0.6em]"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
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
