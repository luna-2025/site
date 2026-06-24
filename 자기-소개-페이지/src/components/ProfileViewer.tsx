/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, MapPin, Github, Globe, Link2, ExternalLink, 
  ChevronRight, Sparkles, MessageSquare, Copy, Check, Calendar, 
  Layers, Briefcase, User, Send, Trash2, Heart, Award, Star
} from 'lucide-react';
import { ProfileData, ProjectItem, GuestbookMessage } from '../types';

interface ProfileViewerProps {
  profile: ProfileData;
  onAddGuestbookMessage: (sender: string, message: string) => void;
  onDeleteGuestbookMessage: (id: string) => void;
  onToggleEditMode: () => void;
}

export default function ProfileViewer({
  profile,
  onAddGuestbookMessage,
  onDeleteGuestbookMessage,
  onToggleEditMode
}: ProfileViewerProps) {
  const [activeTab, setActiveTab] = useState<'intro' | 'skills' | 'projects' | 'experience' | 'guestbook'>('intro');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [copiedText, setCopiedText] = useState<'email' | 'phone' | null>(null);
  
  // Guestbook form states
  const [senderName, setSenderName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const colors = {
    indigo: {
      primary: 'bg-indigo-600 dark:bg-indigo-500',
      primaryText: 'text-indigo-600 dark:text-indigo-400',
      hover: 'hover:bg-indigo-700 dark:hover:bg-indigo-600',
      border: 'border-indigo-600 dark:border-indigo-500',
      ring: 'focus:ring-indigo-500',
      gradient: 'from-indigo-600 to-violet-600',
      lightBg: 'bg-indigo-50 dark:bg-indigo-950/20',
      lightText: 'text-indigo-700 dark:text-indigo-300',
      bullet: 'bg-indigo-500',
    },
    emerald: {
      primary: 'bg-emerald-600 dark:bg-emerald-500',
      primaryText: 'text-emerald-600 dark:text-emerald-400',
      hover: 'hover:bg-emerald-700 dark:hover:bg-emerald-600',
      border: 'border-emerald-600 dark:border-emerald-500',
      ring: 'focus:ring-emerald-500',
      gradient: 'from-emerald-600 to-teal-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/20',
      lightText: 'text-emerald-700 dark:text-emerald-300',
      bullet: 'bg-emerald-500',
    },
    violet: {
      primary: 'bg-violet-600 dark:bg-violet-500',
      primaryText: 'text-violet-600 dark:text-violet-400',
      hover: 'hover:bg-violet-700 dark:hover:bg-violet-600',
      border: 'border-violet-600 dark:border-violet-500',
      ring: 'focus:ring-violet-500',
      gradient: 'from-violet-600 to-fuchsia-600',
      lightBg: 'bg-violet-50 dark:bg-violet-950/20',
      lightText: 'text-violet-700 dark:text-violet-300',
      bullet: 'bg-violet-500',
    },
    rose: {
      primary: 'bg-rose-600 dark:bg-rose-500',
      primaryText: 'text-rose-600 dark:text-rose-400',
      hover: 'hover:bg-rose-700 dark:hover:bg-rose-600',
      border: 'border-rose-600 dark:border-rose-500',
      ring: 'focus:ring-rose-500',
      gradient: 'from-rose-600 to-pink-600',
      lightBg: 'bg-rose-50 dark:bg-rose-950/20',
      lightText: 'text-rose-700 dark:text-rose-300',
      bullet: 'bg-rose-500',
    },
    amber: {
      primary: 'bg-amber-600 dark:bg-amber-500',
      primaryText: 'text-amber-600 dark:text-amber-400',
      hover: 'hover:bg-amber-700 dark:hover:bg-amber-600',
      border: 'border-amber-600 dark:border-amber-500',
      ring: 'focus:ring-amber-500',
      gradient: 'from-amber-600 to-orange-500',
      lightBg: 'bg-amber-50 dark:bg-amber-950/20',
      lightText: 'text-amber-700 dark:text-amber-300',
      bullet: 'bg-amber-500',
    },
    sky: {
      primary: 'bg-sky-600 dark:bg-sky-500',
      primaryText: 'text-sky-600 dark:text-sky-400',
      hover: 'hover:bg-sky-700 dark:hover:bg-sky-600',
      border: 'border-sky-600 dark:border-sky-500',
      ring: 'focus:ring-sky-500',
      gradient: 'from-sky-600 to-blue-500',
      lightBg: 'bg-sky-50 dark:bg-sky-950/20',
      lightText: 'text-sky-700 dark:text-sky-300',
      bullet: 'bg-sky-500',
    }
  };

  const activeColor = colors[profile.themeColor] || colors.indigo;

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !guestMessage.trim()) return;
    onAddGuestbookMessage(senderName, guestMessage);
    setSenderName('');
    setGuestMessage('');
    setIsSubmitSuccess(true);
    setTimeout(() => setIsSubmitSuccess(false), 3000);
  };

  const getSkillBadge = (level: number) => {
    switch (level) {
      case 5: return { label: 'Master', style: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' };
      case 4: return { label: 'Expert', style: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300' };
      case 3: return { label: 'Proficient', style: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' };
      case 2: return { label: 'Advanced', style: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' };
      default: return { label: 'Beginner', style: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch (e) {
      return '방금 전';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" id="profile-viewer-container">
      {/* Hero Banner Section */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${activeColor.gradient} p-8 text-white shadow-xl md:p-12`} id="profile-hero">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        
        <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-start" id="hero-grid">
          {/* Avatar Container */}
          <div className="relative flex-shrink-0" id="avatar-container">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/30 bg-white/20 shadow-lg backdrop-blur-sm md:h-40 md:w-40">
              <img 
                src={profile.avatar} 
                alt={`${profile.name} 프로필 이미지`} 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 rounded-full bg-yellow-400 p-2 text-gray-900 shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          {/* Intro Information */}
          <div className="flex-1 text-center md:text-left space-y-4" id="hero-info">
            <div className="space-y-2">
              <p className="text-sm font-semibold tracking-wider text-white/80 uppercase">
                {profile.englishName}
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                {profile.name}
              </h1>
              <p className="text-lg font-medium text-white/90">
                {profile.title}
              </p>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
              {profile.bio}
            </p>

            {/* Quick Contacts */}
            <div className="flex flex-wrap justify-center gap-3 md:justify-start" id="quick-links">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {profile.blog && (
                <a href={profile.blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105">
                  <Globe className="h-4 w-4" /> Tech Blog
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105">
                  <Link2 className="h-4 w-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-4 z-40 flex items-center justify-between rounded-full border border-gray-200/80 bg-white/80 p-1.5 shadow-lg backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/80" id="viewer-nav">
        <div className="flex flex-wrap gap-1 md:gap-2">
          {[
            { id: 'intro', label: '소개', icon: User },
            { id: 'skills', label: '보유 기술', icon: Layers },
            { id: 'projects', label: '프로젝트', icon: Award },
            { id: 'experience', label: '이력 & 경험', icon: Briefcase },
            { id: 'guestbook', label: '방명록', icon: MessageSquare }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all md:text-sm ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className={`absolute inset-0 rounded-full ${activeColor.primary}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onToggleEditMode}
          id="btn-edit-mode-toggle"
          className={`mr-2 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 ${activeColor.primary} ${activeColor.hover}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          프로필 편집하기
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px] rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-900 dark:bg-gray-950 md:p-8" id="viewer-main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'intro' && (
            <motion.div
              key="intro-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid gap-8 md:grid-cols-3"
              id="intro-section"
            >
              {/* Left Column: Personal Metadata */}
              <div className="space-y-6 md:col-span-1" id="intro-metadata">
                <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/50 space-y-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
                    <User className={`h-4 w-4 ${activeColor.primaryText}`} /> Personal Info
                  </h3>
                  
                  <div className="space-y-3.5 text-sm">
                    {/* Email */}
                    <div className="group space-y-1">
                      <span className="text-xs text-gray-400 block">이메일</span>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-gray-700 dark:text-gray-300 break-all">{profile.email}</span>
                        <button 
                          onClick={() => copyToClipboard(profile.email, 'email')}
                          className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 transition"
                          title="이메일 복사"
                        >
                          {copiedText === 'email' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="group space-y-1">
                      <span className="text-xs text-gray-400 block">연락처</span>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-gray-700 dark:text-gray-300">{profile.phone}</span>
                        <button 
                          onClick={() => copyToClipboard(profile.phone, 'phone')}
                          className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 transition"
                          title="연락처 복사"
                        >
                          {copiedText === 'phone' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 block">활동 지역</span>
                      <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Highlights / Values */}
                <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/50 space-y-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
                    <Star className={`h-4 w-4 text-amber-500`} /> core Values
                  </h3>
                  <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${activeColor.primary}`} />
                      <span><strong>사용자 우선:</strong> 항상 실사용자의 소리와 데이터에 집중해 UI를 만듭니다.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${activeColor.primary}`} />
                      <span><strong>지속적인 배움:</strong> 기술 부채에 타협하지 않고 트렌드와 본질을 학습합니다.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${activeColor.primary}`} />
                      <span><strong>열린 의사소통:</strong> 투명한 정보 공유와 존중하는 태도로 팀워크를 극대화합니다.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Detailed Story Introduction */}
              <div className="md:col-span-2 space-y-6" id="intro-story">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    소개글
                  </h2>
                  <div className="text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap space-y-4">
                    {profile.introduction}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 dark:border-gray-900">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/40">
                      <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">
                        {profile.projects.length}개
                      </span>
                      <span className="text-xs text-gray-400">수행 프로젝트</span>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/40">
                      <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">
                        {profile.skills.reduce((sum, category) => sum + category.list.length, 0)}개
                      </span>
                      <span className="text-xs text-gray-400">보유 기술 스택</span>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/40">
                      <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">
                        {profile.experience.length}회
                      </span>
                      <span className="text-xs text-gray-400">이력 목록</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              key="skills-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
              id="skills-section"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  보유 기술 스택
                </h2>
                <p className="text-sm text-gray-500">
                  실무 및 프로젝트 제작에 활용 가능한 주요 기술들을 분류별로 보여줍니다.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" id="skills-grid">
                {profile.skills.map((category) => (
                  <div key={category.id} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 dark:border-gray-900 dark:bg-gray-900/30 space-y-4">
                    <h3 className={`text-base font-extrabold tracking-wide uppercase ${activeColor.primaryText} border-b border-gray-200/50 pb-2 dark:border-gray-800/50`}>
                      {category.category}
                    </h3>
                    
                    <div className="space-y-4">
                      {category.list.map((skill, index) => {
                        const levelData = getSkillBadge(skill.level);
                        return (
                          <div key={index} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-semibold text-gray-800 dark:text-gray-200">{skill.name}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${levelData.style}`}>
                                {levelData.label}
                              </span>
                            </div>
                            {/* Visual Progress Bar */}
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level * 20}%` }}
                                transition={{ duration: 0.8, delay: index * 0.05 }}
                                className={`h-full rounded-full ${activeColor.primary}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
              id="projects-section"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  수행한 프로젝트
                </h2>
                <p className="text-sm text-gray-500">
                  직접 기획하고 개발하며 문제를 해결해온 주요 대표 결과물입니다. 카드를 클릭해 상세 공헌 내용과 개발 결과를 확인할 수 있습니다.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" id="projects-grid">
                {profile.projects.map((project) => (
                  <motion.div 
                    key={project.id}
                    layoutId={`project-card-${project.id}`}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all dark:border-gray-900 dark:bg-gray-950"
                  >
                    <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-900">
                      <img 
                        src={project.image || "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80"} 
                        alt={project.title}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 rounded-full bg-gray-950/70 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                        {project.period}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 space-y-3">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                        {project.title}
                      </h3>
                      
                      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                            #{tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:bg-gray-900">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-900">
                        <div className="flex gap-2">
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedProject(project)}
                          className={`flex items-center gap-1 text-xs font-bold ${activeColor.primaryText}`}
                        >
                          상세 보기 <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'experience' && (
            <motion.div
              key="experience-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
              id="experience-section"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  이력 및 경력 사항
                </h2>
                <p className="text-sm text-gray-500">
                  그동안 소속되어 일하며 성장해온 직장 경력과 조직에서의 핵심 기여 내용입니다.
                </p>
              </div>

              {profile.experience.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-400 dark:border-gray-800">
                  <Briefcase className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  등록된 이력 사항이 없습니다.
                </div>
              ) : (
                <div className="relative border-l border-gray-200 pl-6 dark:border-gray-800 space-y-10" id="experience-timeline">
                  {profile.experience.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative space-y-2"
                    >
                      {/* Timeline Dot */}
                      <span className={`absolute -left-9 top-1.5 h-6 w-6 rounded-full border-4 border-white dark:border-gray-950 flex items-center justify-center text-white shadow ${activeColor.primary}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>

                      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                          {item.role} <span className="font-normal text-gray-400">@ {item.company}</span>
                        </h3>
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                          <Calendar className="mr-1.5 h-3 w-3" /> {item.period}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>

                      <div className="pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                          핵심 기여 및 성과
                        </h4>
                        <ul className="space-y-2">
                          {item.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${activeColor.bullet}`} />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'guestbook' && (
            <motion.div
              key="guestbook-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid gap-8 md:grid-cols-5"
              id="guestbook-section"
            >
              {/* Form Side */}
              <div className="md:col-span-2 space-y-6" id="guestbook-form-container">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className={`h-6 w-6 ${activeColor.primaryText}`} /> 
                    방명록 한마디
                  </h2>
                  <p className="text-sm text-gray-500">
                    저에 대해 질문하고 싶은 사항이나, 프로필 방문에 대한 가벼운 한 마디를 남겨주세요!
                  </p>
                </div>

                <form onSubmit={handleGuestbookSubmit} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 dark:border-gray-900 dark:bg-gray-900/30 space-y-4" id="guestbook-form">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400">작성자 이름</label>
                    <input 
                      type="text" 
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="예: 홍길동 (개발자)" 
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-950 focus:ring-1 focus:ring-indigo-500"
                      maxLength={30}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400">전하고 싶은 말</label>
                    <textarea 
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      placeholder="내용을 편하게 입력해주세요." 
                      rows={4}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-950 focus:ring-1 focus:ring-indigo-500 resize-none"
                      maxLength={300}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow transition-all hover:scale-[1.01] active:scale-95 ${activeColor.primary} ${activeColor.hover}`}
                  >
                    <Send className="h-4 w-4" /> 남기기
                  </button>

                  <AnimatePresence>
                    {isSubmitSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-lg bg-emerald-50 p-2.5 text-center text-xs font-semibold text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center gap-1.5"
                      >
                        <Heart className="h-4 w-4 fill-emerald-500 stroke-none" /> 방명록이 소중하게 저장되었습니다!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Message Board Side */}
              <div className="md:col-span-3 space-y-4 flex flex-col h-[500px]" id="guestbook-messages">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-800">
                  <span>메시지 보드 ({profile.guestbook.length})</span>
                  <span className="text-[10px] text-gray-400 font-normal">안전한 브라우저 쿠키(Local)에 등록됩니다</span>
                </h3>

                {profile.guestbook.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400 dark:border-gray-800">
                    <MessageSquare className="h-8 w-8 mb-2 opacity-40" />
                    첫 방명록을 등록해보세요!
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 scrollbar-thin scrollbar-thumb-gray-200" id="message-list-container">
                    <AnimatePresence initial={false}>
                      {profile.guestbook.map((msg) => (
                        <motion.div 
                          key={msg.id}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group relative rounded-xl border border-gray-100 bg-white p-4.5 shadow-sm hover:shadow-md transition dark:border-gray-900 dark:bg-gray-950"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {msg.sender}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">
                                {formatDate(msg.timestamp)}
                              </span>
                              <button
                                onClick={() => onDeleteGuestbookMessage(msg.id)}
                                className="rounded p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all opacity-0 group-hover:opacity-100"
                                title="방명록 메시지 삭제"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project Detail Modal Popover */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-gray-900/60" id="project-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl dark:border-gray-900 dark:bg-gray-950 flex flex-col max-h-[85vh]"
              id="project-modal-body"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-gray-950/50 p-2 text-white hover:bg-gray-950/70 transition"
              >
                &times;
              </button>

              {/* Banner Image */}
              <div className="h-56 w-full bg-gray-100 dark:bg-gray-900 relative flex-shrink-0">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-5 left-6 text-white space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-white/70 uppercase">
                    {selectedProject.period}
                  </span>
                  <h3 className="text-xl font-black">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable details */}
              <div className="overflow-y-auto p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    프로젝트 요약
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    상세 공헌 및 기술 구현 성과
                  </h4>
                  <div className="text-xs md:text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap font-normal">
                    {selectedProject.details}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    적용 기술 및 키워드
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tags.map((tag, idx) => (
                      <span key={idx} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${activeColor.lightBg} ${activeColor.lightText}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom links bar */}
              <div className="border-t border-gray-100 bg-gray-50 p-4.5 flex justify-end gap-3 rounded-b-3xl dark:border-gray-900 dark:bg-gray-900/40 flex-shrink-0">
                {selectedProject.github && (
                  <a 
                    href={selectedProject.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition"
                  >
                    <Github className="h-4 w-4" /> GitHub 링크
                  </a>
                )}
                {selectedProject.link && (
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 ${activeColor.primary}`}
                  >
                    <ExternalLink className="h-4 w-4" /> 데모 웹사이트
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-300 transition"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
