/**
 * MatrixRain — subtle canvas "matrix" cascade behind the page.
 *
 * Performance:
 *  - throttled to ~14fps (STEP=70ms) — cheap on weak GPUs
 *  - DPR capped at 2× to avoid huge buffers on retina screens
 *  - bails out entirely when prefers-reduced-motion is set
 *
 * Props:
 *  - color      stroke color for glyphs (rgba/hex)
 *  - intensity  0..1 — canvas opacity (kept low so it sits behind content)
 *  - fontSize   px size of glyphs
 */
import React, { useEffect, useRef } from 'react';

interface Props {
    color?: string;
    intensity?: number;
    fontSize?: number;
}

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01<>{}[]/=*!?$#@01ABCDEF';

const MatrixRain: React.FC<Props> = ({ color = 'rgba(54,249,179,0.55)', intensity = 0.05, fontSize = 14 }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let columns = 0;
        let drops: number[] = [];

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            columns = Math.floor(width / fontSize);
            drops = Array(columns).fill(0).map(() => Math.random() * (height / fontSize));
        };
        resize();
        window.addEventListener('resize', resize);

        let last = 0;
        const STEP = 70; // ms per frame — slow, smooth, low-cost

        const draw = (now: number) => {
            if (now - last >= STEP) {
                last = now;
                ctx.fillStyle = `rgba(5,5,7,${0.18})`;
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = color;
                ctx.font = `${fontSize}px JetBrains Mono, ui-monospace, monospace`;
                for (let i = 0; i < drops.length; i++) {
                    const ch = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;
                    ctx.fillText(ch, x, y);
                    if (y > height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                }
            }
            rafRef.current = requestAnimationFrame(draw);
        };
        rafRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [color, fontSize]);

    return (
        <canvas
            ref={ref}
            aria-hidden
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0, opacity: intensity, mixBlendMode: 'screen' }}
        />
    );
};

export default MatrixRain;
