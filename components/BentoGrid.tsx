/**
 * BentoGrid — manifesto, current education, "now" status, stack matrix, CTA strip.
 * Pure presentational component, sourced from `constants.tsx`.
 */
import React from "react";
import { SKILLS, RAAZKHNL } from "../constants";
import GlowCard from "./GlowCard";
import Reveal from "./Reveal";

const STACK_DOT: Record<string, string> = {
	"Engines & Languages": "linear-gradient(135deg,#36f9b3,#38bdf8)",
	"Frameworks & UI": "linear-gradient(135deg,#38bdf8,#8b5cf6)",
	"Cloud & Ops": "linear-gradient(135deg,#ff3d8b,#fb7185)",
};

const BentoGrid: React.FC = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-5">
			{/* manifesto */}
			<Reveal className="md:col-span-4">
				<GlowCard className="glass rounded-[24px] p-7 sm:p-9 relative overflow-hidden h-full">
					<div
						className="absolute -right-12 -top-12 w-56 h-56 rounded-full opacity-30 blur-3xl pointer-events-none"
						style={{
							background: "radial-gradient(closest-side,#36f9b3,transparent)",
						}}
					/>
					<span className="eyebrow">manifesto</span>
					<p className="mt-5 text-[15px] sm:text-[17px] leading-relaxed text-slate-200/90 max-w-2xl">
						building reliable systems for people, with a soft spot for
						<span className="text-grad-mint font-semibold">
							{" "}
							beautiful interfaces{" "}
						</span>
						and the kind of code that makes someone’s day quietly easier.
					</p>
					<div className="mt-6 flex flex-wrap gap-2">
						{[
							"systems",
							"cybersec",
							"ai/ml",
							"design-curious",
							"open-source",
						].map((t) => (
							<span key={t} className="chip">
								{t}
							</span>
						))}
					</div>
				</GlowCard>
			</Reveal>

			{/* education (current) */}
			<Reveal className="md:col-span-2" delay={80}>
				<GlowCard className="glass rounded-[24px] p-7 relative overflow-hidden flex flex-col justify-between h-full">
					<div>
						<span className="eyebrow">education</span>
						<div className="mt-5 flex items-start gap-3">
							<span className="text-2xl mt-0.5">🎓</span>
							<div>
								<div className="text-[14px] font-semibold text-white leading-tight">
									pulchowk campus
								</div>
								<div className="mono text-[11px] text-slate-400 leading-snug mt-1">
									m.e. computer engineering
									<br />
									<span className="text-slate-500">
										networks &amp; cyber security
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-6 grid grid-cols-2 gap-2 text-[11px]">
						<div className="glass-tight rounded-xl p-3">
							<div className="mono text-[9px] text-slate-500 mb-1">since</div>
							<div className="text-white font-semibold">2026</div>
						</div>
						<div className="glass-tight rounded-xl p-3">
							<div className="mono text-[9px] text-slate-500 mb-1">
								based in
							</div>
							<div className="text-white font-semibold">ktm, np</div>
						</div>
					</div>
				</GlowCard>
			</Reveal>

			{/* now */}
			<Reveal className="md:col-span-2" delay={120}>
				<GlowCard className="glass rounded-[24px] p-7 relative overflow-hidden h-full">
					<span className="eyebrow">now</span>
					<div className="mt-5 space-y-3">
						{[
							{ k: "shipping", v: "tax tech @ ird, gov of nepal" },
							{ k: "studying", v: "networks & cybersec @ pulchowk" },
							{ k: "mood", v: "lo-fi · chiya · packets" },
						].map((r) => (
							<div key={r.k} className="flex items-baseline gap-3">
								<span className="mono text-[10px] text-slate-500 uppercase w-16 shrink-0">
									{r.k}
								</span>
								<span className="text-[13px] text-slate-200">{r.v}</span>
							</div>
						))}
					</div>
				</GlowCard>
			</Reveal>

			{/* stack matrix */}
			<Reveal className="md:col-span-4" delay={160}>
				<GlowCard className="glass rounded-[24px] p-7 sm:p-9 relative overflow-hidden h-full">
					<div className="flex items-center justify-between mb-6">
						<span className="eyebrow">stack matrix</span>
						<span className="mono text-[10px] text-slate-500">/heat-map</span>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						{SKILLS.map((cat, i) => (
							<div key={i}>
								<div className="flex items-center gap-2 mb-4">
									<span
										className="w-1.5 h-1.5 rounded-full"
										style={{
											background:
												STACK_DOT[cat.category] ||
												"linear-gradient(135deg,#36f9b3,#ff3d8b)",
										}}
									/>
									<p className="mono text-[10px] text-slate-400 uppercase tracking-[0.2em]">
										{cat.category}
									</p>
								</div>
								<div className="flex flex-wrap gap-2">
									{cat.skills.map((s, si) => (
										<span key={si} className="chip">
											{s}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</GlowCard>
			</Reveal>

			{/* CTA strip */}
			<Reveal className="md:col-span-6" delay={220}>
				<GlowCard className="glass rounded-[24px] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 justify-between relative overflow-hidden">
					<div
						className="absolute inset-0 opacity-30 pointer-events-none"
						style={{
							background:
								"radial-gradient(60% 100% at 0% 50%, rgba(54,249,179,0.25), transparent), radial-gradient(60% 100% at 100% 50%, rgba(255,61,139,0.25), transparent)",
						}}
					/>
					<div className="relative">
						<div className="text-white text-lg sm:text-xl font-semibold">
							got a wild idea?
						</div>
						<div className="mono text-[11px] text-slate-400 mt-1">
							i love prototypes, weird ml, and beautiful interfaces.
						</div>
					</div>
					<div className="relative flex flex-wrap gap-3">
						<a href="#contact" className="btn-primary">
							let's talk →
						</a>
						<a
							href={RAAZKHNL.socials.github}
							target="_blank"
							rel="noopener noreferrer"
							className="btn-ghost"
						>
							peek my code
						</a>
					</div>
				</GlowCard>
			</Reveal>
		</div>
	);
};

export default BentoGrid;
