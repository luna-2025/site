/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Save, Undo, Plus, Trash2, Edit2, Check, ArrowLeft, HelpCircle, 
  Settings, Image, Link, List, FileText, Smartphone, LayoutGrid, Palette, RefreshCw, Copy, Upload, Briefcase
} from 'lucide-react';
import { ProfileData, SkillCategory, ProjectItem, ExperienceItem, ThemeColor, SkillItem } from '../types';

interface ProfileEditorProps {
  profile: ProfileData;
  onSave: (updatedProfile: ProfileData) => void;
  onClose: () => void;
}

export default function ProfileEditor({ profile, onSave, onClose }: ProfileEditorProps) {
  // Local mutable state cloned from profile props
  const [editedProfile, setEditedProfile] = useState<ProfileData>(JSON.parse(JSON.stringify(profile)));
  const [activeSection, setActiveSection] = useState<'basic' | 'skills' | 'projects' | 'experience' | 'theme'>('basic');
  
  // Dynamic state helpers
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [jsonImportText, setJsonImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const colors = {
    indigo: 'bg-indigo-600 border-indigo-600 focus:ring-indigo-500 hover:bg-indigo-700',
    emerald: 'bg-emerald-600 border-emerald-600 focus:ring-emerald-500 hover:bg-emerald-700',
    violet: 'bg-violet-600 border-violet-600 focus:ring-violet-500 hover:bg-violet-700',
    rose: 'bg-rose-600 border-rose-600 focus:ring-rose-500 hover:bg-rose-700',
    amber: 'bg-amber-600 border-amber-600 focus:ring-amber-500 hover:bg-amber-700',
    sky: 'bg-sky-600 border-sky-600 focus:ring-sky-500 hover:bg-sky-700'
  };

  const handleBasicChange = (field: keyof ProfileData, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // --- Skills Handlers ---
  const handleSkillCategoryNameChange = (categoryId: string, newName: string) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills.map(cat => cat.id === categoryId ? { ...cat, category: newName } : cat)
    }));
  };

  const handleSkillItemChange = (categoryId: string, skillIndex: number, field: keyof SkillItem, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills.map(cat => {
        if (cat.id !== categoryId) return cat;
        const newList = [...cat.list];
        newList[skillIndex] = { ...newList[skillIndex], [field]: value };
        return { ...cat, list: newList };
      })
    }));
  };

  const handleAddSkillItem = (categoryId: string) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          list: [...cat.list, { name: '새로운 기술', level: 3 }]
        };
      })
    }));
  };

  const handleRemoveSkillItem = (categoryId: string, skillIndex: number) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          list: cat.list.filter((_, idx) => idx !== skillIndex)
        };
      })
    }));
  };

  const handleAddSkillCategory = () => {
    const newCategory: SkillCategory = {
      id: `skill-${Date.now()}`,
      category: '새로운 대분류 (예: Database)',
      list: [{ name: '기본 기술', level: 3 }]
    };
    setEditedProfile(prev => ({
      ...prev,
      skills: [...prev.skills, newCategory]
    }));
  };

  const handleRemoveSkillCategory = (categoryId: string) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(cat => cat.id !== categoryId)
    }));
  };

  // --- Projects Handlers ---
  const handleAddProject = () => {
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: '새로운 프로젝트명',
      period: '2026.01 - 2026.02',
      description: '프로젝트에 대한 한 줄 요약을 작성해주세요.',
      details: '• 주요 역할: \n• 기술 스택: \n• 주요 성과: ',
      tags: ['React', 'TypeScript'],
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
      link: '',
      github: ''
    };
    setEditedProfile(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));
    setEditingProjectId(newProject.id);
  };

  const handleProjectFieldChange = (projectId: string, field: keyof ProjectItem, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      projects: prev.projects.map(proj => {
        if (proj.id !== projectId) return proj;
        if (field === 'tags') {
          // split tags by comma
          const tagArray = typeof value === 'string' ? value.split(',').map(t => t.trim()).filter(Boolean) : value;
          return { ...proj, tags: tagArray };
        }
        return { ...proj, [field]: value };
      })
    }));
  };

  const handleRemoveProject = (projectId: string) => {
    if (confirm('이 프로젝트를 삭제하시겠습니까?')) {
      setEditedProfile(prev => ({
        ...prev,
        projects: prev.projects.filter(proj => proj.id !== projectId)
      }));
      if (editingProjectId === projectId) setEditingProjectId(null);
    }
  };

  // --- Experience Handlers ---
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: '직무 / 역할명',
      company: '회사 또는 단체명',
      period: '2025.01 - 현재',
      description: '담당 업무 및 세부 조직 소개를 작성해주세요.',
      achievements: ['핵심 성과 또는 기여 사항을 입력해주세요.']
    };
    setEditedProfile(prev => ({
      ...prev,
      experience: [newExp, ...prev.experience]
    }));
    setEditingExperienceId(newExp.id);
  };

  const handleExperienceFieldChange = (expId: string, field: keyof ExperienceItem, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id !== expId) return exp;
        return { ...exp, [field]: value };
      })
    }));
  };

  const handleAddAchievement = (expId: string) => {
    setEditedProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id !== expId) return exp;
        return { ...exp, achievements: [...exp.achievements, '새로운 기여 성과'] };
      })
    }));
  };

  const handleAchievementChange = (expId: string, index: number, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id !== expId) return exp;
        const newAch = [...exp.achievements];
        newAch[index] = value;
        return { ...exp, achievements: newAch };
      })
    }));
  };

  const handleRemoveAchievement = (expId: string, index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id !== expId) return exp;
        return { ...exp, achievements: exp.achievements.filter((_, idx) => idx !== index) };
      })
    }));
  };

  const handleRemoveExperience = (expId: string) => {
    if (confirm('이 이력 사항을 삭제하시겠습니까?')) {
      setEditedProfile(prev => ({
        ...prev,
        experience: prev.experience.filter(exp => exp.id !== expId)
      }));
      if (editingExperienceId === expId) setEditingExperienceId(null);
    }
  };

  // --- Save / JSON Actions ---
  const handleSaveAll = () => {
    onSave(editedProfile);
  };

  const copyBackupToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(editedProfile, null, 2));
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const handleImportJson = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(jsonImportText);
      
      // Basic schema validations
      if (!parsed.name || !parsed.title || !Array.isArray(parsed.skills) || !Array.isArray(parsed.projects)) {
        throw new Error('프로필 데이터의 필수 항목(이름, 타이틀, 기술 리스트, 프로젝트 리스트)이 비어있습니다.');
      }
      
      setEditedProfile(parsed);
      alert('성공적으로 프로필 데이터를 불러왔습니다!');
      setJsonImportText('');
    } catch (e: any) {
      setImportError(e.message || 'JSON 파싱 도중 오류가 발생했습니다. 올바른 형식을 입력해주세요.');
    }
  };

  const handlePredefinedAvatarSelect = (url: string) => {
    setEditedProfile(prev => ({
      ...prev,
      avatar: url
    }));
  };

  const presetAvatars = [
    '/src/assets/images/default_avatar_1782269451854.jpg',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80'
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-4" id="profile-editor-grid">
      {/* Sidebar: Navigation Settings */}
      <div className="lg:col-span-1 space-y-4" id="editor-sidebar">
        <div className="rounded-2xl border border-gray-100 bg-white p-4.5 shadow-sm dark:border-gray-900 dark:bg-gray-950 space-y-1.5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1.5">
            작업 공간 메뉴
          </h3>
          {[
            { id: 'basic', label: '기본 인적사항', icon: FileText },
            { id: 'skills', label: '기술 스택 관리', icon: LayoutGrid },
            { id: 'projects', label: '프로젝트 관리', icon: List },
            { id: 'experience', label: '경력 사항 관리', icon: Briefcase },
            { id: 'theme', label: '테마 및 백업', icon: Palette }
          ].map(sec => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isSelected 
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white' 
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Save Controls */}
        <div className="rounded-2xl bg-gray-50 p-4.5 dark:bg-gray-900/40 space-y-3">
          <button
            onClick={handleSaveAll}
            id="btn-save-all-changes"
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:scale-[1.01] active:scale-95 cursor-pointer ${colors[editedProfile.themeColor] || 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <Save className="h-4 w-4" /> 변경 내용 저장하기
          </button>
          
          <button
            onClick={onClose}
            id="btn-cancel-editor"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> 편집 종료 (보기 모드)
          </button>
        </div>
      </div>

      {/* Editor Main Form Panel */}
      <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-900 dark:bg-gray-950 md:p-8" id="editor-workspace">
        
        {/* SECTION: BASIC INFO */}
        {activeSection === 'basic' && (
          <div className="space-y-6" id="editor-section-basic">
            <div className="border-b border-gray-100 pb-3 dark:border-gray-900">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">기본 인적사항 및 소개글</h2>
              <p className="text-xs text-gray-400 mt-1">포트폴리오 대문에 보일 기본 프로필 사진, 영문명, 타이틀 및 자세한 소개글을 기입해 주세요.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">한글 이름</label>
                <input 
                  type="text" 
                  value={editedProfile.name}
                  onChange={e => handleBasicChange('name', e.target.value)}
                  placeholder="예: 이민우" 
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">영문 이름 / 아이디</label>
                <input 
                  type="text" 
                  value={editedProfile.englishName}
                  onChange={e => handleBasicChange('englishName', e.target.value)}
                  placeholder="예: Minwoo Lee" 
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-400">프로필 서브 타이틀 (슬로건)</label>
                <input 
                  type="text" 
                  value={editedProfile.title}
                  onChange={e => handleBasicChange('title', e.target.value)}
                  placeholder="예: 깨끗한 코드를 만드는 풀스택 개발자" 
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-400">대문 한줄 소개 (Bio)</label>
                <textarea 
                  value={editedProfile.bio}
                  onChange={e => handleBasicChange('bio', e.target.value)}
                  placeholder="프로필 헤더 카드에서 보일 짧은 소개문구입니다." 
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900 resize-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-400">전체 상세 소개글 (Intro)</label>
                <textarea 
                  value={editedProfile.introduction}
                  onChange={e => handleBasicChange('introduction', e.target.value)}
                  placeholder="소개 탭에서 보일 자세한 자신의 경험담 및 성장 스토리를 자유롭게 작성해 보세요." 
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900"
                />
              </div>

              <div className="sm:col-span-2 space-y-3">
                <label className="text-xs font-bold text-gray-400 block">프로필 이미지 (Avatar)</label>
                <div className="flex flex-wrap gap-2.5 items-center mb-2">
                  {presetAvatars.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePredefinedAvatarSelect(url)}
                      className={`h-11 w-11 rounded-full overflow-hidden border-2 transition-all ${
                        editedProfile.avatar === url 
                          ? 'border-indigo-600 scale-105 shadow' 
                          : 'border-transparent hover:scale-105'
                      }`}
                    >
                      <img src={url} alt="preset" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={editedProfile.avatar}
                  onChange={e => handleBasicChange('avatar', e.target.value)}
                  placeholder="또는 사용자 정의 이미지 절대 URL 링크를 기입" 
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 dark:border-gray-900 space-y-4">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Smartphone className="h-4 w-4" /> 소셜 링크 및 연락처
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400">이메일 주소</label>
                  <input 
                    type="email" 
                    value={editedProfile.email}
                    onChange={e => handleBasicChange('email', e.target.value)}
                    placeholder="example@gmail.com" 
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none dark:border-gray-800 dark:bg-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400">전화번호</label>
                  <input 
                    type="text" 
                    value={editedProfile.phone}
                    onChange={e => handleBasicChange('phone', e.target.value)}
                    placeholder="010-XXXX-XXXX" 
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none dark:border-gray-800 dark:bg-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400">활동 지역 / 근무처</label>
                  <input 
                    type="text" 
                    value={editedProfile.location}
                    onChange={e => handleBasicChange('location', e.target.value)}
                    placeholder="서울특별시 마포구" 
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none dark:border-gray-800 dark:bg-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400">GitHub 주소</label>
                  <input 
                    type="text" 
                    value={editedProfile.github}
                    onChange={e => handleBasicChange('github', e.target.value)}
                    placeholder="https://github.com/..." 
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none dark:border-gray-800 dark:bg-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400">블로그 주소</label>
                  <input 
                    type="text" 
                    value={editedProfile.blog}
                    onChange={e => handleBasicChange('blog', e.target.value)}
                    placeholder="https://yourblog.com" 
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none dark:border-gray-800 dark:bg-gray-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400">LinkedIn 주소</label>
                  <input 
                    type="text" 
                    value={editedProfile.linkedin}
                    onChange={e => handleBasicChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/..." 
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs md:text-sm outline-none dark:border-gray-800 dark:bg-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SKILLS */}
        {activeSection === 'skills' && (
          <div className="space-y-6" id="editor-section-skills">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-900">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">보유 기술 및 숙련도 관리</h2>
                <p className="text-xs text-gray-400 mt-1">기술 대분류(그룹)를 생성하고 스택과 숙련도를 마음대로 가감할 수 있습니다.</p>
              </div>
              <button
                type="button"
                onClick={handleAddSkillCategory}
                className="flex items-center gap-1 rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-750 transition"
              >
                <Plus className="h-3.5 w-3.5" /> 대분류 추가
              </button>
            </div>

            <div className="space-y-6" id="skills-categories-editor">
              {editedProfile.skills.map((category) => (
                <div key={category.id} className="rounded-2xl border border-gray-100 bg-gray-50/40 p-5 dark:border-gray-900 dark:bg-gray-900/10 space-y-4">
                  
                  {/* Category Title Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 dark:border-gray-900">
                    <input 
                      type="text"
                      value={category.category}
                      onChange={e => handleSkillCategoryNameChange(category.id, e.target.value)}
                      className="bg-transparent text-sm font-black text-gray-800 dark:text-white border-b border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none px-1 py-0.5"
                    />
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillCategory(category.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                      title="대분류 삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Skills Items Grid */}
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {category.list.map((skill, index) => (
                      <div key={index} className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm border border-gray-100 dark:bg-gray-950 dark:border-gray-900">
                        <div className="flex items-center justify-between gap-2">
                          <input 
                            type="text"
                            value={skill.name}
                            onChange={e => handleSkillItemChange(category.id, index, 'name', e.target.value)}
                            className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 border-b border-transparent hover:border-gray-200 focus:border-indigo-500 outline-none w-full"
                          />
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveSkillItem(category.id, index)}
                            className="text-gray-300 hover:text-red-500 transition"
                          >
                            &times;
                          </button>
                        </div>

                        {/* Competency Level (1 - 5 Slider) */}
                        <div className="flex items-center gap-3">
                          <input 
                            type="range" 
                            min="1" 
                            max="5"
                            value={skill.level}
                            onChange={e => handleSkillItemChange(category.id, index, 'level', parseInt(e.target.value))}
                            className="flex-1 accent-indigo-600 h-1"
                          />
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase w-11 text-right">
                            Lv. {skill.level} / 5
                          </span>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddSkillItem(category.id)}
                      className="flex items-center justify-center gap-1 border border-dashed border-gray-200 rounded-xl py-3 text-xs font-bold text-gray-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/10 transition dark:border-gray-800"
                    >
                      <Plus className="h-3.5 w-3.5" /> 기술 추가
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: PROJECTS */}
        {activeSection === 'projects' && (
          <div className="space-y-6" id="editor-section-projects">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-900">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">프로젝트 성과 관리</h2>
                <p className="text-xs text-gray-400 mt-1">대표 프로젝트를 등록하고 기술 스택, 세부 성과 성격 및 데모 링크를 편집할 수 있습니다.</p>
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="flex items-center gap-1 rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-750 transition"
              >
                <Plus className="h-3.5 w-3.5" /> 새 프로젝트 등록
              </button>
            </div>

            <div className="space-y-4" id="projects-list-editor">
              {editedProfile.projects.map((project) => {
                const isEditing = editingProjectId === project.id;
                return (
                  <div key={project.id} className="rounded-2xl border border-gray-100 bg-white p-4.5 shadow-sm dark:border-gray-900 dark:bg-gray-950 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                          {project.title || '(이름 없음)'}
                        </h3>
                        <p className="text-xs text-gray-400">{project.period}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProjectId(isEditing ? null : project.id)}
                          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
                        >
                          {isEditing ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Edit2 className="h-3.5 w-3.5" />}
                          {isEditing ? '완료' : '수정'}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(project.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-gray-100 dark:border-gray-900">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">프로젝트명</label>
                          <input 
                            type="text" 
                            value={project.title}
                            onChange={e => handleProjectFieldChange(project.id, 'title', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">수행 기간</label>
                          <input 
                            type="text" 
                            value={project.period}
                            onChange={e => handleProjectFieldChange(project.id, 'period', e.target.value)}
                            placeholder="예: 2026.01 - 2026.03 (3개월)"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">프로젝트 한 줄 간단 소개</label>
                          <input 
                            type="text" 
                            value={project.description}
                            onChange={e => handleProjectFieldChange(project.id, 'description', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">프로젝트 상세 성과 및 구현 핵심 (마크다운식 리스트 등)</label>
                          <textarea 
                            value={project.details}
                            onChange={e => handleProjectFieldChange(project.id, 'details', e.target.value)}
                            rows={4}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">기술 태그 (쉼표로 구분해 입력해 주세요)</label>
                          <input 
                            type="text" 
                            value={project.tags.join(', ')}
                            onChange={e => handleProjectFieldChange(project.id, 'tags', e.target.value)}
                            placeholder="React, TypeScript, Tailwind"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">대표 이미지 URL</label>
                          <input 
                            type="text" 
                            value={project.image}
                            onChange={e => handleProjectFieldChange(project.id, 'image', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">GitHub 링크</label>
                          <input 
                            type="text" 
                            value={project.github || ''}
                            onChange={e => handleProjectFieldChange(project.id, 'github', e.target.value)}
                            placeholder="https://github.com/..."
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">라이브 데모 웹사이트 링크</label>
                          <input 
                            type="text" 
                            value={project.link || ''}
                            onChange={e => handleProjectFieldChange(project.id, 'link', e.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION: EXPERIENCE */}
        {activeSection === 'experience' && (
          <div className="space-y-6" id="editor-section-experience">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-900">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">이력 및 이정표 관리</h2>
                <p className="text-xs text-gray-400 mt-1">회사명, 담당 직무, 성취한 기여 내용들을 추가하거나 수정합니다.</p>
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="flex items-center gap-1 rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-750 transition"
              >
                <Plus className="h-3.5 w-3.5" /> 새 이력 추가
              </button>
            </div>

            <div className="space-y-4" id="experience-list-editor">
              {editedProfile.experience.map((exp) => {
                const isEditing = editingExperienceId === exp.id;
                return (
                  <div key={exp.id} className="rounded-2xl border border-gray-100 bg-white p-4.5 shadow-sm dark:border-gray-900 dark:bg-gray-950 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                          {exp.role || '(제목 없음)'} <span className="text-sm font-normal text-gray-400">@ {exp.company || '(회사명)'}</span>
                        </h3>
                        <p className="text-xs text-gray-400">{exp.period}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingExperienceId(isEditing ? null : exp.id)}
                          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
                        >
                          {isEditing ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Edit2 className="h-3.5 w-3.5" />}
                          {isEditing ? '완료' : '수정'}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-gray-100 dark:border-gray-900">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">직무 / 역할명</label>
                          <input 
                            type="text" 
                            value={exp.role}
                            onChange={e => handleExperienceFieldChange(exp.id, 'role', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">회사 / 조직명</label>
                          <input 
                            type="text" 
                            value={exp.company}
                            onChange={e => handleExperienceFieldChange(exp.id, 'company', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">재직 기간</label>
                          <input 
                            type="text" 
                            value={exp.period}
                            onChange={e => handleExperienceFieldChange(exp.id, 'period', e.target.value)}
                            placeholder="예: 2024.03 - 현재"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-xs font-bold text-gray-400">담당 부서 및 전반적 기여 요약</label>
                          <input 
                            type="text" 
                            value={exp.description}
                            onChange={e => handleExperienceFieldChange(exp.id, 'description', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                          />
                        </div>

                        {/* Achievements Bullet List */}
                        <div className="sm:col-span-2 space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-400">상세 기여 성과 (Bullet points)</label>
                            <button
                              type="button"
                              onClick={() => handleAddAchievement(exp.id)}
                              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-0.5"
                            >
                              <Plus className="h-3 w-3" /> 성과 라인 추가
                            </button>
                          </div>

                          <div className="space-y-2.5">
                            {exp.achievements.map((achievement, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-300">{index + 1}.</span>
                                <input 
                                  type="text"
                                  value={achievement}
                                  onChange={e => handleAchievementChange(exp.id, index, e.target.value)}
                                  className="flex-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs outline-none dark:border-gray-800 dark:bg-gray-900"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAchievement(exp.id, index)}
                                  className="text-gray-300 hover:text-red-500"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION: THEME, EXPORT & RESET */}
        {activeSection === 'theme' && (
          <div className="space-y-8" id="editor-section-theme">
            {/* Theme Select */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-100 pb-2 dark:border-gray-900">
                <Palette className="h-4.5 w-4.5 text-gray-400" /> 시그니처 테마 컬러 선택
              </h3>
              <p className="text-xs text-gray-400">웹사이트 주요 버튼, 하이라이트 글자, 진척도 막대 등에 일괄 적용될 메인 테마 색상을 선택하세요.</p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { id: 'indigo', label: '인디고 블루', hex: 'bg-indigo-600', text: 'text-indigo-600' },
                  { id: 'emerald', label: '에메랄드 그린', hex: 'bg-emerald-600', text: 'text-emerald-600' },
                  { id: 'violet', label: '로열 바이올렛', hex: 'bg-violet-600', text: 'text-violet-600' },
                  { id: 'rose', label: '러블리 로즈', hex: 'bg-rose-600', text: 'text-rose-600' },
                  { id: 'amber', label: '웜 앰버', hex: 'bg-amber-600', text: 'text-amber-600' },
                  { id: 'sky', label: '스카이 블루', hex: 'bg-sky-600', text: 'text-sky-600' }
                ].map(col => {
                  const isSelected = editedProfile.themeColor === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => handleBasicChange('themeColor', col.id as ThemeColor)}
                      className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all hover:scale-105 ${
                        isSelected 
                          ? 'border-gray-900 bg-gray-50 text-gray-900 dark:border-white dark:bg-gray-900 dark:text-white' 
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800'
                      }`}
                    >
                      <span className={`h-4.5 w-4.5 rounded-full shadow-inner ${col.hex}`} />
                      <span>{col.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Config JSON Backup */}
            <div className="space-y-4 border-t border-gray-100 pt-6 dark:border-gray-900">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Copy className="h-4.5 w-4.5 text-gray-400" /> 프로필 데이터 백업 (내보내기)
              </h3>
              <p className="text-xs text-gray-400">포트폴리오의 설정과 데이터를 안전하게 다운로드하거나 텍스트로 복사하여 백업해 둘 수 있습니다.</p>
              
              <div className="space-y-2">
                <textarea
                  readOnly
                  value={JSON.stringify(editedProfile, null, 2)}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-[10px] text-gray-600 outline-none resize-none dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400"
                  onClick={e => (e.target as any).select()}
                />
                
                <button
                  type="button"
                  onClick={copyBackupToClipboard}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 transition"
                >
                  {copiedBackup ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedBackup ? '클립보드 복사 완료!' : '백업 JSON 클립보드 복사'}</span>
                </button>
              </div>
            </div>

            {/* JSON Import */}
            <div className="space-y-4 border-t border-gray-100 pt-6 dark:border-gray-900">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Upload className="h-4.5 w-4.5 text-gray-400" /> 데이터 복구 (가져오기)
              </h3>
              <p className="text-xs text-gray-400">이전에 저장한 백업 JSON 데이터를 아래 상자에 붙여넣어 프로필 전체 내용을 간편하게 복구할 수 있습니다.</p>
              
              <div className="space-y-2.5">
                <textarea
                  value={jsonImportText}
                  onChange={e => setJsonImportText(e.target.value)}
                  placeholder="여기에 백업한 JSON 데이터를 붙여넣으세요..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 p-3 font-mono text-[10px] outline-none dark:border-gray-800 dark:bg-gray-900"
                />

                {importError && (
                  <p className="text-xs font-semibold text-red-500">
                    ⚠️ {importError}
                  </p>
                )}
                
                <button
                  type="button"
                  onClick={handleImportJson}
                  className="flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>데이터 복원 적용하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
