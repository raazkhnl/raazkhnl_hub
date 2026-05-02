/**
 * Static portfolio data: profile, projects, skills, timeline.
 * Edit this file to update the site content — no other changes required.
 *
 * Every project link points to a real public repo on github.com/raazkhnl;
 * if you remove or rename a repo, update the entry here so the link stays valid.
 */
import { resume } from "react-dom/server";
import { Project, Experience, SkillCategory } from "./types";

export const RAAZKHNL = {
	name: "Rajesh Khanal",
	displayName: "raazkhnl",
	title: "Computer Engineer · Gov of Nepal · IRD",
	location: "Kathmandu, Nepal",
	origin: "Daldale, Nawalparasi East",
	phone: "+977-9863244500",
	email: "raazkhnl@gmail.com",
	bio: "i’m a computer engineer building reliable systems for people. shipping tax tech at the inland revenue department by day, chasing networks & cybersecurity at pulchowk by night. i love prototypes, weird ml, and beautiful interfaces.",
	socials: {
		github: "https://github.com/raazkhnl",
		linkedin: "https://linkedin.com/in/raazkhnl",
		email: "raazkhnl@gmail.com",
		phone: "+977-9863244500",
		website: "https://khanalrajesh.com.np",
		blogspot: "https://raazkhnl.blogspot.com",
		resume:
			"https://drive.google.com/file/d/1NlHceRr-VpxUyUzdX0nhSfbaG_O7blH0/view",
	},
};

/**
 * Featured projects.
 *  - Top three are products I contributed to / shipped at Belvy LLC; they are
 *    proprietary so they expose `link` (the live product URL) instead of `github`.
 *  - The rest are personal public repos on github.com/raazkhnl with verified
 *    `github` URLs.
 *
 * Add/replace by checking https://github.com/raazkhnl?tab=repositories or by
 * dropping a new entry above with a `link` field for live products.
 */
