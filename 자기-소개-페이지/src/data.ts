/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProfileData } from './types';

export const DEFAULT_PROFILE: ProfileData = {
  name: "이민우",
  englishName: "Minwoo Lee",
  title: "사용자 중심의 가치를 만드는 프론트엔드 개발자",
  bio: "React와 TypeScript를 활용하여 우수한 사용자 경험(UX)과 깨끗한 코드를 지향하는 프론트엔드 엔지니어입니다. 문제 해결을 즐기며, 기술을 통해 일상적인 불편함을 해결하고 가치를 만드는 것에 열정을 느낍니다.",
  introduction: "안녕하세요! 끊임없이 성장하며 더 나은 웹 생태계를 만들어가는 프론트엔드 개발자 이민우입니다.\n\n저는 직관적인 UI 디자인과 부드러운 애니메이션, 그리고 최적화된 웹 성능을 제공하는 것에 주력합니다. 사용자 피드백을 깊이 있게 수용하며 협업 부서와의 적극적인 커뮤니케이션을 통해 비즈니스 문제를 효과적으로 풀어나갑니다.\n\n새로운 기술을 탐구하는 것을 좋아하며, 기술이 사용자에게 실질적인 가치를 전달하는 수단이라고 굳게 믿고 있습니다.",
  avatar: "/src/assets/images/default_avatar_1782269451854.jpg",
  email: "reyn7972@gmail.com",
  phone: "010-1234-5678",
  location: "서울특별시 강남구",
  github: "https://github.com",
  blog: "https://velog.io",
  linkedin: "https://linkedin.com",
  themeColor: "indigo",
  skills: [
    {
      id: "skill-1",
      category: "Frontend",
      list: [
        { name: "React / Next.js", level: 5 },
        { name: "TypeScript", level: 5 },
        { name: "Tailwind CSS", level: 5 },
        { name: "Redux / Zustand", level: 4 },
        { name: "Vue.js", level: 3 }
      ]
    },
    {
      id: "skill-2",
      category: "Backend & Devops",
      list: [
        { name: "Node.js (Express)", level: 4 },
        { name: "Firebase (Firestore/Auth)", level: 4 },
        { name: "RESTful API Design", level: 4 },
        { name: "Docker / Git Actions", level: 3 }
      ]
    },
    {
      id: "skill-3",
      category: "Tools & Design",
      list: [
        { name: "Figma", level: 4 },
        { name: "Git / GitHub", level: 5 },
        { name: "Agile / Scrum", level: 4 },
        { name: "Jest / Cypress", level: 3 }
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "협업용 실시간 칸반보드 서비스 (TaskFlow)",
      period: "2026.01 - 2026.04 (4개월)",
      description: "팀원 간 실시간 태스크 관리 및 동시 협업을 가능케 하는 칸반보드 웹 어플리케이션입니다.",
      details: "• 주요 역할: 프론트엔드 아키텍처 설계 및 핵심 Drag-and-Drop 인터페이스 개발\n• 기술 스택: React, TypeScript, Tailwind CSS, Zustand, Socket.io\n• 주요 성과:\n  - React-beautiful-dnd를 커스텀하여 모바일 터치 대응 및 매끄러운 카드 전환 애니메이션 구현\n  - 드래그 앤 드롭 동작 시 레이아웃 시프트를 완전히 해결하고, 초당 프레임수(FPS)를 60FPS로 전구간 유지\n  - 낙관적 업데이트(Optimistic Update) 패턴을 적용하여 서버 응답 대기 없이 즉각적인 UI 반영 실현",
      tags: ["React", "TypeScript", "Zustand", "DND", "실시간 협업"],
      image: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&w=800&q=80",
      link: "https://example.com",
      github: "https://github.com"
    },
    {
      id: "proj-2",
      title: "개인화 인공지능 요약 일기장 (MindNotes)",
      period: "2025.09 - 2025.11 (2개월)",
      description: "매일 작성하는 일기 속 감정 상태를 분석하고 한 줄 요약 및 격려 문구를 자동으로 제공하는 프라이빗 일기 서비스입니다.",
      details: "• 주요 역할: 프론트엔드 인터페이스 구현 및 Gemini API 프롬프트 엔지니어링\n• 기술 스택: Next.js, Tailwind CSS, Google Gemini API, Firebase Auth & Firestore\n• 주요 성과:\n  - 감정 데이터 기반의 다채로운 레이아웃 테마(행복, 차분, 고민, 슬픔) 동적 반영\n  - Recharts를 사용하여 최근 한 달간의 감정 추이 변화를 한눈에 알아볼 수 있는 인터랙티브 대시보드 구축\n  - 오프라인 모드를 적용하여 네트워크 단절 시에도 일기 작성이 유지되며, 재연결 시 파이어베이스 동기화 구현",
      tags: ["Next.js", "Gemini API", "Recharts", "Firebase", "Tailwind"],
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
      link: "https://example.com",
      github: "https://github.com"
    },
    {
      id: "proj-3",
      title: "초고성능 가구 커머스 프론트 최적화",
      period: "2025.04 - 2025.07 (3개월)",
      description: "수많은 고해상도 3D 이미지와 카탈로그를 지닌 쇼핑몰의 웹 성능 및 코어 웹 바이탈을 획기적으로 개선한 프로젝트입니다.",
      details: "• 주요 역할: 프론트엔드 성능 최적화 전담 및 웹 바이탈 측정 시스템 도입\n• 기술 스택: React, Vite, Lighthouse, Workbox (PWA), Cloudflare\n• 주요 성과:\n  - 이미지 레이지 로딩과 WebP 변환 및 사이즈 리사이징 기법 도입으로 리소스 다운로드 크기 65% 절감\n  - 정적 애셋 캐싱을 위한 Service Worker 모듈 구성\n  - Google Lighthouse 성능 스코어 61점에서 98점으로 대폭 상향, LCP(Largest Contentful Paint) 3.8초에서 1.2초로 대폭 단축",
      tags: ["성능 최적화", "Web Vitals", "PWA", "Vite", "Lighthouse"],
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
      link: "https://example.com",
      github: "https://github.com"
    }
  ],
  experience: [
    {
      id: "exp-1",
      role: "Frontend Engineer (선임)",
      company: "(주)테크이노베이터 (TechInnovators Inc.)",
      period: "2024.03 - 현재 (재직 중)",
      description: "비즈니스 효율 극대화를 위한 전사 관리 시스템 및 기업용 대시보드 웹 개발 리드",
      achievements: [
        "신규 핵심 프로덕트 대시보드의 아키텍처 설계를 리드하며, 유지보수성이 극대화된 모듈형 컴포넌트 구조 확립",
        "비즈니스 실무자들이 사용하는 필터 및 커스텀 테이블의 로딩 성능을 가상 스크롤(Virtual Scroll) 도입을 통해 데이터 1만 건 기준 렌더링 속도 5배 향상",
        "신입 엔지니어 멘토링 및 사내 FE 기술 세미나 8회 주최, 코드 리뷰 문화 주도"
      ]
    },
    {
      id: "exp-2",
      role: "Web Frontend Developer",
      company: "에이프릴 소프트웨어 (April Software)",
      period: "2022.01 - 2024.02 (2년 2개월)",
      description: "B2C 모바일 친화형 쇼핑 플랫픔 및 이벤트 페이지 설계와 성능 유지 보수",
      achievements: [
        "마케팅 프로모션 마이크로 웹 페이지를 15개 이상 제작하며 기획/디자인팀과의 밀접한 애자일 스프린트 프로세스 수행",
        "Webpack 환경에서 Vite 환경으로의 성공적인 이전을 이끌어 개발 서버 초기 구동 시간 40초에서 1.5초로 96% 단축",
        "공통 UI 버튼, 모달, 폼 요소 컴포넌트를 라이브러리화하여 개발 생산성 30% 증가 기여"
      ]
    }
  ],
  guestbook: [
    {
      id: "msg-1",
      sender: "김미라 (제품 디자이너)",
      message: "민우님! 포트폴리오 사이트가 정말 깔끔하고 멋지네요. 특히 세부 프로젝트 내용에 들어간 UI 성능 최적화 설명이 엄청 인상 깊습니다! 나중에 같이 일해보고 싶어요~ 😊",
      timestamp: "2026-06-22T14:30:00Z"
    },
    {
      id: "msg-2",
      sender: "박성호 (팀 리더)",
      message: "언제나 맡은 일 이상을 해내며 팀의 든든한 기술 기둥이 되어주는 민우님의 포트폴리오를 보니 감회가 새롭네요. 앞으로의 발자취가 더욱 기대됩니다!",
      timestamp: "2026-06-23T09:15:00Z"
    }
  ]
};
