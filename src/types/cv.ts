export interface Experience {
  company: string;
  time: string;
  title: string;
  location?: string;
  description?: string;
}

export type InternshipBrand = 'adobe' | 'roblox';

export interface Internship extends Experience {
  brand: InternshipBrand;
  office?: string;
  current?: boolean;
}

export interface Education {
  school: string;
  time: string;
  degree: string;
  location?: string;
  description?: string;
}

export interface Skill {
  title: string;
  description: string;
}

export function isExperience(element: Experience | Education): element is Experience {
  return 'title' in element && 'company' in element;
}

export function isEducation(element: Education | Experience): element is Education {
  return 'school' in element && 'degree' in element;
}
