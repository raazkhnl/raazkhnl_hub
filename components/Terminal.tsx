/**
 * Terminal — interactive in-browser shell.
 *
 * Features:
 *  - command parsing with help, projects, navigation, social, theme, matrix toggle
 *  - up/down history (persisted in localStorage)
 *  - tab autocompletion (commands, project ids, file names, theme names)
 *  - global "/" focuses the input
 *  - Ctrl+L clears, Ctrl+C aborts current input
 *  - boot sequence with ASCII banner; honors prefers-reduced-motion via plain transitions
 *
 * Inputs:
 *  - sections     refs to page sections so the shell can scrollIntoView()
 *  - onTheme      called when the user runs `theme <c>`
 *  - onMatrixToggle  called when the user runs `matrix`
 */
import React, {
	useEffect,
	useMemo,
	useRef,
	useState,
	useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { PROJECTS, RAAZKHNL, SKILLS, EXPERIENCES } from "../constants";

type LineKind = "sys" | "in" | "out" | "err" | "ok" | "art";
interface Line {
	kind: LineKind;
	text: string;
}

interface SectionRefs {
	home?: React.RefObject<HTMLElement | null>;
	stack?: React.RefObject<HTMLElement | null>;
	work?: React.RefObject<HTMLElement | null>;
	contact?: React.RefObject<HTMLElement | null>;
}

interface TerminalProps {
	sections?: SectionRefs;
	onTheme?: (accent: "mint" | "pink" | "amber" | "iris") => void;
	onMatrixToggle?: () => void;
}

const HISTORY_KEY = "raazkhnl.term.history.v1";

const BANNER = [
	"╔═══════════════════════════════════════════╗",
	"║      raazkhnl · neural shell · v2.0       ║",
	"╚═══════════════════════════════════════════╝",
].join("\n");

const HELP: Array<[string, string]> = [
	["help [cmd]", "list commands · or details for one"],
	["about / whoami", "who is raazkhnl"],
	["skills [cat]", "list skills (cat: lang | ui | ops)"],
	["projects", "list shipped projects"],
	["open <id>", "open a project page"],
	["socials", "links · github · linkedin · web"],
	["email", "copy email to clipboard"],
	["contact", "jump to contact form"],
	["home / stack / work", "jump to a section"],
	["resume", "open resume / website"],
	["github / linkedin", "open in new tab"],
	["date / time", "current date or time"],
	["echo <text>", "echo your input"],
	["banner", "print ascii banner"],
	["neofetch", "system info card"],
	["matrix", "toggle matrix rain"],
	["theme <c>", "accent: mint · pink · amber · iris"],
	["ls", 'list "files"'],
	["cat <file>", "read a file"],
	["pwd", "print working dir"],
	["history", "show recent commands"],
	["man <cmd>", "manual entry for a command"],
	["joke", "random dev joke"],
	["sudo <cmd>", "try it"],
	["clear / cls", "clear the screen (or ctrl+l)"],
];

const FILES: Record<string, string[]> = {
	"readme.md": [
		"# raazkhnl — computer engineer",
		"",
		"building reliable systems for people from kathmandu.",
		"shipping tax tech @ ird · networks & cybersec @ pulchowk.",
		"",
		"try `projects` to see what i built.",
	],
	"about.txt": [
		"raazkhnl · @raazkhnl",
		"computer engineer @ ird, gov of nepal (since 2025).",
		"m.e. networks & cybersec @ pulchowk campus (since 2026).",
		"b.e. computer engineering @ ioe pulchowk '24.",
	],
	"contact.txt": [
		`email   : ${RAAZKHNL.socials.email}`,
		`phone   : ${RAAZKHNL.socials.phone}`,
		`web     : ${RAAZKHNL.socials.website}`,
	],
	"now.txt": [
		"shipping  · tax tech @ ird, gov of nepal",
		"studying  · networks & cybersec @ pulchowk",
		"reading   · the pragmatic programmer",
		"mood      · lo-fi · chiya · packets",
	],
};

const JOKES = [
	"there are 10 kinds of people: those who get binary and those who don't.",
	"i'd tell you a udp joke, but you might not get it.",
	"why do programmers prefer dark mode? because light attracts bugs.",
	"real programmers count from 0.",
	"git push --force is a love language.",
	"tcp jokes are reliable. udp jokes are faster but you might miss them.",
	"there's no place like 127.0.0.1.",
];

const Terminal: React.FC<TerminalProps> = ({
	sections,
	onTheme,
	onMatrixToggle,
}) => {
	const [lines, setLines] = useState<Line[]>([]);
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<string[]>(() => {
		try {
			return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
		} catch {
			return [];
		}
	});
	const [hPtr, setHPtr] = useState<number>(-1);
	const [boot, setBoot] = useState(true);
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	const print = useCallback((arr: Line[] | Line) => {
		setLines((prev) => prev.concat(Array.isArray(arr) ? arr : [arr]));
	}, []);

	/* boot sequence — keeps the user oriented while the page settles */
	useEffect(() => {
		let cancelled = false;
		const seq: Array<{ d: number; line: Line }> = [
			{ d: 30, line: { kind: "sys", text: "booting raazkhnl shell..." } },
			{ d: 180, line: { kind: "sys", text: "✓ memory · ok" } },
			{ d: 160, line: { kind: "sys", text: "✓ shell · zsh" } },
			{ d: 160, line: { kind: "sys", text: "✓ network · stable" } },
			{ d: 200, line: { kind: "art", text: BANNER } },
			{
				d: 60,
				line: {
					kind: "sys",
					text: "type `help` to begin · ↑/↓ history · tab autocomplete · / to focus",
				},
			},
		];
		const run = async () => {
			for (const s of seq) {
				if (cancelled) return;
				await new Promise((r) => setTimeout(r, s.d));
				if (cancelled) return;
				print(s.line);
			}
			if (!cancelled) setBoot(false);
		};
		run();
		return () => {
			cancelled = true;
		};
	}, [print]);

	/* global "/" focuses input from anywhere on the page */
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const editing =
				target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
			if (e.key === "/" && !editing) {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	/* keep latest line in view */
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [lines]);

	const allCommands = useMemo(
		() =>
			HELP.map(([c]) => c.split(" ")[0].split("/")[0].trim()).concat([
				"cls",
				"man",
				"history",
				"whoami",
			]),
		[]
	);

	const completions = (q: string): string[] => {
		const t = q.trim();
		if (!t) return [];
		const parts = t.split(/\s+/);
		if (parts.length === 1)
			return allCommands.filter((c) => c.startsWith(parts[0]));
		if (parts[0] === "open" && parts.length === 2)
			return PROJECTS.map((p) => p.id).filter((id) => id.startsWith(parts[1]));
		if (parts[0] === "cat" && parts.length === 2)
			return Object.keys(FILES).filter((f) => f.startsWith(parts[1]));
		if (
			(parts[0] === "theme" || parts[0] === "man" || parts[0] === "help") &&
			parts.length === 2
		) {
			const pool =
				parts[0] === "theme" ? ["mint", "pink", "amber", "iris"] : allCommands;
			return pool.filter((c) => c.startsWith(parts[1]));
		}
		return [];
	};

	const persistHistory = (next: string[]) => {
		setHistory(next);
		try {
			localStorage.setItem(HISTORY_KEY, JSON.stringify(next.slice(-50)));
		} catch {
			/* no-op */
		}
	};

	const exec = useCallback(
		async (raw: string) => {
			const cmdLine = raw.trim();
			print({ kind: "in", text: raw });
			if (!cmdLine) return;

			const [cmd, ...rest] = cmdLine.split(/\s+/);
			const arg = rest.join(" ");
			const lower = cmd.toLowerCase();

			const out = (text: string, kind: LineKind = "out") =>
				print({ kind, text });
			const writeLines = (texts: string[], kind: LineKind = "out") =>
				print(texts.map((t) => ({ kind, text: t })));

			switch (lower) {
				case "help":
				case "man": {
					if (!arg) {
						writeLines(["available commands:"]);
						HELP.forEach(([c, d]) => out(`  ${c.padEnd(22, " ")} ${d}`));
					} else {
						const found = HELP.find(
							([c]) => c.split(" ")[0].split("/")[0] === arg.toLowerCase()
						);
						if (found) out(`${found[0]} — ${found[1]}`);
						else out(`no help entry for: ${arg}`, "err");
					}
					break;
				}
				case "about":
				case "whoami": {
					writeLines([
						"Rajesh Khanal · @raazkhnl",
						"computer engineer @ ird, gov of nepal",
						"m.e. networks & cybersec @ pulchowk · b.e. computer @ ioe pulchowk '24",
						"",
						"energy: prototypes · weird ml · beautiful interfaces.",
					]);
					break;
				}
				case "skills": {
					const wanted = arg.toLowerCase();
					const map: Record<string, string> = {
						lang: "Engines & Languages",
						ui: "Frameworks & UI",
						ops: "Cloud & Ops",
					};
					const targets = wanted
						? SKILLS.filter((s) => s.category === (map[wanted] || s.category))
						: SKILLS;
					if (!targets.length) {
						out(`unknown category: ${wanted}. try: lang, ui, ops`, "err");
						break;
					}
					targets.forEach((cat) => {
						out(`▸ ${cat.category.toLowerCase()}`);
						out(`  ${cat.skills.join(" · ")}`);
					});
					break;
				}
				case "projects": {
					writeLines(["shipped:"]);
					PROJECTS.forEach((p) =>
						out(`  ${p.id.padEnd(12, " ")} · ${p.title}`)
					);
					out("use `open <id>` to view details.");
					break;
				}
				case "open": {
					const proj = PROJECTS.find((p) => p.id === arg.toLowerCase());
					if (!proj) {
						out(`no such project: ${arg}`, "err");
						break;
					}
					out(`opening /project/${proj.id}...`, "ok");
					setTimeout(() => navigate(`/project/${proj.id}`), 250);
					break;
				}
				case "socials": {
					writeLines([
						`github   ${RAAZKHNL.socials.github}`,
						`linkedin ${RAAZKHNL.socials.linkedin}`,
						`website  ${RAAZKHNL.socials.website}`,
						`email    ${RAAZKHNL.socials.email}`,
					]);
					break;
				}
				case "email": {
					try {
						await navigator.clipboard.writeText(RAAZKHNL.socials.email);
						out(`copied ${RAAZKHNL.socials.email} to clipboard ✓`, "ok");
					} catch {
						out(`email: ${RAAZKHNL.socials.email}`);
					}
					break;
				}
				case "contact":
					sections?.contact?.current?.scrollIntoView({ behavior: "smooth" });
					out("jumping to contact form...");
					break;
				case "home":
					sections?.home?.current?.scrollIntoView({ behavior: "smooth" });
					out("warping home...");
					break;
				case "stack":
					sections?.stack?.current?.scrollIntoView({ behavior: "smooth" });
					out("jumping to stack...");
					break;
				case "work":
				case "gallery":
					sections?.work?.current?.scrollIntoView({ behavior: "smooth" });
					out("jumping to work...");
					break;
				case "resume":
				case "website":
					window.open(
						RAAZKHNL.socials.website,
						"_blank",
						"noopener,noreferrer"
					);
					out("launching resume...", "ok");
					break;
				case "github":
					window.open(RAAZKHNL.socials.github, "_blank", "noopener,noreferrer");
					out("opened github ✓", "ok");
					break;
				case "linkedin":
					window.open(
						RAAZKHNL.socials.linkedin,
						"_blank",
						"noopener,noreferrer"
					);
					out("opened linkedin ✓", "ok");
					break;
				case "date":
					out(new Date().toString());
					break;
				case "time":
					out(new Date().toLocaleTimeString());
					break;
				case "echo":
					out(arg || "");
					break;
				case "banner":
					print({ kind: "art", text: BANNER });
					break;
				case "pwd":
					out("/raazkhnl/hub");
					break;
				case "ls": {
					writeLines([
						"about.txt    contact.txt   now.txt    readme.md",
						"projects/    skills/       timeline/",
					]);
					break;
				}
				case "cat": {
					const f = FILES[arg.toLowerCase()];
					if (!f) {
						out(`no such file: ${arg}. try \`ls\``, "err");
						break;
					}
					writeLines(f);
					break;
				}
				case "neofetch": {
					writeLines([
						`   ╭───────────────────────────╮  raazkhnl@hub`,
						`   │   ▄▄▄ ▄▄▄ ▄▄ ▄▄▄ ▄▄▄  │  ──────────────`,
						`   │  █  ▀ █▀█ █▀█  █  █▀▀  │  host   · raazkhnl 2.0`,
						`   │  █▀▀▀ █▀█ █▄█  █  █▄▄  │  shell  · zsh`,
						`   ╰───────────────────────────╯  editor · vscode`,
						`   loc       · kathmandu, np         stack  · react · py · linux`,
						`   role      · computer engineer     mood   · chiya + lo-fi`,
					]);
					break;
				}
				case "matrix":
					onMatrixToggle?.();
					out("toggled matrix rain.", "ok");
					break;
				case "theme": {
					const c = arg.toLowerCase() as "mint" | "pink" | "amber" | "iris";
					if (!["mint", "pink", "amber", "iris"].includes(c)) {
						out("usage: theme <mint|pink|amber|iris>", "err");
						break;
					}
					onTheme?.(c);
					out(`accent → ${c} ✓`, "ok");
					break;
				}
				case "sudo":
					out(`sudo: ${arg || "cmd"}: permission denied. nice try ;)`, "err");
					break;
				case "joke":
					out(JOKES[Math.floor(Math.random() * JOKES.length)]);
					break;
				case "experience":
				case "timeline": {
					EXPERIENCES.forEach((e) =>
						out(`${e.period.padEnd(18, " ")} · ${e.role} @ ${e.company}`)
					);
					break;
				}
				case "history": {
					if (!history.length) {
						out("history is empty.");
						break;
					}
					history
						.slice(-25)
						.forEach((h, i) =>
							out(`  ${(i + 1).toString().padStart(3, " ")}  ${h}`)
						);
					break;
				}
				case "exit":
				case "quit":
					out("you can't escape the hub. try `clear` instead.", "err");
					break;
				case "cls":
				case "clear":
					setLines([]);
					return;
				default:
					out(`command not found: ${cmd}. try \`help\`.`, "err");
			}
		},
		[history, navigate, onMatrixToggle, onTheme, print, sections]
	);

	/* keyboard handling for the input */
	const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const value = input;
			setInput("");
			if (value.trim()) persistHistory(history.concat(value).slice(-50));
			setHPtr(-1);
			void exec(value);
			return;
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (!history.length) return;
			const next = hPtr < 0 ? history.length - 1 : Math.max(0, hPtr - 1);
			setHPtr(next);
			setInput(history[next] ?? "");
			return;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (hPtr < 0) return;
			const next = hPtr + 1;
			if (next >= history.length) {
				setHPtr(-1);
				setInput("");
				return;
			}
			setHPtr(next);
			setInput(history[next] ?? "");
			return;
		}
		if (e.key === "Tab") {
			e.preventDefault();
			const cands = completions(input);
			if (cands.length === 1) {
				const parts = input.trim().split(/\s+/);
				parts[parts.length - 1] = cands[0];
				setInput(parts.join(" ") + " ");
			} else if (cands.length > 1) {
				print({ kind: "sys", text: cands.join("  ") });
			}
			return;
		}
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
			e.preventDefault();
			setLines([]);
			return;
		}
		if (e.ctrlKey && e.key.toLowerCase() === "c") {
			e.preventDefault();
			print({ kind: "in", text: input });
			print({ kind: "sys", text: "^C" });
			setInput("");
			return;
		}
	};

	const focusInput = () => inputRef.current?.focus();

	return (
		<div
			className="glass rounded-3xl overflow-hidden flex flex-col h-[420px] cursor-text"
			onClick={focusInput}
			role="region"
			aria-label="raazkhnl terminal"
		>
			{/* title bar */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02] shrink-0">
				<div className="flex items-center gap-2">
					<span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
					<span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
					<span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
				</div>
				<div className="flex items-center gap-2 mono text-[10px] text-slate-500">
					<span className="dot" />
					<span className="hidden sm:inline">raazkhnl@hub:~/shell</span>
					<span className="sm:hidden">raazkhnl@hub</span>
				</div>
				<span className="mono text-[10px] text-slate-600 hidden sm:inline">
					press /
				</span>
			</div>

			{/* output + prompt */}
			<div className="flex-1 px-4 py-3 overflow-y-auto mono text-[12px] leading-[1.55] no-scrollbar min-h-0">
				{lines.map((l, i) => (
					<LineRow key={i} line={l} />
				))}
				{!boot && (
					<div className="flex items-center gap-2 mt-1">
						<Prompt />
						<input
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKey}
							spellCheck={false}
							autoComplete="off"
							autoFocus
							placeholder="type a command…  (try `help`)"
							aria-label="terminal input"
							className="bg-transparent border-none outline-none flex-1 min-w-0 mono text-[12px] text-white placeholder:text-slate-700"
							style={{ caretColor: "#36f9b3" }}
						/>
					</div>
				)}
				<div ref={bottomRef} />
			</div>

			{/* suggestion chips */}
			<div className="px-4 py-2 border-t border-white/5 bg-white/[0.015] flex flex-wrap items-center gap-1.5 shrink-0">
				{[
					"help",
					"projects",
					"whoami",
					"skills",
					"neofetch",
					"matrix",
					"joke",
				].map((c) => (
					<button
						key={c}
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							void exec(c);
							inputRef.current?.focus();
						}}
						className="mono text-[10.5px] px-2 py-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition"
						style={{ border: "1px solid rgba(255,255,255,0.08)" }}
					>
						{c}
					</button>
				))}
			</div>
		</div>
	);
};

