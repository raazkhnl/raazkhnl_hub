/**
 * GlowCard — wraps any element with a cursor-tracking radial-glow halo.
 * On pointer-move, sets `--mx` and `--my` (0..100) so the .glow-card CSS
 * rule positions the glow under the cursor.
 */
import React, { useRef } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const GlowCard: React.FC<Props> = ({ className = '', onPointerMove, children, ...rest }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handle = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', `${x}`);
        el.style.setProperty('--my', `${y}`);
        onPointerMove?.(e);
    };

    return (
        <div ref={ref} onPointerMove={handle} className={`glow-card ${className}`} {...rest}>
            {children}
        </div>
    );
};

export default GlowCard;
