import type { ResumeTemplate } from '@/types/resume';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ATSFriendlyTemplate } from './ATSFriendlyTemplate';
import { MinimalTemplate } from './MinimalTemplate';

// Template registry - add new templates here
export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'professional',
    name: 'Professional',
    thumbnail: '/templates/professional.png',
    component: ProfessionalTemplate,
  },
  {
    id: 'modern',
    name: 'Modern',
    thumbnail: '/templates/modern.png',
    component: ModernTemplate,
  },
  {
    id: 'creative',
    name: 'Creative',
    thumbnail: '/templates/creative.png',
    component: CreativeTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    thumbnail: '/templates/minimal.png',
    component: MinimalTemplate,
  },
  {
    id: 'ats-friendly',
    name: 'ATS Friendly',
    thumbnail: '/templates/ats-friendly.png',
    component: ATSFriendlyTemplate,
  },
];

// Get template by ID
export function getTemplateById(id: string): ResumeTemplate | undefined {
  return RESUME_TEMPLATES.find((t) => t.id === id);
}

// Get default template
export function getDefaultTemplate(): ResumeTemplate {
  return RESUME_TEMPLATES[0];
}

export {
  ProfessionalTemplate,
  ModernTemplate,
  CreativeTemplate,
  ATSFriendlyTemplate,
  MinimalTemplate,
};
