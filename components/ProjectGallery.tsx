/**
 * ProjectGallery — grid of project cards with cursor-tracking glow.
 * First two projects are featured (wider tiles); the rest are standard.
 * The trailing tile links to the GitHub profile.
 *
 * The corner action button prefers a project's live `link` (shipped products),
 * then `github` (open-source repos), and finally falls back to the profile root.
 * The icon and aria-label adapt accordingly so users know where it leads.
 */
import React from "react";
import { Link } from "react-router-dom";
import { PROJECTS, RAAZKHNL } from "../constants";
import type { Project } from "../types";
import GlowCard from "./GlowCard";
import Reveal from "./Reveal";

type ActionKind = "live" | "repo" | "profile";

const projectAction = (p: Project): { href: string; kind: ActionKind } => {
	if (p.link)   return { href: p.link,   kind: "live" };
	if (p.github) return { href: p.github, kind: "repo" };
	return { href: RAAZKHNL.socials.github, kind: "profile" };
};

const ACTION_LABEL: Record<ActionKind, string> = {
	live: "open live demo",
	repo: "open on github",
	profile: "open my github",
};

const ProjectGallery: React.FC = () => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
			{PROJECTS.map((project, i) => {
				const featured = i < 2;
				return (
					<Reveal
						key={project.id}
						delay={i * 60}
						className={featured ? "lg:col-span-3" : "lg:col-span-2"}
					>
						<Link to={`/project/${project.id}`} className="group block">
							<GlowCard className="card-media aspect-[4/3]">
								<img
									src={project.image}
									alt={project.title}
									loading="lazy"
									className="absolute inset-0 w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent" />
								<div
									className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
									style={{
										background:
											"radial-gradient(60% 60% at 50% 100%, rgba(54,249,179,0.30), transparent)",
									}}
								/>

								<div className="absolute top-4 left-4 right-4 flex items-start justify-between">
									<span className="chip">
										<span className="dot" />
										{project.tags[0]}
									</span>
									{(() => {
										const { href, kind } = projectAction(project);
										return (
											<button
												type="button"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													window.open(href, "_blank", "noopener,noreferrer");
												}}
												className="px-2.5 h-8 min-w-8 rounded-full glass-tight flex items-center gap-1.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition"
												aria-label={`${ACTION_LABEL[kind]} — ${project.title}`}
												title={ACTION_LABEL[kind]}
											>
												{kind === "live" && (
													<span className="mono text-[10px] text-white">live</span>
												)}
												<svg
													className="w-3.5 h-3.5 text-white"
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
											</button>
										);
									})()}
								</div>

								<div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
									<h3
										className={`display font-black tracking-tight text-white ${
											featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
										}`}
									>
										{project.title}
									</h3>
									<p className="mt-2 text-[12.5px] text-slate-300/90 leading-relaxed line-clamp-2 max-w-md">
										{project.description}
									</p>
									<div className="mt-3 flex flex-wrap gap-1.5">
										{project.tags.slice(0, 4).map((t, ti) => (
											<span
												key={ti}
												className="mono text-[10px] text-slate-300/80 px-2 py-0.5 rounded-md bg-white/5 border border-white/5"
											>
												{t}
											</span>
										))}
									</div>
								</div>
							</GlowCard>
						</Link>
					</Reveal>
				);
			})}

			<Reveal className="lg:col-span-2" delay={PROJECTS.length * 60}>
				<a
					href={RAAZKHNL.socials.github}
					target="_blank"
					rel="noreferrer"
					className="group block"
				>
					<GlowCard className="aspect-[4/3] glass rounded-[28px] flex flex-col items-center justify-center text-center p-8 transition relative overflow-hidden">
						<div
							className="absolute inset-0 opacity-40 pointer-events-none"
							style={{
								background:
									"radial-gradient(60% 60% at 50% 50%, rgba(54,249,179,0.15), transparent)",
							}}
						/>
						<div
							className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-[#04130c] text-2xl font-black"
							style={{
								background:
									"linear-gradient(135deg,#36f9b3,#38bdf8 60%,#ff3d8b)",
							}}
						>
							+
						</div>
						<div className="relative text-white text-lg font-semibold">
							more on github
						</div>
						<div className="relative mono text-[11px] text-slate-400 mt-2">
							@raazkhnl
						</div>
					</GlowCard>
				</a>
			</Reveal>
		</div>
	);
};

export default ProjectGallery;
