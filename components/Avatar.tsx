/**
 * Avatar — small, elegant floating profile picture for the hero.
 *
 * Minimalist: rounded image inside a gradient-stroked ring, with a subtle
 * pulsing presence dot, soft float, and a parallax tilt that follows the
 * cursor. All transforms are GPU-only; honors prefers-reduced-motion.
 */
import React, { useRef } from "react";

interface Props {
	src?: string;
	alt?: string;
	sizeClass?: string;
	label?: string;
}

const Avatar: React.FC<Props> = ({
	src = `${import.meta.env.BASE_URL}raazkhnl.png`,
	alt = "Rajesh Khanal - raazkhnl (avatar)",
	sizeClass = "w-16 h-16 sm:w-20 sm:h-20",
	label = "@raazkhnl",
}) => {
	const wrapRef = useRef<HTMLDivElement>(null);

	const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const el = wrapRef.current;
		if (!el) return;
		if (window.matchMedia("(pointer: coarse)").matches) return;
		const rect = el.getBoundingClientRect();
		const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
		const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
		el.style.setProperty("--tilt-x", `${y * -8}deg`);
		el.style.setProperty("--tilt-y", `${x * 8}deg`);
	};
	const reset = () => {
		const el = wrapRef.current;
		if (!el) return;
		el.style.setProperty("--tilt-x", "0deg");
		el.style.setProperty("--tilt-y", "0deg");
	};

	return (
		<div
			ref={wrapRef}
			onPointerMove={onMove}
			onPointerLeave={reset}
			className="float-avatar group relative inline-block"
			style={{ perspective: "600px" }}
			aria-label={label}
			title={label}
		>
			<div
				className={`${sizeClass} relative rounded-full p-[2px]`}
				style={{
					background:
						"conic-gradient(from 140deg, #36f9b3, #38bdf8, #ff3d8b, #36f9b3)",
					transform:
						"rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
					transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)",
					willChange: "transform",
				}}
			>
				<img
					src={src}
					alt={alt}
					width={80}
					height={80}
					loading="eager"
					decoding="async"
					className="w-full h-full rounded-full object-cover bg-[#0a0a0d]"
					style={{ boxShadow: "0 12px 40px -12px rgba(54,249,179,0.35)" }}
				/>
				<span
					aria-hidden
					className="absolute -bottom-0.5 -right-0.5 block w-3 h-3 rounded-full ring-2 ring-[#050507]"
					style={{
						background: "linear-gradient(135deg, #36f9b3, #38bdf8)",
						boxShadow: "0 0 10px rgba(54, 249, 179, 0.7)",
					}}
				/>
			</div>
		</div>
	);
};

export default Avatar;
