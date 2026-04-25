/**
 * Reveal — fade-up wrapper driven by IntersectionObserver.
 * Sets `data-reveal="in"` once the element enters the viewport (one-shot),
 * paired with the `[data-reveal]` CSS rule in src/index.css.
 */
import React, { useEffect, useRef } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    delay?: number;
    as?: keyof React.JSX.IntrinsicElements;
}

const Reveal: React.FC<Props> = ({ delay = 0, as = 'div', style, children, ...rest }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        el.setAttribute('data-reveal', 'in');
                        io.unobserve(el);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const Tag = as as 'div';
    return (
        <Tag
            ref={ref as never}
            data-reveal=""
            style={{ transitionDelay: `${delay}ms`, ...style }}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
