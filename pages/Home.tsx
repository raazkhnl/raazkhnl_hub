/**
 * Home — landing page composition.
 *
 * Owns:
 *  - boot screen
 *  - top nav with seconds-resolution clock
 *  - hero (chips · headline · stats · CTAs)
 *  - socials grid + Terminal (right column)
 *  - stack · work · timeline · contact sections
 *  - persisted accent + matrix-rain preferences (localStorage)
 *  - keyboard shortcuts: g h / g s / g w / g c
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RAAZKHNL, EXPERIENCES } from "../constants";
import Terminal from "../components/Terminal";
import BentoGrid from "../components/BentoGrid";
import ProjectGallery from "../components/ProjectGallery";
import ContactForm from "../components/ContactForm";
import MatrixRain from "../components/MatrixRain";
import Reveal from "../components/Reveal";
import GlowCard from "../components/GlowCard";
import MagneticButton from "../components/MagneticButton";
import Typewriter from "../components/Typewriter";
import Avatar from "../components/Avatar";

const HERO_PHRASES = [
	"systems for people",
	"tools that vibe",
	"tax tech for nepal",
	"interfaces that ship",
	"things that just work",
];

type Accent = "mint" | "pink" | "amber" | "iris";

const ACCENT_HEX: Record<Accent, string> = {
	mint: "#36f9b3",
	pink: "#ff3d8b",
	amber: "#fbbf24",
	iris: "#8b5cf6",
};

const ACCENT_KEY = "raazkhnl.accent.v1";
const MATRIX_KEY = "raazkhnl.matrix.v1";
const BOOTED_KEY = "raazkhnl.booted";

const Home: React.FC = () => {
	const [boot, setBoot] = useState(() => {
		try {
			return sessionStorage.getItem(BOOTED_KEY) !== "1";
		} catch {
			return true;
		}
	});
	const [now, setNow] = useState(() => new Date());
	const [scrolled, setScrolled] = useState(false);
	const [accent, setAccent] = useState<Accent>(() => {
		try {
			const v = localStorage.getItem(ACCENT_KEY);
			if (v && ["mint", "pink", "amber", "iris"].includes(v))
				return v as Accent;
		} catch {
			/* ignore */
		}
		return "mint";
	});
	const [matrixOn, setMatrixOn] = useState<boolean>(() => {
		try {
			const v = localStorage.getItem(MATRIX_KEY);
			if (v === "0") return false;
		} catch {
			/* ignore */
		}
		return true;
	});
	const [emailCopied, setEmailCopied] = useState(false);

	const heroRef = useRef<HTMLElement>(null);
	const stackRef = useRef<HTMLElement>(null);
	const workRef = useRef<HTMLElement>(null);
	const contactRef = useRef<HTMLElement>(null);

	/* clock — tick every second so the nav shows seconds */
	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(id);
	}, []);

	/* scroll listener (passive) + boot timer (only when actually booting) */
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		window.addEventListener("scroll", onScroll, { passive: true });
		let t: number | undefined;
		if (boot) {
			t = window.setTimeout(() => {
				setBoot(false);
				try {
					sessionStorage.setItem(BOOTED_KEY, "1");
				} catch {
					/* ignore */
				}
			}, 600);
		}
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (t) clearTimeout(t);
		};
	}, [boot]);

	/* persist & apply accent */
	useEffect(() => {
		document.documentElement.style.setProperty("--accent", ACCENT_HEX[accent]);
		try {
			localStorage.setItem(ACCENT_KEY, accent);
		} catch {
			/* ignore */
		}
	}, [accent]);

	/* persist matrix preference */
	useEffect(() => {
		try {
			localStorage.setItem(MATRIX_KEY, matrixOn ? "1" : "0");
		} catch {
			/* ignore */
		}
	}, [matrixOn]);

	/* keyboard shortcuts: g h / g s / g w / g c */
	useEffect(() => {
		let buffer = "";
		let timer: number | null = null;
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
			buffer += e.key.toLowerCase();
			if (timer) window.clearTimeout(timer);
			timer = window.setTimeout(() => (buffer = ""), 700);
			if (buffer.endsWith("gh"))
				heroRef.current?.scrollIntoView({ behavior: "smooth" });
			if (buffer.endsWith("gs"))
				stackRef.current?.scrollIntoView({ behavior: "smooth" });
			if (buffer.endsWith("gw"))
				workRef.current?.scrollIntoView({ behavior: "smooth" });
			if (buffer.endsWith("gc"))
				contactRef.current?.scrollIntoView({ behavior: "smooth" });
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			if (timer) window.clearTimeout(timer);
		};
	}, []);

	const copyEmail = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(RAAZKHNL.socials.email);
			setEmailCopied(true);
			setTimeout(() => setEmailCopied(false), 1600);
		} catch {
			/* ignore */
		}
	}, []);

	const hh = String(now.getHours()).padStart(2, "0");
	const mm = String(now.getMinutes()).padStart(2, "0");
	const ss = String(now.getSeconds()).padStart(2, "0");
	const blink = ss.charCodeAt(1) % 2 === 0;

	if (boot) {
		return (
			<div
				className="fixed inset-0 z-[999] flex items-center justify-center"
				style={{ background: "#050507" }}
			>
				<div className="stage" />
				<div className="relative flex flex-col items-center gap-4">
					<div className="relative w-12 h-12">
						<div
							className="absolute inset-0 rounded-full"
							style={{
								background:
									"conic-gradient(from 0deg, #36f9b3, #38bdf8, #ff3d8b, #36f9b3)",
								mask: "radial-gradient(circle, transparent 56%, black 57%)",
								WebkitMask:
									"radial-gradient(circle, transparent 56%, black 57%)",
								animation: "orbit 1.4s linear infinite",
							}}
						/>
					</div>
					<span
						className="mono text-[10px] tracking-[0.45em] uppercase"
						style={{ color: "#36f9b3" }}
					>
						booting
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen text-slate-200">
			<div className="stage" />
			{matrixOn && (
				<MatrixRain intensity={0.06} color={`${ACCENT_HEX[accent]}88`} />
			)}
			<div className="grain" />
			<div className="scanlines" />

			{/* top nav */}
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-500 ${
					scrolled ? "pt-3" : "pt-6"
				}`}
			>
				<div className="mx-auto px-4 sm:px-6">
					<div
						className={`mx-auto flex items-center justify-between gap-3 glass rounded-2xl pl-3 pr-3 py-2 transition-[max-width] duration-500 ${
							scrolled ? "max-w-3xl" : "max-w-5xl"
						}`}
					>
						<div className="flex items-center gap-3 pl-1">
							<div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_4px_18px_-6px_rgba(54,249,179,0.55)]">
								<img
									src={`${import.meta.env.BASE_URL}icon.png`}
									alt="raazkhnl"
									className="w-full h-full object-cover"
									draggable={false}
								/>
							</div>
							<div className="hidden sm:flex flex-col leading-tight">
								<span className="text-[12px] font-semibold text-white">
									raazkhnl
								</span>
								<span className="mono text-[9.5px] text-slate-400">
									computer engineer · np
								</span>
							</div>
						</div>

						<nav className="flex items-center gap-1">
							<NavLink id="stack" label="stack" />
							<NavLink id="work" label="work" />
							<NavLink id="contact" label="contact" alwaysShow />

							<div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
								<span className="dot" />
								<span className="mono text-[10.5px] text-slate-300 tabular-nums">
									{hh}
									<span style={{ opacity: blink ? 1 : 0.25 }}>:</span>
									{mm}
									<span style={{ opacity: blink ? 1 : 0.25 }}>:</span>
									{ss}
								</span>
							</div>
						</nav>
					</div>
				</div>
			</header>

			<main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-20">
				{/* SEO surface text — visible only to assistive tech & crawlers.*/}
				<h1 className="sr-only">
					Rajesh Khanal — Computer Engineer in Nepal · aka RaaZ Khanal. Computer
					Engineer at the Inland Revenue Department, Government of Nepal. M.E.
					Networks &amp; Cyber Security at Pulchowk Campus, Kathmandu.
					Full-stack developer building reliable, intelligent systems with
					React, TypeScript, Python and Machine Learning. (raazkhnl)
				</h1>

				{/* hero */}
				<section
					id="home"
					ref={heroRef}
					aria-label="About Rajesh Khanal"
					className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 scroll-mt-28"
				>
					<Reveal className="lg:col-span-7 h-full">
						<GlowCard className="glass rounded-[28px] p-7 sm:p-10 relative overflow-hidden h-full">
							<div
								className="absolute -top-32 -right-32 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
								style={{
									background:
										"radial-gradient(closest-side, rgba(54,249,179,0.55), transparent)",
								}}
							/>
							<div
								className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
								style={{
									background:
										"radial-gradient(closest-side, rgba(255,61,139,0.45), transparent)",
								}}
							/>

							{/* floating avatar — top-right of hero card */}
							<div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-10">
								<Avatar />
							</div>

							<div className="flex flex-wrap items-center gap-2 mb-7 pr-20 sm:pr-24">
								<span className="chip">
									<span className="dot" /> shipping at ird · gov of nepal
								</span>
								<span className="chip">📍 kathmandu, np</span>
								<span className="chip">⌁ m.e. cybersec · pulchowk</span>
							</div>

							<h2 className="display text-[44px] sm:text-[64px] md:text-[80px] font-black leading-[0.95] tracking-tight">
								<span className="text-grad-flow">building reliable</span>
								<br />
								<span className="relative inline-block text-[28px] sm:text-[48px] md:text-[64px]">
									<Typewriter
										words={HERO_PHRASES}
										className="text-grad-flow-mint"
									/>
									<svg
										className="tape-underline absolute -bottom-1 left-0 w-full"
										height="10"
										viewBox="0 0 360 10"
										fill="none"
										aria-hidden
									>
										<path
											d="M2 6 Q 60 2, 120 6 T 240 6 T 358 6"
											stroke="url(#u-grad)"
											strokeWidth="3"
											strokeLinecap="round"
										/>
										<defs>
											<linearGradient id="u-grad" x1="0" x2="1">
												<stop offset="0%" stopColor="#36f9b3" />
												<stop offset="60%" stopColor="#38bdf8" />
												<stop offset="100%" stopColor="#ff3d8b" />
											</linearGradient>
										</defs>
									</svg>
								</span>
							</h2>

							<p className="mt-6 max-w-xl text-[15px] sm:text-[16px] text-slate-300/90 leading-relaxed">
								i'm <span className="text-white font-semibold">raazkhnl</span> —
								a computer engineer crafting reliable, intelligent systems.
								shipping tax tech at the inland revenue department by day,
								chasing networks &amp; cybersecurity at pulchowk by night.
							</p>

							<div className="mt-8 flex flex-wrap items-center gap-3">
								<MagneticButton
									as="a"
									href={RAAZKHNL.socials.resume}
									target="_blank"
									rel="noreferrer"
									className="btn-primary"
								>
									view resume
									<svg
										className="w-4 h-4"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M5 12h14m0 0l-6-6m6 6l-6 6"
										/>
									</svg>
								</MagneticButton>
								<MagneticButton
									onClick={() =>
										contactRef.current?.scrollIntoView({ behavior: "smooth" })
									}
									className="btn-ghost"
								>
									say hi
								</MagneticButton>
								<button
									onClick={copyEmail}
									className="hidden sm:inline-flex mono text-[12px] text-slate-400 hover:text-white transition pl-2 items-center gap-1.5"
								>
									{emailCopied ? "✓ copied" : RAAZKHNL.socials.email}
								</button>
							</div>

							<div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-md">
								{[
									{ k: "5+", v: "years coding" },
									{ k: "25+", v: "projects shipped" },
									{ k: "∞", v: "cups of chiya" },
								].map((s) => (
									<div key={s.v} className="glass-tight rounded-2xl p-3 sm:p-4">
										<div className="text-2xl sm:text-3xl font-black text-grad-mint">
											{s.k}
										</div>
										<div className="mono text-[10px] text-slate-400 mt-1">
											{s.v}
										</div>
									</div>
								))}
							</div>
						</GlowCard>
					</Reveal>

					<div className="lg:col-span-5 flex flex-col gap-6 h-full">
						<Reveal delay={120}>
							<GlowCard className="glass rounded-[28px] p-6 sm:p-7">
								<div className="flex items-center justify-between mb-5">
									<span className="eyebrow">find me</span>
									<span className="mono text-[10px] text-slate-500">
										/socials
									</span>
								</div>
								<div className="grid grid-cols-2 gap-3">
									{[
										{
											label: "github",
											sub: "@raazkhnl",
											href: RAAZKHNL.socials.github,
											accent: "linear-gradient(135deg,#36f9b3,#0e766e)",
										},
										{
											label: "linkedin",
											sub: "in/raazkhnl",
											href: RAAZKHNL.socials.linkedin,
											accent: "linear-gradient(135deg,#38bdf8,#1e3a8a)",
										},
										{
											label: "website",
											sub: "khanalrajesh.com.np",
											href: RAAZKHNL.socials.website,
											accent: "linear-gradient(135deg,#ff3d8b,#831843)",
										},
										{
											label: "blogspot",
											sub: "raazkhnl.blogspot.com",
											href: RAAZKHNL.socials.blogspot,
											accent: "linear-gradient(135deg,#fbbf24,#7c2d12)",
										},
									].map((s) => (
										<a
											key={s.label}
											href={s.href}
											target="_blank"
											rel="noreferrer"
											className="group glass-tight rounded-2xl p-4 transition"
											style={{ borderColor: "rgba(255,255,255,0.05)" }}
										>
											<div className="flex items-center gap-3">
												<div
													className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-black uppercase"
													style={{ background: s.accent }}
												>
													{s.label.slice(0, 2)}
												</div>
												<div className="min-w-0">
													<div className="text-[12px] font-semibold text-white">
														{s.label}
													</div>
													<div className="mono text-[10px] text-slate-400 truncate">
														{s.sub}
													</div>
												</div>
												<svg
													className="ml-auto w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M7 17L17 7M9 7h8v8"
													/>
												</svg>
											</div>
										</a>
									))}
								</div>
								<div className="mt-5 flex flex-wrap gap-2">
									<button onClick={copyEmail} className="chip chip-pink">
										{emailCopied ? "✓ email copied" : "copy email"}
									</button>
									<span className="chip">
										press{" "}
										<span className="px-1 py-0.5 rounded-md bg-white/10 text-white">
											/
										</span>{" "}
										for terminal
									</span>
								</div>
							</GlowCard>
						</Reveal>

						<Reveal delay={200} className="flex-1 min-h-1">
							<Terminal
								sections={{
									home: heroRef,
									stack: stackRef,
									work: workRef,
									contact: contactRef,
								}}
								onTheme={setAccent}
								onMatrixToggle={() => setMatrixOn((v) => !v)}
							/>
						</Reveal>
					</div>
				</section>

				{/* stack */}
				<section
					id="stack"
					ref={stackRef}
					className="mt-24 sm:mt-28 scroll-mt-28"
				>
					<Reveal>
						<div className="flex items-end justify-between mb-8">
							<div>
								<span className="eyebrow">01 · stack</span>
								<h2 className="display mt-3 text-3xl sm:text-5xl font-black tracking-tight">
									tools i <span className="text-grad-mint">vibe</span> with
								</h2>
							</div>
							<span className="hidden md:inline mono text-[11px] text-slate-500">
								/stack-matrix
							</span>
						</div>
					</Reveal>
					<BentoGrid />
				</section>

				{/* work */}
				<section
					id="work"
					ref={workRef}
					className="mt-24 sm:mt-28 scroll-mt-28"
				>
					<Reveal>
						<div className="flex items-end justify-between mb-8">
							<div>
								<span className="eyebrow">02 · selected work</span>
								<h2 className="display mt-3 text-3xl sm:text-5xl font-black tracking-tight">
									things i <span className="text-grad-pink">shipped</span>
								</h2>
							</div>
							<a
								href={RAAZKHNL.socials.github}
								target="_blank"
								rel="noreferrer"
								className="hidden md:inline-flex chip chip-pink"
							>
								see all on github →
							</a>
						</div>
					</Reveal>
					<ProjectGallery />
				</section>

				{/* timeline + contact */}
				<section className="mt-24 sm:mt-28 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
					<Reveal className="h-full">
						<GlowCard className="glass rounded-[28px] p-7 sm:p-9 h-full">
							<span className="eyebrow">03 · timeline</span>
							<h3 className="display mt-3 text-2xl sm:text-3xl font-black tracking-tight mb-8">
								chapters so far
							</h3>
							<ol className="relative space-y-7">
								<span
									className="absolute left-[7px] top-1 bottom-1 w-px"
									style={{
										background:
											"linear-gradient(to bottom, rgba(54,249,179,0.5), rgba(255,61,139,0.4) 60%, transparent)",
									}}
								/>
								{EXPERIENCES.map((exp, i) => (
									<li key={i} className="relative pl-7 group">
										<span className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border border-white/10 bg-[#0a0a0d] flex items-center justify-center">
											<span
												className="w-1.5 h-1.5 rounded-full"
												style={{
													background:
														"linear-gradient(135deg, #36f9b3, #ff3d8b)",
													transition:
														"transform 280ms cubic-bezier(0.16,1,0.3,1)",
												}}
											/>
										</span>
										<div className="mono text-[10px] text-slate-500 mb-1">
											{exp.period}
										</div>
										<div className="text-[15px] font-semibold text-white">
											{exp.role}
										</div>
										<div
											className="mono text-[11px] mb-2"
											style={{ color: "#6ee7b7" }}
										>
											{exp.company}
										</div>
										<p className="text-[13px] text-slate-400 leading-relaxed">
											{exp.description}
										</p>
									</li>
								))}
							</ol>
						</GlowCard>
					</Reveal>

					<Reveal delay={120} className="h-full">
						<div
							id="contact"
							ref={contactRef as never}
							className="scroll-mt-28 h-full"
						>
							<ContactForm />
						</div>
					</Reveal>
				</section>
			</main>

			{/* footer — minimal, no marquee */}
			<footer className="relative z-10 border-t border-white/5 bg-[#050507]/80 backdrop-blur-md">
				<div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 mono text-[10.5px] text-slate-500">
					<span>
						made with{" "}
						<span aria-hidden style={{ color: "#ff3d8b" }}>
							ꨄ︎
						</span>
						<span className="sr-only">love</span> by{" "}
						<a
							href={RAAZKHNL.socials.github}
							target="_blank"
							rel="noreferrer"
							className="text-white hover:text-[#36f9b3] transition"
						>
							@raazkhnl
						</a>
					</span>
					<span className="hidden sm:inline">
						shortcuts:{" "}
						<kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
							/
						</kbd>{" "}
						terminal ·{" "}
						<kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
							g h
						</kbd>{" "}
						home ·{" "}
						<kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
							g w
						</kbd>{" "}
						work ·{" "}
						<kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
							g c
						</kbd>{" "}
						contact
					</span>
				</div>
			</footer>
		</div>
	);
};

/**
 * Anchor-based nav link. Scrolls programmatically with smooth behavior so
 * the animation runs reliably across browsers regardless of which element
 * ends up as the scroll container, then updates the URL hash so Back
 * returns to the previous section/route. The native anchor href is kept as
 * a no-JS fallback.
 */
const NavLink: React.FC<{
	id: string;
	label: string;
	alwaysShow?: boolean;
}> = ({ id, label, alwaysShow }) => {
	const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		const el = document.getElementById(id);
		if (!el) return;
		e.preventDefault();
		el.scrollIntoView({ behavior: "smooth", block: "start" });
		history.pushState(null, "", `#${id}`);
	};
	return (
		<a
			href={`#${id}`}
			onClick={onClick}
			className={`${
				alwaysShow ? "" : "hidden md:inline-flex"
			} px-3 py-2 rounded-lg text-[12px] text-slate-300 hover:text-white hover:bg-white/5 transition`}
		>
			{label}
		</a>
	);
};

export default Home;
