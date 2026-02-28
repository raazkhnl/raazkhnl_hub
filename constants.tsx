
import { Project, Experience, SkillCategory } from './types';

export const RAJESH_DATA = {
  name: "Rajesh Khanal",
  displayName: "RaaZ",
  title: "Computer Engineer | Full Stack & Machine Learning",
  location: "Kathmandu, Nepal",
  origin: "Daldale, Nawalparasi East",
  phone: "+977-9863244500",
  email: "raazkhnl@gmail.com",
  bio: "Seeking a challenging position in software development to leverage my expertise in full stack development and machine learning. Aiming to contribute to innovative projects that enhance user experiences through visually engaging and user-centric applications.",
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
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800",
    github: "https://github.com/raazkhnl/zomec-ai"
  },
  {
    id: "code4pro",
    title: "Code4pro",
    description: "Stress management app integrating Polar360 sensors for real-time performance analytics.",
    tags: ["React Native", "Python", "IoT", "Sensors"],
    image: "https://cdn.pixabay.com/photo/2024/02/09/15/22/ai-generated-8563259_1280.jpg",
    github: "https://github.com/raazkhnl/code4pro"
  },
  {
    id: "wranalytics",
    title: "Wranalytics.org",
    description: "Big data analytics for oil/gas leases, handling millions of records with OpenSearch.",
    tags: ["React", "Python", "OpenSearch", "Analytics"],
    image: "https://cdn.pixabay.com/photo/2021/10/11/17/36/technology-6701404_1280.jpg",
    github: "https://github.com/raazkhnl/wranalytics"
  },
  {
    id: "dasro",
    title: "Dasro.ca",
    description: "AI-enhanced job discovery platform reducing user screen time by 30%.",
    tags: ["React", "Python", "NLP", "UX"],
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800",
    github: "https://github.com/raazkhnl/dasro"
  },
  {
    id: "facial",
    title: "Facial Recognition Attendance",
    description: "AI system for student attendance using machine learning and webcams.",
    tags: ["Python", "React", "Express", "ML"],
    image: "https://media.istockphoto.com/id/2084953046/photo/neural-network-nodes-deep-learning-artificial-intelligence-machine-learning-model.jpg?s=612x612&w=0&k=20&c=wuJff7Fb-RiwuhN-lXYiVgvZWjX8NZUhMzEBXg3S5XM=",
    github: "https://github.com/raazkhnl/facial-attendance"
  },
  {
    id: "abc",
    title: "ABC App",
    description: "Portal with full CRUD, OTP authentication, and AWS deployment (EC2/S3).",
    tags: ["Next.js", "Express", "AWS", "MongoDB"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    github: "https://github.com/raazkhnl/abc-app"
  },
  {
    id: "ann",
    title: "Portfolio Optimization ANN",
    description: "ML model to analyze and optimize investment portfolios for risk/reward.",
    tags: ["Python", "ANN", "Finance"],
    image: "https://cdn.pixabay.com/photo/2016/11/23/14/37/blur-1853262_1280.jpg",
    github: "https://github.com/raazkhnl/portfolio-optimization-ann"
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
    description: "Remote. Developed backend and frontend systems using Python, Vite React, and Material UI. Integrated AI models for user profile matching and CV parsing. Worked on mobile applications using React Native and Python backend. Provided data analytics solutions and improved user experience in job discovery platforms, reducing screen time by 30%."
  },
  {
    company: "IOE Pulchowk Campus",
    role: "Bachelor of Computer Engineering",
    period: "2019 - 2024",
    description: "Lalitpur, Nepal. Percentage: 73%."
  },
  {
    company: "Orchid English Secondary School",
    role: "+2 Science",
    period: "2017 - 2019",
    description: "Nepal. CGPA: 3.13."
  }
];
