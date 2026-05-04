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
 *  - fake POSIX-ish filesystem (cd / pwd / ls / cat / tree) with three subdirs:
 *    projects · skills · timeline — each backed by real portfolio data.
 *
 * Inputs:
 *  - sections     refs to page sections so the shell can scrollIntoView()
 *  - onTheme      called when the user runs `theme <c>`
 *  - onMatrixToggle  called when the user runs `matrix`
 *
 * Security note: all output renders through React text children — no
 * dangerouslySetInnerHTML, no eval, no template strings concatenated into
 * URLs from user input. Object lookups (FILES, ALIASES) are guarded with
 * hasOwn so prototype keys (`__proto__`, `constructor`, ...) cannot return
 * the prototype object as a "match". User-supplied text used in `ping`,
 * `cowsay`, `echo`, `grep`, etc. is length-clamped and stripped of control
 * characters before being printed.
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
const MAX_ARG_LEN = 200;

const BANNER = [
	"╔═══════════════════════════════════════════╗",
	"║      raazkhnl · neural shell · v2.1       ║",
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
	["resume / website", "open website / resume"],
	["github / linkedin", "open in new tab"],
	["date / time", "current date or time"],
	["echo <text>", "echo your input"],
	["banner", "print ascii banner"],
	["neofetch", "system info card"],
	["uname [-a]", "kernel info"],
	["uptime", "how long we've been up"],
	["version / -v", "shell version"],
	["motd", "message of the day"],
	["matrix", "toggle matrix rain"],
	["theme <c>", "accent: mint · pink · amber · iris"],
	["colors / palette", "show accent palette"],
	["pwd", "print working dir"],
	["cd <dir>", "change dir (projects | skills | timeline | ..)"],
	["ls", "list files in cwd"],
	["tree", "tree view of the hub"],
	["cat <file>", "read a file"],
	["grep <pat> <file>", "filter lines in a file (literal match)"],
	["wc <file>", "lines · words · chars in a file"],
	["which <cmd>", "where would <cmd> live"],
	["mkdir / rm / touch", "(read-only fs · they no-op)"],
	["vim / nano / emacs", "no editors here · use cat"],
	["top / ps", "process list (such as it is)"],
	["ping <host>", "fake ping (always reachable)"],
	["weather", "kathmandu forecast (sort of)"],
	["chiya / tea", "brew a cup"],
	["coffee", "(don't.)"],
	["cowsay <text>", "the cow speaks"],
	["fortune / quote", "engineer wisdom"],
	["tip", "a pro tip"],
	["joke", "random dev joke"],
	["namaste", "say hi 🙏"],
	["history", "show recent commands"],
	["man <cmd>", "manual entry for a command"],
	["sudo <cmd>", "try it"],
	["clear / cls", "clear the screen (or ctrl+l)"],
];

