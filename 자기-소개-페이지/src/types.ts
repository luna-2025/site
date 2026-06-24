/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeColor = 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber' | 'sky';

export interface SkillItem {
  name: string;
  level: number; // 1 to 5 (or 20% to 100%)
}

export interface SkillCategory {
  id: string;
  category: string;
  list: SkillItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  period: string;
  description: string;
  details: string; // Long markdown or multiline text
  tags: string[];
  image: string;
  link?: string;
  github?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface GuestbookMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isPrivate?: boolean;
}

export interface ProfileData {
  name: string;
  englishName: string;
  title: string;
  bio: string;
  introduction: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  blog: string;
  linkedin: string;
  themeColor: ThemeColor;
  skills: SkillCategory[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  guestbook: GuestbookMessage[];
}