const Prompt: React.FC = () => (
	<span className="mono text-[12px] shrink-0 select-none">
		<span style={{ color: "#36f9b3" }}>➜</span>{" "}
		<span style={{ color: "#ff3d8b" }}>raazkhnl</span>
		<span className="text-slate-500"> ~ </span>
	</span>
);

const LineRow: React.FC<{ line: Line }> = ({ line }) => {
	if (line.kind === "art") {
		return (
			<pre
				className="whitespace-pre text-[11px] leading-[1.25] mb-1 overflow-x-auto no-scrollbar"
				style={{ color: "#36f9b3" }}
			>
				{line.text}
			</pre>
		);
	}
	if (line.kind === "in") {
		return (
			<div className="whitespace-pre-wrap mb-1 break-words">
				<Prompt />
				<span className="text-white">{line.text}</span>
			</div>
		);
	}
	if (line.kind === "err")
		return (
			<div
				className="whitespace-pre-wrap mb-1 break-words"
				style={{ color: "#ff3d8b" }}
			>
				{line.text}
			</div>
		);
	if (line.kind === "ok")
		return (
			<div
				className="whitespace-pre-wrap mb-1 break-words"
				style={{ color: "#36f9b3" }}
			>
				{line.text}
			</div>
		);
	if (line.kind === "sys")
		return (
			<div className="whitespace-pre-wrap mb-1 break-words text-slate-500">
				{line.text}
			</div>
		);
	return (
		<div className="whitespace-pre-wrap mb-1 break-words text-slate-300/85">
			{line.text}
		</div>
	);
};

export default Terminal;