export const PROJECTS: Project[] = [
	{
		id: "zomec",
		title: "Zomec.ai",
		description:
			"AI-powered job matching platform — GPT + Text Kernel for profile parsing and precise candidate-role fit. Shipped at Belvy LLC.",
		tags: ["React", "Python", "GPT", "MUI", "Belvy"],
		image:
			"https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1000",
		link: "https://app.zomec.ai/",
	},
	{
		id: "dasro",
		title: "Dasro.ca",
		description:
			"AI-enhanced job discovery platform — surfaced the right roles faster, reducing user screen time by 30%. Shipped at Belvy LLC.",
		tags: ["React", "Python", "NLP", "UX", "Belvy"],
		image:
			"https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1000",
		link: "https://www.dasro.ca/jobseeker",
	},
	{
		id: "code4pro",
		title: "Code4Pro",
		description:
			"React Native mobile app for stress management — integrates Polar 360 sensors for real-time performance analytics. Shipped at Belvy LLC.",
		tags: ["React Native", "Python", "IoT", "Sensors", "Belvy"],
		image:
			"https://cdn.pixabay.com/photo/2024/02/09/15/22/ai-generated-8563259_1280.jpg",
		link: "https://www.code4pro.com/",
	},
	{
		id: "ndhrms",
		title: "NDHRMS",
		description:
			"Nepal Digital HR Management System — modernizing HR workflows across public institutions. Built for clarity, audit, and scale.",
		tags: ["TypeScript", "Next.js", "React", "Gov"],
		image:
			"https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
		github: "https://github.com/raazkhnl/NDHRMS",
		link: "https://ndhrms-app.vercel.app/",
	},
	{
		id: "queueless",
		title: "QueueLess",
		description:
			"Production-ready multi-branch appointment booking system. Tame queues, free up the day — for staff and customers both.",
		tags: ["TypeScript", "React", "Node.js", "Booking"],
		image:
			"https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000",
		github: "https://github.com/raazkhnl/QueueLess",
		link: "https://queueless-nepal.vercel.app",
	},
	{
		id: "rk-word-editor",
		title: "rk-word-editor",
		description:
			"A fully functional word editor in the browser. Familiar feel, zero install — formatting, lists, exports, the works.",
		tags: ["TypeScript", "React", "Editor"],
		image:
			"https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000",
		github: "https://github.com/raazkhnl/rk-word-editor",
		link: "https://www.npmjs.com/package/@raazkhnl/rk-editor-ui",
	},
	{
		id: "whatsup",
		title: "whatsup",
		description:
			"share your day — a small, expressive social space for the moments worth noting and the people worth telling.",
		tags: ["TypeScript", "React", "Social"],
		image:
			"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1000",
		github: "https://github.com/raazkhnl/whatsup",
		link: "https://whatsup-plum.vercel.app",
	},
	{
		id: "neon-invasion",
		title: "Neon Invasion",
		description:
			"A retro-style, space-themed shooter game. Made for the love of arcade vibes and bright pixels.",
		tags: ["HTML5", "Canvas", "Game"],
		image:
			"https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
		github: "https://github.com/raazkhnl/neon-invasion",
	},
	{
		id: "facial-attendance",
		title: "Facial Attendance",
		description:
			"AI-powered student attendance using webcams and a lightweight ML pipeline. Roll calls without the roll call.",
		tags: ["Python", "ML", "Computer Vision", "React"],
		image:
			"https://media.istockphoto.com/id/2084953046/photo/neural-network-nodes-deep-learning-artificial-intelligence-machine-learning-model.jpg?s=612x612&w=0&k=20&c=wuJff7Fb-RiwuhN-lXYiVgvZWjX8NZUhMzEBXg3S5XM=",
		github: "https://github.com/raazkhnl/facial_attendance",
	},
	{
		id: "abc-app",
		title: "ABC App",
		description:
			"Portal with full CRUD, OTP authentication, and an AWS deployment story (EC2/S3) under the hood.",
		tags: ["Next.js", "Express", "MongoDB", "AWS"],
		image:
			"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
		github: "https://github.com/raazkhnl/abc-app",
	},
	{
		id: "inote",
		title: "iNote",
		description:
			"your notes on the cloud — quick capture, sync, and find them again later, on any device.",
		tags: ["JavaScript", "React", "Notes", "Cloud"],
		image:
			"https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1000",
		github: "https://github.com/raazkhnl/iNote",
	},
];

export const SKILLS: SkillCategory[] = [
	{
		category: "Engines & Languages",
		skills: ["Python", "JavaScript", "TypeScript", "C/C++", "PHP", "Bash"],
	},
	{
		category: "Frameworks & UI",
		skills: [
			"React",
			"Next.js",
			"Django",
			"Laravel",
			"React Native",
			"Tailwind",
			"Material UI",
		],
	},
	{
		category: "Cloud & Ops",
		skills: [
			"AWS EC2/S3",
			"Node.js",
			"Express",
			"MongoDB",
			"MySQL",
			"OpenSearch",
			"Linux",
			"Git",
		],
	},
];

export const EXPERIENCES: Experience[] = [
	{
		company: "Pulchowk Campus",
		role: "M.E. Computer Engineering · Networks & Cyber Security",
		period: "2026 — Present",
		description: "Specializing in networks & cybersecurity. Lalitpur, Nepal.",
	},
	{
		company: "Inland Revenue Department · Gov of Nepal",
		role: "Computer Engineer",
		period: "2025 — Present",
		description:
			"Building reliable, hassle-free tax systems for the people of Nepal. Modernizing platforms that taxpayers and officers rely on every day.",
	},
	{
		company: "Belvy LLC | Code4Pro",
		role: "Software Developer",
		period: "2024 — 2025",
		description:
			"Remote. Built backend and frontend systems with Python, React, React Native and Material UI. Integrated AI for profile-matching, CV parsing, and analytics. Delivered Code4Pro — a sensor-driven stress-management product.",
	},
	{
		company: "IOE Pulchowk Campus",
		role: "B.E. Computer Engineering",
		period: "2019 — 2024",
		description:
			"Lalitpur, Nepal. Foundations in systems, networks, ML, and software engineering.",
	},
];
