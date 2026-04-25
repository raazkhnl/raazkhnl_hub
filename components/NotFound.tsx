/**
 * NotFound — fallback route view (404), with matrix rain backdrop.
 * Provides "return home" + "go back" actions.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import MatrixRain from './MatrixRain';

const NotFound: React.FC = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <div className="stage" />
            <MatrixRain intensity={0.08} />
            <div className="scanlines" />

            <div className="relative z-10">
                <div className="mono text-[11px] tracking-[0.4em] uppercase mb-4" style={{ color: '#36f9b3' }}>
                    error · 0x0404
                </div>
                <div className="display text-[110px] sm:text-[180px] font-black leading-none tracking-tighter">
                    <span className="text-grad-mint">4</span>
                    <span className="text-grad-pink">0</span>
                    <span className="text-grad-mint">4</span>
                </div>
                <p className="mt-6 max-w-md mx-auto mono text-[13px] text-slate-400 leading-relaxed">
                    the route you're looking for doesn't exist in this dimension.<br />
                    try retracing your path.
                </p>
                <div className="mt-10 flex items-center justify-center gap-3">
                    <Link to="/" className="btn-primary">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l6-6m-6 6l6 6" />
                        </svg>
                        return home
                    </Link>
                    <button onClick={() => history.back()} className="btn-ghost">go back</button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
