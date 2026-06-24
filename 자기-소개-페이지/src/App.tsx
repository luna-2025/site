/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DEFAULT_PROFILE } from './data';
import { ProfileData, GuestbookMessage } from './types';
import ProfileViewer from './components/ProfileViewer';
import ProfileEditor from './components/ProfileEditor';
import { Sparkles, Edit3, User, Eye, Laptop, Heart } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('self_intro_profile_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure standard schema compatibility
        if (parsed.name && parsed.title && Array.isArray(parsed.skills)) {
          setProfile(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load profile from local storage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to LocalStorage
  const saveProfile = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
    localStorage.setItem('self_intro_profile_v1', JSON.stringify(updatedProfile));
    setIsEditing(false);
    
    // Smooth scroll back to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add guestbook message
  const handleAddGuestbookMessage = (sender: string, message: string) => {
    const newMessage: GuestbookMessage = {
      id: `msg-${Date.now()}`,
      sender,
      message,
      timestamp: new Date().toISOString()
    };
    
    const updatedProfile = {
      ...profile,
      guestbook: [newMessage, ...(profile.guestbook || [])]
    };
    
    setProfile(updatedProfile);
    localStorage.setItem('self_intro_profile_v1', JSON.stringify(updatedProfile));
  };

  // Delete guestbook message
  const handleDeleteGuestbookMessage = (id: string) => {
    const updatedProfile = {
      ...profile,
      guestbook: (profile.guestbook || []).filter(msg => msg.id !== id)
    };
    
    setProfile(updatedProfile);
    localStorage.setItem('self_intro_profile_v1', JSON.stringify(updatedProfile));
  };

  // Reset profile to default
  const handleResetProfile = () => {
    if (confirm('모든 입력값이 원래 기본 이민우 포트폴리오로 복원됩니다. 계속하시겠습니까?')) {
      saveProfile(DEFAULT_PROFILE);
    }
  };

  const activeColorClasses = {
    indigo: 'text-indigo-600 border-indigo-600',
    emerald: 'text-emerald-600 border-emerald-600',
    violet: 'text-violet-600 border-violet-600',
    rose: 'text-rose-600 border-rose-600',
    amber: 'text-amber-600 border-amber-600',
    sky: 'text-sky-600 border-sky-600'
  };

  const activeBorderColor = activeColorClasses[profile.themeColor] || activeColorClasses.indigo;

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 md:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Dynamic Header */}
        <header className="flex flex-col items-center justify-between gap-4 border-b border-gray-200/60 pb-6 dark:border-gray-800/60 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                {profile.name}님의 프로필 허브
              </h2>
              <p className="text-[10px] text-gray-400">
                실시간 커스텀 자기 소개 페이지
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status indicators */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              id="header-toggle-edit"
              className={`flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 ${
                isEditing ? 'text-indigo-600 border-indigo-200' : 'text-gray-600'
              }`}
            >
              {isEditing ? (
                <>
                  <Eye className="h-3.5 w-3.5" /> 보기 모드로 전환
                </>
              ) : (
                <>
                  <Edit3 className="h-3.5 w-3.5" /> 포트폴리오 빌더 열기
                </>
              )}
            </button>

            {isEditing && (
              <button
                onClick={handleResetProfile}
                id="btn-reset-to-default"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-red-600 shadow-sm hover:bg-red-50 dark:border-gray-800 dark:bg-gray-950 transition-all"
                title="기본 템플릿 정보로 초기화"
              >
                초기화
              </button>
            )}
          </div>
        </header>

        {/* Content Section */}
        <main>
          {isEditing ? (
            <ProfileEditor 
              profile={profile} 
              onSave={saveProfile} 
              onClose={() => setIsEditing(false)} 
            />
          ) : (
            <ProfileViewer 
              profile={profile}
              onAddGuestbookMessage={handleAddGuestbookMessage}
              onDeleteGuestbookMessage={handleDeleteGuestbookMessage}
              onToggleEditMode={() => setIsEditing(true)}
            />
          )}
        </main>

        {/* Elegant Minimalist Footer */}
        <footer className="border-t border-gray-200/50 pt-8 text-center text-[11px] text-gray-400 dark:border-gray-800/50" id="global-footer">
          <p className="flex items-center justify-center gap-1">
            <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
            <span className="text-gray-300">|</span>
            <span>Designed with</span>
            <Heart className="h-3 w-3 fill-rose-500 stroke-none" />
            <span>for personal brand hub</span>
          </p>
          <p className="mt-1 text-[10px] text-gray-300">
            실시간 프로필 데이터는 안전하게 로컬 환경(LocalStorage)에 자동 동기화 보존됩니다.
          </p>
        </footer>

      </div>
    </div>
  );
}