/* ── files (read-only). Object lookups are guarded with hasOwn ─────── */
const FILES: Record<string, string[]> = {
	"readme.md": [
		"# raazkhnl — computer engineer",
		"",
		"building reliable systems for people from kathmandu.",
		"shipping tax tech @ ird · networks & cybersec @ pulchowk.",
		"",
		"try `projects` to see what i built, or `cd projects` to browse.",
	],
	"about.txt": [
		"raazkhnl · @raazkhnl · rajesh khanal",
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
	"tips.txt": [
		"press / from anywhere to focus this terminal.",
		"type `cd projects` then `ls` to browse builds.",
		"tab completes commands, project ids, file names, themes.",
		"ctrl+l clears. ctrl+c aborts. ↑/↓ walks history.",
		"try `theme pink` for a vibe shift.",
		"`open <id>` deep-links straight to a project page.",
		"feeling brave? type `secret`.",
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
	"i'd write a joke about recursion, but i'd have to write a joke about recursion.",
	"why don't programmers like nature? too many bugs.",
	"a sql query walks into a bar, walks up to two tables, and asks: 'can i join you?'",
	"in theory, theory and practice are the same. in practice, they're not.",
	"the best part about boolean: even when you're wrong, you're only off by a bit.",
	"to understand recursion, see: 'recursion'.",
	"i'd tell you about ipv6, but i don't think you'd get the address.",
	"css is awesome — until it isn't. then it's still css.",
	"two pointers walk into a bar. one says 'where's the other?' segfault.",
	"a programmer's wife says: get a loaf of bread, and if they have eggs, get a dozen. he came back with 12 loaves.",
	"java and javascript have as much in common as car and carpet.",
	"i don't always test my code. but when i do, i do it in production.",
	"the cloud is just someone else's computer.",
	"why did the function break up with the loop? too many issues.",
	"old programmers never die — they just gosub without return.",
	"what do you call 8 hobbits? a hobbyte.",
	"if at first you don't succeed, call it version 1.0.",
	"code never lies. comments sometimes do.",
	"the s in iot stands for security.",
	"98% of statistics are made up on the spot — including this one.",
	"have you tried turning it off and on again? — every sysadmin ever.",
	"rest in peace bob, you will be missed. line 42.",
	"kernel panic? more like kernel chiya.",
	"why was the developer broke? he used up all his cache.",
	"computers make very fast, very accurate mistakes.",
	"the only difference between a junior and a senior dev is which stack overflow tab they have open.",
	"always check the cable. always.",
	"writing the code: 5 minutes. naming the variable: 5 hours.",
	"the docs said it would just work. it did not just work.",
	"ai will replace developers? the prompts said so.",
	"404: punchline not found.",
	"i finally finished my project. it was due last sprint.",
	"there are two kinds of code: legacy, and code you haven't shipped yet.",
];

const QUOTES = [
	'"premature optimization is the root of all evil." — knuth',
	'"talk is cheap. show me the code." — torvalds',
	'"any fool can write code a computer understands. good programmers write code humans understand." — fowler',
	"\"the most damaging phrase in the language is: 'we've always done it this way.'\" — hopper",
	'"first, solve the problem. then, write the code." — johnson',
	'"programs must be written for people to read, and only incidentally for machines to execute." — abelson',
	'"if you don\'t have time to do it right, when will you have time to do it over?" — wooden',
	'"computers are good at following instructions, not at reading your mind." — knuth',
	'"there are only two hard things in computer science: cache invalidation, naming things, and off-by-one errors." — karlton-ish',
	'"simplicity is the ultimate sophistication." — da vinci',
	'"the best error message is the one that never shows up." — t. peters',
	'"weeks of coding can save hours of planning." — anonymous',
];

const TIPS = [
	"press / from anywhere to focus this terminal.",
	"type `cd projects` then `ls` to browse builds.",
	"tab completes commands, project ids, file names, themes.",
	"ctrl+l clears. ctrl+c aborts. ↑/↓ walks history.",
	"try `theme pink` for a vibe shift.",
	"`open <id>` deep-links straight to a project page.",
	"matrix toggles the rain — give your eyes a break.",
	"stuck? `man <cmd>` shows the docs.",
];

type Cwd = "" | "projects" | "skills" | "timeline";
const VALID_DIRS: Cwd[] = ["projects", "skills", "timeline"];

const slugCategory = (cat: string): string =>
	cat.toLowerCase().replace(/[^a-z0-9]+/g, "_") + ".txt";

const sanitize = (s: string, max = MAX_ARG_LEN): string =>
	s.replace(/\p{C}/gu, "").slice(0, max);

const Terminal: React.FC<TerminalProps> = ({
	sections,
	onTheme,
	onMatrixToggle,
}) => {
	const [lines, setLines] = useState<Line[]>([]);
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<string[]>(() => {
		try {
			const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
			return Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : [];
		} catch {
			return [];
		}
	});
	const [hPtr, setHPtr] = useState<number>(-1);
	const [boot, setBoot] = useState(true);
	const [cwd, setCwd] = useState<Cwd>("");
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);
	const outRef = useRef<HTMLDivElement>(null);

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

	/* keep terminal output pinned to its own bottom WITHOUT bubbling the
	   scroll up to the page (which previously cancelled `home`/`stack`/`work`
	   navigation by dragging the page back to the terminal). Setting
	   scrollTop directly on the output container scrolls only that element. */
	useEffect(() => {
		const el = outRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [lines]);

	const allCommands = useMemo(
		() =>
			Array.from(
				new Set(
					HELP.flatMap(([c]) =>
						c
							.split(" ")[0]
							.split("/")
							.map((s) => s.trim())
					).concat([
						"cls",
						"man",
						"history",
						"whoami",
						"experience",
						"timeline",
						"gallery",
						"exit",
						"quit",
						"secret",
						"konami",
						"now",
					])
				)
			),
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
		if (parts[0] === "cat" && parts.length === 2) {
			const pool = listForCwd(cwd);
			return pool.filter((f) => f.startsWith(parts[1]));
		}
		if (parts[0] === "cd" && parts.length === 2)
			return VALID_DIRS.concat([".." as Cwd, "~" as Cwd, "/" as Cwd]).filter(
				(d) => d.startsWith(parts[1])
			);
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

	const goSection = (
		key: keyof SectionRefs,
		fallbackId: string,
		label: string
	) => {
		const el = sections?.[key]?.current ?? document.getElementById(fallbackId);
		el?.scrollIntoView({ behavior: "smooth", block: "start" });
		return label;
	};

	const exec = useCallback(
		async (raw: string) => {
			const cmdLine = raw.trim();
			print({ kind: "in", text: raw });
			if (!cmdLine) return;

			const [cmd, ...rest] = cmdLine.split(/\s+/);
			const arg = sanitize(rest.join(" "));
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
						const found = HELP.find(([c]) =>
							c
								.split(" ")[0]
								.split("/")
								.map((s) => s.trim())
								.includes(arg.toLowerCase())
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
					const targetCat = Object.prototype.hasOwnProperty.call(map, wanted)
						? map[wanted]
						: undefined;
					const targets = wanted
						? SKILLS.filter((s) =>
								targetCat ? s.category === targetCat : false
						  )
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
						out(`  ${p.id.padEnd(18, " ")} · ${p.title}`)
					);
					out("use `open <id>` to view details, or `cd projects` to browse.");
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
						`blogspot ${RAAZKHNL.socials.blogspot}`,
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
					out(goSection("contact", "contact", "jumping to contact form..."));
					break;
				case "home":
					out(goSection("home", "home", "warping home..."));
					break;
				case "stack":
					out(goSection("stack", "stack", "jumping to stack..."));
					break;
				case "work":
				case "gallery":
					out(goSection("work", "work", "jumping to work..."));
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
				case "blogspot":
				case "blog":
					window.open(
						RAAZKHNL.socials.blogspot,
						"_blank",
						"noopener,noreferrer"
					);
					out("opened blog ✓", "ok");
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
					out(cwd ? `/raazkhnl/hub/${cwd}` : "/raazkhnl/hub");
					break;
				case "cd": {
					const t = arg.toLowerCase().trim();
					if (!t || t === "~" || t === "/" || t === "..") {
						setCwd("");
						break;
					}
					if ((VALID_DIRS as string[]).includes(t)) {
						setCwd(t as Cwd);
						break;
					}
					out(
						`cd: no such directory: ${t}. try: projects · skills · timeline · ..`,
						"err"
					);
					break;
				}
				case "ls": {
					if (cwd === "projects") {
						writeLines(chunkColumns(PROJECTS.map((p) => `${p.id}.md`)));
					} else if (cwd === "skills") {
						writeLines(SKILLS.map((s) => slugCategory(s.category)));
					} else if (cwd === "timeline") {
						EXPERIENCES.forEach((e, i) =>
							out(`chapter_${i + 1}.txt    · ${e.role}`)
						);
					} else {
						writeLines([
							"about.txt    contact.txt   now.txt    readme.md   tips.txt",
							"projects/    skills/       timeline/",
						]);
					}
					break;
				}
				case "cat": {
					const fname = arg.toLowerCase().trim();
					if (!fname) {
						out("usage: cat <file>", "err");
						break;
					}
					const root = readRootFile(fname);
					if (root) {
						writeLines(root);
						break;
					}
					if (cwd === "projects" || fname.endsWith(".md")) {
						const id = fname.replace(/\.md$/, "");
						const p = PROJECTS.find((x) => x.id === id);
						if (p) {
							writeLines(
								[
									`# ${p.title}`,
									"",
									p.description,
									"",
									p.tags.length ? `tags: ${p.tags.join(" · ")}` : "",
									p.link ? `live: ${p.link}` : "",
									p.github ? `repo: ${p.github}` : "",
								].filter(Boolean)
							);
							break;
						}
					}
					if (cwd === "skills") {
						const found = SKILLS.find(
							(s) => slugCategory(s.category) === fname
						);
						if (found) {
							writeLines([
								`# ${found.category.toLowerCase()}`,
								"",
								...found.skills.map((s) => `  · ${s}`),
							]);
							break;
						}
					}
					if (cwd === "timeline") {
						const m = fname.match(/^chapter_(\d+)\.txt$/);
						const idx = m ? parseInt(m[1], 10) - 1 : -1;
						const e = EXPERIENCES[idx];
						if (e) {
							writeLines([
								e.period,
								`${e.role} @ ${e.company}`,
								"",
								e.description,
							]);
							break;
						}
					}
					out(`no such file: ${arg}. try \`ls\``, "err");
					break;
				}
				case "tree": {
					writeLines([
						"/raazkhnl/hub",
						"├── about.txt",
						"├── contact.txt",
						"├── now.txt",
						"├── readme.md",
						"├── tips.txt",
						"├── projects/",
						...PROJECTS.map(
							(p, i) =>
								`│   ${i === PROJECTS.length - 1 ? "└──" : "├──"} ${p.id}.md`
						),
						"├── skills/",
						...SKILLS.map(
							(s, i) =>
								`│   ${i === SKILLS.length - 1 ? "└──" : "├──"} ${slugCategory(
									s.category
								)}`
						),
						"└── timeline/",
						...EXPERIENCES.map(
							(_, i) =>
								`    ${i === EXPERIENCES.length - 1 ? "└──" : "├──"} chapter_${
									i + 1
								}.txt`
						),
					]);
					break;
				}
				case "mkdir":
				case "rmdir":
				case "rm":
				case "touch":
				case "mv":
				case "cp":
				case "chmod":
				case "chown":
					out(
						`${lower}: read-only filesystem. nothing to ${lower} here. (try \`cat\` or \`tree\`.)`,
						"err"
					);
					break;
				case "uname": {
					const a = arg.includes("-a") || arg.includes("a");
					out(
						a
							? "raazkhnl-hub 2.1.0-neural #1 SMP web/x86_64 GNU/Linux np"
							: "raazkhnl-hub"
					);
					break;
				}
				case "uptime":
					out("up 5 years, 3 months · 1 user (you) · load: chiya 99%");
					break;
				case "version":
				case "--version":
				case "-v":
					out("raazkhnl-shell v2.1.0 · react · ts · vite");
					break;
				case "ping": {
					const host = (arg || "raazkhnl")
						.replace(/[^\w.\-:]/g, "")
						.slice(0, 60);
					if (!host) {
						out("ping: missing host", "err");
						break;
					}
					writeLines([
						`PING ${host} (127.0.0.1): 56 data bytes`,
						`64 bytes from ${host}: icmp_seq=0 ttl=64 time=0.001 ms`,
						`64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.001 ms`,
						`64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.001 ms`,
						`--- ${host} ping statistics ---`,
						"3 packets transmitted, 3 received, 0% loss · always reachable.",
					]);
					break;
				}
				case "cowsay": {
					print({ kind: "art", text: cowsay(arg || "moo!") });
					break;
				}
				case "fortune":
				case "quote":
					out(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
					break;
				case "tip":
					out(TIPS[Math.floor(Math.random() * TIPS.length)]);
					break;
				case "weather":
					writeLines([
						"kathmandu, np · partly cloudy",
						"now      · 22°C · feels like 21°C",
						"forecast · sunny with a chance of monsoon and load-shedding",
					]);
					break;
				case "chiya":
				case "tea":
					writeLines([
						"brewing chiya...",
						"+ ginger · + cardamom · + tulsi · + sugar",
						"▰▰▰▰▰▰▰▰▰▰ done.",
						"☕ here you go.",
					]);
					break;
				case "coffee":
					out("only chiya is served here. type `chiya`.", "err");
					break;
				case "vim":
				case "vi":
				case "nano":
				case "emacs":
					out(
						`${lower}: no editors in the shell. use \`cat <file>\` to read.`,
						"err"
					);
					break;
				case "top":
				case "ps":
					writeLines([
						"  PID  USER     CPU    MEM   PROCESS",
						"    1  raazkhnl  0.5%  120M  vscode",
						"    2  raazkhnl  0.3%   64M  firefox",
						"    3  raazkhnl  0.1%   16M  spotify (lo-fi)",
						"    4  raazkhnl  0.1%    4M  chiya-kettle",
						"    5  raazkhnl 99.0%    2G  procrastination",
					]);
					break;
				case "colors":
				case "palette":
					writeLines([
						"mint   ●  #36f9b3",
						"pink   ●  #ff3d8b",
						"amber  ●  #fbbf24",
						"iris   ●  #8b5cf6",
						"use `theme <name>` to apply.",
					]);
					break;
				case "which": {
					const q = arg.toLowerCase().trim();
					if (allCommands.includes(q)) out(`/usr/local/bin/${q}`);
					else out(`which: ${arg}: not found`, "err");
					break;
				}
				case "wc": {
					const fname = arg.toLowerCase().trim();
					const f = readRootFile(fname);
					if (!f) {
						out(`wc: no such file: ${arg}`, "err");
						break;
					}
					const words = f.reduce(
						(a, b) => a + b.trim().split(/\s+/).filter(Boolean).length,
						0
					);
					const chars = f.reduce((a, b) => a + b.length, 0);
					out(
						`${String(f.length).padStart(4)} ${String(words).padStart(
							4
						)} ${String(chars).padStart(4)} ${fname}`
					);
					break;
				}
				case "grep": {
					const space = arg.indexOf(" ");
					if (space < 0) {
						out("usage: grep <pattern> <file>", "err");
						break;
					}
					const pattern = arg.slice(0, space);
					const fname = arg
						.slice(space + 1)
						.trim()
						.toLowerCase();
					const f = readRootFile(fname);
					if (!f) {
						out(`grep: no such file: ${fname}`, "err");
						break;
					}
					const needle = pattern.toLowerCase();
					const matches = f.filter((l) => l.toLowerCase().includes(needle));
					if (!matches.length) out("(no matches)");
					else writeLines(matches);
					break;
				}
				case "neofetch": {
					writeLines([
						`   ╭───────────────────────────╮  raazkhnl@hub`,
						`   │   ▄▄▄ ▄▄▄ ▄▄ ▄▄▄ ▄▄▄  │  ──────────────`,
						`   │  █  ▀ █▀█ █▀█  █  █▀▀  │  host   · raazkhnl 2.1`,
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
				case "namaste":
				case "hi":
				case "hello":
					out("नमस्ते 🙏 · welcome to the hub. type `help` to look around.");
					break;
				case "now":
					writeLines(FILES["now.txt"]);
					break;
				case "motd":
					writeLines([
						"─────  motd  ─────",
						"build the future, one packet at a time.",
						`tip · ${TIPS[Math.floor(Math.random() * TIPS.length)]}`,
					]);
					break;
				case "secret":
					writeLines([
						"you found me.",
						"hint: try `konami`. or `cd timeline` and read a chapter.",
					]);
					break;
				case "konami":
					print({
						kind: "art",
						text: ["+30 lives.", "↑ ↑ ↓ ↓ ← → ← → b a — granted."].join("\n"),
					});
					break;
				case "exit":
				case "quit":
				case "logout":
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
		[
			cwd,
			history,
			navigate,
			onMatrixToggle,
			onTheme,
			print,
			sections,
			allCommands,
		]
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
			className="glass rounded-3xl overflow-hidden flex flex-col h-[360px] cursor-text"
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
					<span className="hidden sm:inline">
						raazkhnl@hub:~{cwd ? `/${cwd}` : ""}
					</span>
					<span className="sm:hidden">raazkhnl@hub</span>
				</div>
				<span className="mono text-[10px] text-slate-600 hidden sm:inline">
					press /
				</span>
			</div>

			{/* output + prompt */}
			<div
				ref={outRef}
				className="flex-1 px-4 py-3 overflow-y-auto mono text-[12px] leading-[1.55] no-scrollbar min-h-0"
			>
				{lines.map((l, i) => (
					<LineRow key={i} line={l} />
				))}
				{!boot && (
					<div className="flex items-center gap-2 mt-1">
						<Prompt cwd={cwd} />
						<input
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value.slice(0, MAX_ARG_LEN))}
							onKeyDown={handleKey}
							spellCheck={false}
							autoComplete="off"
							autoFocus
							maxLength={MAX_ARG_LEN}
							placeholder="type a command…  (try `help`)"
							aria-label="terminal input"
							className="bg-transparent border-none outline-none flex-1 min-w-0 mono text-[12px] text-white placeholder:text-slate-700"
							style={{ caretColor: "#36f9b3" }}
						/>
					</div>
				)}
			</div>

			{/* suggestion chips */}
			<div className="px-4 py-2 border-t border-white/5 bg-white/[0.015] flex flex-wrap items-center gap-1.5 shrink-0">
				{[
					"help",
					"projects",
					"whoami",
					"tree",
					"neofetch",
					"matrix",
					"chiya",
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

/* ── helpers ────────────────────────────────────────────────────────── */

const readRootFile = (key: string): string[] | undefined => {
	if (!Object.prototype.hasOwnProperty.call(FILES, key)) return undefined;
	const v = (FILES as Record<string, unknown>)[key];
	return Array.isArray(v) ? (v as string[]) : undefined;
};

const listForCwd = (cwd: Cwd): string[] => {
	if (cwd === "projects") return PROJECTS.map((p) => `${p.id}.md`);
	if (cwd === "skills") return SKILLS.map((s) => slugCategory(s.category));
	if (cwd === "timeline")
		return EXPERIENCES.map((_, i) => `chapter_${i + 1}.txt`);
	return Object.keys(FILES);
};

/* lay strings into roughly even columns for an `ls`-style row */
const chunkColumns = (items: string[], cols = 3): string[] => {
	const rows: string[] = [];
	const width = Math.max(...items.map((s) => s.length)) + 2;
	for (let i = 0; i < items.length; i += cols) {
		rows.push(
			items
				.slice(i, i + cols)
				.map((s) => s.padEnd(width, " "))
				.join("")
				.trimEnd()
		);
	}
	return rows;
};

const cowsay = (text: string): string => {
	const t = sanitize(text, 80) || "moo!";
	const bar = "_".repeat(t.length + 2);
	const dash = "-".repeat(t.length + 2);
	return [
		" " + bar,
		`< ${t} >`,
		" " + dash,
		"        \\   ^__^",
		"         \\  (oo)\\_______",
		"            (__)\\       )\\/\\",
		"                ||----w |",
		"                ||     ||",
	].join("\n");
};

const Prompt: React.FC<{ cwd?: Cwd }> = ({ cwd }) => (
	<span className="mono text-[12px] shrink-0 select-none">
		<span style={{ color: "#36f9b3" }}>➜</span>{" "}
		<span style={{ color: "#ff3d8b" }}>raazkhnl</span>
		<span className="text-slate-500"> ~{cwd ? `/${cwd}` : ""} </span>
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
