/**
 * MagneticButton — translates slightly toward the cursor for a tactile feel.
 * Disabled on coarse pointers (touch). Renders <button> by default; pass
 * `as="a"` with `href` to render an anchor.
 */
import React, { useRef } from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    strength?: number;
    as?: 'button' | 'a';
    href?: string;
    target?: string;
    rel?: string;
}

const MagneticButton: React.FC<Props> = ({
    strength = 14,
    className = '',
    children,
    as = 'button',
    href,
    target,
    rel,
    onClick,
    ...rest
}) => {
    const ref = useRef<HTMLElement>(null);

    const handle = (e: React.PointerEvent) => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate3d(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px, 0)`;
    };
    const reset = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = 'translate3d(0,0,0)';
    };

    if (as === 'a') {
        return (
            <a
                ref={ref as never}
                href={href}
                target={target}
                rel={rel}
                onPointerMove={handle}
                onPointerLeave={reset}
                className={className}
                style={{ transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            ref={ref as never}
            onPointerMove={handle}
            onPointerLeave={reset}
            onClick={onClick}
            className={className}
            style={{ transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            {...rest}
        >
            {children}
        </button>
    );
};

export default MagneticButton;
