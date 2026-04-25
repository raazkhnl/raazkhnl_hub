/**
 * ContactForm — web3forms-backed contact card.
 * Submits firstName · lastName · email · phone · message to web3forms and shows inline status.
 * Replace `access_key` with your own to use this in another project.
 *
 * Field shape mirrors the user's verified-working web3forms request so the
 * configured access key receives the same payload the dashboard expects.
 */
import React, { useState } from 'react';
import GlowCard from './GlowCard';
import MagneticButton from './MagneticButton';

const ACCESS_KEY = 'a85833d1-1e17-4e4f-b717-33712b7c1d19';

const ContactForm: React.FC = () => {
    const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'err'; msg: string }>({ kind: 'idle', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        setLoading(true);
        const formData = new FormData(form);
        formData.append('access_key', ACCESS_KEY);

        try {
            const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                setStatus({ kind: 'ok', msg: "message sent — i'll get back soon ✦" });
                form.reset();
            } else {
                setStatus({ kind: 'err', msg: data.message || 'something went sideways. try again?' });
            }
        } catch {
            setStatus({ kind: 'err', msg: 'offline · check your connection' });
        } finally {
            setLoading(false);
            setTimeout(() => setStatus({ kind: 'idle', msg: '' }), 6000);
        }
    };

    return (
        <GlowCard className="glass rounded-[28px] p-7 sm:p-9 relative overflow-hidden h-full">
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-30 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(closest-side, rgba(255,61,139,0.55), transparent)' }} />

            <span className="eyebrow">04 · contact</span>
            <h3 className="display mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
                drop a <span className="text-grad-pink">message</span>
            </h3>
            <p className="mono text-[11px] text-slate-400 mt-2">
                or just say hi at{' '}
                <a className="hover:text-white" style={{ color: '#f9a8d4' }} href="mailto:raazkhnl@gmail.com">
                    raazkhnl@gmail.com
                </a>
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5 relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field name="firstName" label="first name" placeholder="riya" />
                    <Field name="lastName" label="last name" placeholder="khanal" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field name="email" label="email" type="email" placeholder="you@something.xyz" />
                    <Field name="phone" label="phone" type="tel" placeholder="+977-9800000000" required={false} />
                </div>
                <Field name="message" label="what's on your mind" placeholder="tell me about your idea, project, or just vibe..." textarea />

                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <MagneticButton type="submit" disabled={loading} className="btn-primary min-w-[170px] disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                                sending...
                            </>
                        ) : (
                            <>
                                send it
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                                </svg>
                            </>
                        )}
                    </MagneticButton>

                    {status.kind !== 'idle' && (
                        <div
                            className={`mono text-[11px] px-3 py-2 rounded-lg border ${
                                status.kind === 'ok'
                                    ? 'border-emerald-400/30 bg-emerald-400/5'
                                    : 'border-rose-400/30 bg-rose-400/5'
                            }`}
                            style={{ color: status.kind === 'ok' ? '#6ee7b7' : '#fda4af' }}
                        >
                            {status.msg}
                        </div>
                    )}
                </div>
            </form>
        </GlowCard>
    );
};

interface FieldProps {
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
    textarea?: boolean;
    required?: boolean;
}

const Field: React.FC<FieldProps> = ({ name, label, placeholder, type = 'text', textarea, required = true }) => {
    const base =
        'w-full bg-black/30 border border-white/8 rounded-2xl px-4 py-3.5 text-[13.5px] text-white ' +
        'placeholder:text-slate-600 outline-none transition focus:bg-black/40 hover:border-white/15';
    return (
        <label className="block group">
            <span className="mono text-[10px] text-slate-400 mb-2 block group-focus-within:text-white transition">
                {label}{!required && <span className="text-slate-600"> · optional</span>}
            </span>
            {textarea ? (
                <textarea
                    name={name} required={required} rows={4} placeholder={placeholder}
                    className={`${base} resize-none min-h-[140px]`}
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(54,249,179,0.5)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
            ) : (
                <input
                    name={name} type={type} required={required} placeholder={placeholder}
                    className={base}
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(54,249,179,0.5)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
            )}
        </label>
    );
};

export default ContactForm;
