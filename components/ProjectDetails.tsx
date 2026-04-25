/**
 * ProjectDetails — single-project page (route: /project/:id).
 * Shows banner · overview · tech stack · GitHub link · "keep exploring" tile row.
 * Falls back to a 404-style view when the id is unknown.
 */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PROJECTS, RAAZKHNL } from "../constants";
import GlowCard from "./GlowCard";
import Reveal from "./Reveal";

const repoLink = (url?: string): string => url || RAAZKHNL.socials.github;

const ProjectDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(true);

	const project = PROJECTS.find((p) => p.id === id);
	const others = PROJECTS.filter((p) => p.id !== id).slice(0, 3);

	useEffect(() => {
		window.scrollTo(0, 0);
		const timer = setTimeout(() => setLoading(false), 300);
		return () => clearTimeout(timer);
	}, [id]);

	if (loading) {
		return (
			<div
				className="fixed inset-0 z-[999] flex items-center justify-center"
				style={{ background: "#050507" }}
			>
				<div className="stage" />
				<div className="relative flex flex-col items-center gap-3">
					<div
						className="w-10 h-10 rounded-full border-2 animate-spin"
						style={{
							borderColor: "rgba(54,249,179,0.18)",
							borderTopColor: "#36f9b3",
						}}
					/>
					<span
						className="mono text-[11px] tracking-[0.4em] uppercase"
						style={{ color: "#36f9b3" }}
					>
						loading
					</span>
				</div>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
				<div className="stage" />
				<div className="grain" />
				<div className="relative z-10">
					<div className="display text-7xl sm:text-9xl font-black text-grad-mint">
						404
					</div>
					<p className="mt-4 text-slate-400 mono text-[12px] uppercase tracking-[0.3em]">
						project not found
					</p>
					<Link to="/" className="btn-ghost mt-8 inline-flex">
						← back home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen text-slate-200 pb-24">
			<div className="stage" />
			<div className="grain" />
			<div className="scanlines" />

			<header className="fixed top-0 left-0 right-0 z-50 pt-6">
				<div className="mx-auto px-4 sm:px-6 max-w-5xl">
					<div className="flex items-center justify-between gap-4 glass rounded-2xl pl-3 pr-3 py-2">
						<Link to="/" className="group flex items-center gap-3 pl-1">
							<div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition">
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
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</div>
							<span className="text-[12px] font-semibold text-white">
								back to hub
							</span>
						</Link>
						<div className="flex items-center gap-2 mono text-[10px] text-slate-400">
							<span className="dot" />
							project · {project.id}
						</div>
					</div>
				</div>
			</header>

			<main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-32">
				<Reveal>
					<div className="card-media aspect-[21/9] rounded-[32px]">
						<img
							src={project.image}
							alt={project.title}
							className="absolute inset-0 w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent" />
						<div
							className="absolute inset-0"
							style={{
								background:
									"radial-gradient(60% 80% at 0% 100%, rgba(54,249,179,0.25), transparent)",
							}}
						/>
						<div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10 right-6 sm:right-10">
							<div className="flex flex-wrap gap-2 mb-4">
								{project.tags.map((t, i) => (
									<span key={i} className="chip">
										{t}
									</span>
								))}
							</div>
							<h1 className="display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none">
								{project.title}
							</h1>
						</div>
					</div>
				</Reveal>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
					<Reveal className="md:col-span-2">
						<GlowCard className="glass rounded-[24px] p-7 sm:p-9 h-full">
							<span className="eyebrow">overview</span>
							<p className="mt-4 text-[15px] sm:text-[17px] text-slate-200/90 leading-relaxed">
								{project.description}
							</p>

							<div className="mt-10">
								<span className="eyebrow">tech stack</span>
								<div className="mt-4 flex flex-wrap gap-2">
									{project.tags.map((tag, i) => (
										<span key={i} className="chip">
											{tag}
										</span>
									))}
								</div>
							</div>
						</GlowCard>
					</Reveal>

					<div className="space-y-5">
						{project.link && (
							<Reveal delay={80}>
								<a
									href={project.link}
									target="_blank"
									rel="noreferrer"
									className="block"
								>
									<GlowCard className="glass rounded-[24px] p-6 hover:border-pink/40 transition group">
										<div className="flex items-center gap-3">
											<div
												className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
												style={{
													background:
														"linear-gradient(135deg,#ff3d8b,#fb7185)",
												}}
											>
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
														d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.5-3 4-6.5 4-9s-1.5-6-4-9m0 18c-2.5-3-4-6.5-4-9s1.5-6 4-9M3 12h18"
													/>
												</svg>
											</div>
											<div className="flex-1 min-w-0">
												<div className="text-[13px] font-semibold text-white">
													view live
												</div>
												<div className="mono text-[10px] text-slate-400 truncate">
													{project.link.replace(/^https?:\/\//, "")}
												</div>
											</div>
											<svg
												className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
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
									</GlowCard>
								</a>
							</Reveal>
						)}
						<Reveal delay={120}>
							<a
								href={repoLink(project.github)}
								target="_blank"
								rel="noreferrer"
								className="block"
							>
								<GlowCard className="glass rounded-[24px] p-6 hover:border-mint/40 transition group">
									<div className="flex items-center gap-3">
										<div
											className="w-10 h-10 rounded-xl flex items-center justify-center text-[#04130c]"
											style={{
												background: "linear-gradient(135deg,#36f9b3,#10b981)",
											}}
										>
											<svg
												className="w-4 h-4"
												viewBox="0 0 24 24"
												fill="currentColor"
											>
												<path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
											</svg>
										</div>
										<div className="flex-1">
											<div className="text-[13px] font-semibold text-white">
												{project.github
													? "view source"
													: project.link
														? "more of my code"
														: "see all my work"}
											</div>
											<div className="mono text-[10px] text-slate-400">
												github · @raazkhnl
											</div>
										</div>
										<svg
											className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
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
								</GlowCard>
							</a>
						</Reveal>
						<Reveal delay={180}>
							<a href={`mailto:${RAAZKHNL.socials.email}`} className="block">
								<GlowCard className="glass rounded-[24px] p-6 hover:border-pink/40 transition">
									<div className="text-[12.5px] font-semibold text-white">
										questions about this build?
									</div>
									<p className="mono text-[11px] text-slate-400 mt-2">
										happy to chat — drop me a line.
									</p>
									<div
										className="mt-3 inline-flex items-center gap-2 mono text-[11px]"
										style={{ color: "#f9a8d4" }}
									>
										{RAAZKHNL.socials.email}
										<svg
											className="w-3.5 h-3.5"
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
									</div>
								</GlowCard>
							</a>
						</Reveal>
					</div>
				</div>

				{others.length > 0 && (
					<section className="mt-16">
						<Reveal>
							<div className="flex items-end justify-between mb-6">
								<span className="eyebrow">keep exploring</span>
								<Link
									to="/"
									className="mono text-[11px] text-slate-400 hover:text-white"
								>
									all work →
								</Link>
							</div>
						</Reveal>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{others.map((p, i) => (
								<Reveal key={p.id} delay={i * 80}>
									<Link to={`/project/${p.id}`} className="group block">
										<GlowCard className="card-media aspect-video">
											<img
												src={p.image}
												alt={p.title}
												className="absolute inset-0 w-full h-full object-cover"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/30 to-transparent" />
											<div className="absolute bottom-0 p-4">
												<h4 className="text-white text-base font-semibold group-hover:text-grad-mint transition">
													{p.title}
												</h4>
											</div>
										</GlowCard>
									</Link>
								</Reveal>
							))}
						</div>
					</section>
				)}
			</main>
		</div>
	);
};

export default ProjectDetails;
