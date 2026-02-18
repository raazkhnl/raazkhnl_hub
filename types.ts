
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  image: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}
