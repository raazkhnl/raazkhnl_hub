
import { Project, Experience, SkillCategory } from './types';

export const RAJESH_DATA = {
  name: "Rajesh Khanal",
  displayName: "RaaZ",
  title: "Computer Engineer | Full Stack & Machine Learning",
  location: "Kathmandu, Nepal",
  origin: "Daldale, Nawalparasi East",
  phone: "+977-9863244500",
  email: "raazkhnl@gmail.com",
  bio: "Computer Engineer from IOE Pulchowk. I build high-performance systems and AI-powered solutions that enhance user experiences. Specialized in bridging the gap between hardware and software.",
  socials: {
    github: "https://github.com/raazkhnl",
    linkedin: "https://linkedin.com/in/raazkhnl",
    email: "raazkhnl@gmail.com",
    phone: "+977-9863244500",
    website: "https://khanalrajesh.com.np"
  }
};

export const PROJECTS: Project[] = [
  {
    id: "zomec",
    title: "Zomec.ai",
    description: "Job matching platform using GPT & Text Kernel for profile parsing and precise matching.",
    tags: ["Python", "Vite", "React", "MUI", "GPT"],
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "code4pro",
    title: "Code4pro",
    description: "Stress management app integrating Polar360 sensors for real-time performance analytics.",
    tags: ["React Native", "Python", "IoT", "Sensors"],
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "wranalytics",
    title: "Wranalytics.org",
    description: "Big data analytics for oil/gas leases, handling millions of records with OpenSearch.",
    tags: ["React", "Python", "OpenSearch", "Analytics"],
    image: "https://images.unsplash.com/photo-1518186239717-2e9b13674403?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "dasro",
    title: "Dasro.ca",
    description: "AI-enhanced job discovery platform reducing user screen time by 30%.",
    tags: ["React", "Python", "NLP", "UX"],
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "facial",
    title: "Facial Recognition Attendance",
    description: "AI system for student attendance using machine learning and webcams.",
    tags: ["Python", "React", "Express", "ML"],
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "abc",
    title: "ABC App",
    description: "Portal with full CRUD, OTP authentication, and AWS deployment (EC2/S3).",
    tags: ["Next.js", "Express", "AWS", "MongoDB"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "ann",
    title: "Portfolio Optimization ANN",
    description: "ML model to analyze and optimize investment portfolios for risk/reward.",
    tags: ["Python", "ANN", "Finance"],
    image: "https://images.unsplash.com/photo-1611974714658-9730596350d7?auto=format&fit=crop&q=80&w=800"
  }
];

export const SKILLS: SkillCategory[] = [
  {
    category: "Engines & Languages",
    skills: ["Python", "JavaScript", "C/C++", "PHP", "Assembly"]
  },
  {
    category: "Frameworks & UI",
    skills: ["React", "Next.js", "Django", "Laravel", "React Native", "Material UI", "Tailwind"]
  },
  {
    category: "Cloud & Ops",
    skills: ["AWS EC2/S3", "Express", "Node.js", "MongoDB", "MySQL", "OpenSearch", "Git"]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    company: "Belvy LLC",
    role: "Software Developer",
    period: "2024 - Present",
    description: "Remote. Developing full-stack systems, integrating AI models for user profiling, and optimizing job discovery platforms."
  },
  {
    company: "IOE Pulchowk Campus",
    role: "BE Computer Engineering",
    period: "2019 - 2024",
    description: "Academic focus on AI and Software Architecture. Achieved 73% aggregate."
  },
  {
    company: "Samsung Innovation Campus",
    role: "Python Programming Trainee",
    period: "2023",
    description: "Certified training in advanced Python and innovative software practices."
  }
];
