// ===========================================
// Resume Types
// ===========================================

// Language proficiency entry
export interface LanguageEntry {
  name: string;
  level: string;
}

// Work experience entry
export interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

// Education entry
export interface EducationEntry {
  school: string;
  degree: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

// Resume data used by templates
export interface ResumeData {
  id: string;
  title: string;
  slug: string;
  fullName: string;
  jobTitle?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  linkedin?: string | null;
  photoUrl?: string | null;
  objective?: string | null;
  skills: string[];
  languages: LanguageEntry[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  templateId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Template component props
export interface ResumeTemplateProps {
  data: ResumeData;
  className?: string;
}

// Template definition
export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  component: React.ComponentType<ResumeTemplateProps>;
}

// Form input types
export interface CreateResumeInput {
  title?: string;
  fullName: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  photoUrl?: string;
  objective?: string;
  skills?: string[];
  languages?: LanguageEntry[];
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  templateId?: string;
  isPublic?: boolean;
}

export interface UpdateResumeInput {
  title?: string;
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  photoUrl?: string;
  objective?: string;
  skills?: string[];
  languages?: LanguageEntry[];
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  templateId?: string;
  isPublic?: boolean;
}
