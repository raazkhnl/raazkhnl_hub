/**
 * Typewriter — cycles through a list of phrases, typing then deleting each in turn.
 *
 * Honors `prefers-reduced-motion`: when set, renders the first phrase statically
 * with no animation. Cleans up its timer on unmount and on phase change.
 */
import React, { useEffect, useState } from 'react';

interface Props {
    words: string[];
    /** ms per char while typing (deleting is half this) */
    speed?: number;
    /** ms to hold a fully-typed word before deleting */
    pause?: number;
    className?: string;
}

const Typewriter: React.FC<Props> = ({ words, speed = 60, pause = 1700, className = '' }) => {
    const [text, setText] = useState('');
    const [wIdx, setWIdx] = useState(0);
    const [phase, setPhase] = useState<'typing' | 'deleting'>('typing');
    const [reduced] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    useEffect(() => {
        if (reduced) return;
        const word = words[wIdx] ?? '';
        let timer: number | undefined;

        if (phase === 'typing') {
            if (text.length < word.length) {
                timer = window.setTimeout(() => setText(word.slice(0, text.length + 1)), speed);
            } else {
                timer = window.setTimeout(() => setPhase('deleting'), pause);
            }
        } else {
            if (text.length > 0) {
                timer = window.setTimeout(() => setText(text.slice(0, -1)), Math.max(20, speed / 2));
            } else {
                setWIdx((i) => (i + 1) % words.length);
                setPhase('typing');
            }
        }

        return () => { if (timer) window.clearTimeout(timer); };
    }, [text, wIdx, phase, words, speed, pause, reduced]);

    if (reduced) {
        return <span className={className}>{words[0] ?? ''}</span>;
    }

    return (
        <span className={`inline-block ${className}`}>
            {text || ' '}
        </span>
    );
};

export default Typewriter;
