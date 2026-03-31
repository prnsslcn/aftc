# 아세아 비행교육원 웹사이트 (AFTC)

## 프로젝트 개요
아세아 비행교육원(Asea Flight Training Center) 공식 웹사이트.
해외 비행유학 사전교육을 중심으로, 예비 조종사 양성부터 항공사 입사까지 이어지는 통합 교육 시스템을 소개.

- **GitHub**: `prnsslcn/aftc` (public)
- **배포**: Vercel (main → 프로덕션 자동 배포)

## 기술 스택
- **Next.js 16** (App Router) — React 19
- **TypeScript**
- **Tailwind CSS v4** — PostCSS (`@tailwindcss/postcss`)
- **Framer Motion** — 스크롤 애니메이션, 페이지 트랜지션
- **Pretendard** — 한국어 기본 폰트
- **Outfit** — 영문 디스플레이 폰트 (`next/font/google`)
- **Iconify Solar** — 아이콘
- **next/image** — 이미지 최적화
- **패키지 매니저**: npm

## 프로젝트 명령어
```bash
npm run dev       # 개발 서버 (localhost:3000)
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버
npm run lint      # ESLint 실행
```

## 현재 상태 (2026-03-30)
- Next.js 프로젝트 초기화 완료 (create-next-app 기본 템플릿)
- 프로토타입 HTML이 `/Users/dev/Desktop/dev/index.html`에 존재 — 이것을 Next.js 컴포넌트로 마이그레이션해야 함
- 히어로 이미지 원본: `/Users/dev/Desktop/dev/hero-aircraft.jpg` → `public/images/`로 복사 필요
- Framer Motion, Pretendard 등 추가 의존성 아직 미설치

## Next.js 필수 규칙
- 브라우저 API(window, document, localStorage) 사용 컴포넌트는 반드시 파일 맨 위에 `'use client'` 선언
- 애니메이션, 이벤트 리스너, DOM 조작은 반드시 `useEffect` 안에서 실행
- `useState`, `useEffect` 사용하는 컴포넌트는 `'use client'` 필수
- Framer Motion `motion` 컴포넌트 사용 파일은 항상 `'use client'`
- 외부 스크립트는 `next/script` 사용
- 이미지는 항상 `next/image` 사용, 히어로는 `priority` 속성 추가

## 작업 방식
- 코드 작성 전에 반드시 구조/계획 먼저 제시 후 나의 확인을 받을 것
- 한 번에 전체 구현 금지 — 컴포넌트 단위로 하나씩 작업
- 각 컴포넌트 완성 후 확인 요청
- 작업 전 관련 파일 반드시 먼저 읽을 것
- 파일당 200줄 이하 유지

## 프로토타입에서 확정된 디자인 결정

### 히어로
- 격납고 내 항공기 사진 (어두운 톤) 풀스크린 배경
- 초기 **160% 확대** → 스크롤 시 히어로 높이의 **40% 지점**에서 100%로 줌아웃 완료
- 텍스트 word-by-word 등장 애니메이션 (블러 해제 + 회전)
- 스크롤 시 텍스트 페이드아웃 + 블러 (히어로 45% 지점에서 완료)

### 네비게이션
- **플로팅 pill** 스타일 (Template/index-ex.html에서 fork)
- `fixed top-6 left-1/2 -translate-x-1/2 rounded-full`
- `backdrop-blur-md bg-opacity-90 border border-white/10 shadow-2xl`
- 스크롤 시 shadow 강화 + border 밝기 증가
- 4탭: 교육원 소개 / 비행 유학 사전교육 / 비행학교(준비중) / 항공사 입사과정(준비중)

### 테마 (Supanova Design Skill 기반 — Vantablack Luxe)
- 배경 `#0a0a0a`, 카드 `white/[.03]`, 보더 `white/[.06]`
- 악센트: emerald (체크/상태), blue (FTD/Embry-Riddle)
- 노이즈 텍스처 오버레이

### 디자인 금지 사항
- Inter, Noto Sans KR, Roboto, Arial 폰트 금지 → Pretendard + Outfit 사용
- FontAwesome, Material Icons 금지 → Iconify Solar만 허용
- 이모지 금지
- 순수 검정 `#000000` 금지 → `#0a0a0a`
- `h-screen` 금지 → `min-h-[100dvh]`
- 보라/파랑 AI 그라디언트 금지
- 동일한 레이아웃 섹션 반복 금지

### 타이포그래피
- 한국어: `break-keep-all`, `leading-snug` ~ `leading-tight`
- 한국어는 자연스러운 합니다/하세요 체 (번역투 금지)
- "혁신적인", "획기적인", "차세대" 등 AI 클리셰 표현 금지

### 애니메이션
- **Framer Motion**: `useScroll`, `useTransform`, `motion` 컴포넌트
- 이징: `cubic-bezier(0.16, 1, 0.3, 1)` (Supanova 모션 시그니처)
- GPU 안전: `transform`과 `opacity`만 애니메이션
- `backdrop-blur`는 fixed/sticky 요소에만

### 이미지
- `next/image` 필수, 히어로는 `priority`, 나머지는 기본 lazy
- 개발 플레이스홀더: `picsum.photos/seed/{name}/{w}/{h}`
- 프로덕션: `/public/images/`

## 사이트 구조

### 네비게이션 (4탭)
| 탭 | 상태 | 링크 |
|---|---|---|
| 교육원 소개 | 활성 | `#intro` |
| 비행 유학 사전교육 | 활성 | `#programs` |
| 비행학교 | 준비중 | `/#` |
| 항공사 입사과정 교육 | 준비중 | `/#` |

### 메인 페이지 섹션 순서
1. **히어로** — 격납고 항공기 이미지, 줌아웃 스크롤, word-by-word 텍스트
2. **교육원 소개** — Why Asea 6가지 포인트, 벤토 그리드
3. **풀블리드 중간 이미지** — "Prepare to fly, before you fly"
4. **비행 유학 사전교육** — Ground School 13과목 + FTD Training 3과목, 4주/8주 과정 카드
5. **준비중 섹션** — 비행학교 / 항공사 입사과정 플레이스홀더
6. **CTA / 연락처** — 지원 폼 링크 + 담당자 연락처
7. **푸터**

### 라우팅
| 경로 | 페이지 | 상태 |
|---|---|---|
| `/` | 메인 랜딩 (교육원 소개 + 사전교육) | 활성 |
| `/flight-school` | 비행학교 | 준비중 |
| `/airline-prep` | 항공사 입사과정 교육 | 준비중 |

## 핵심 콘텐츠

### 교육원
- **명칭**: 아세아 비행교육원 (Asea Flight Training Center)
- **장비**: A320, B737, C172 FTD (Flight Training Device)
- **교육장소**: 아세아항공직업전문학교 (강의실 / C172 FTD 실습실)
- **협력**: Embry-Riddle Aeronautical University (엠브리 리들 항공대학교)
- **담당자**: 박노훈 (010-5192-0332)

### Why Asea (6가지)
1. 엠브리리들 항공대학 연계과정 보유
2. FTD 기반 실습 교육으로 이해도 향상
3. 해외 비행학교 연계 맞춤형 관리
4. 항공사 입사 준비과정까지 연계
5. 필기, 실기, 면접 통합 솔루션
6. 소수 정예 맞춤형 교육

### 4주 과정
- 대상: 미국 비행학교 입교 예정자
- 시간: 총 80시간 (이론 72h / 시뮬레이터 8h)
- 개강: 2026년 중
- 비용: 50만원 (C172 FTD 포함)

### 8주 과정 (Embry-Riddle 연계)
- 대상: 미국 대학교 항공운항학과 입학 예정자
- 시간: 총 160시간 (이론 140h / FTD 20h, 영어 교육 포함)
- 개강: 2026년 5월 확정 (Embry-Riddle 신입생과 함께 진행)
- 비용: 90만원 (C172 FTD 포함)

### Ground School 커리큘럼 (13과목)
FAR Introduction / Aerodynamics / Aircraft System / Aircraft Instrument / Airport & Airport Operation / Airspace / Navigation / Performance / Weight & Balance / Aviation Weather / Aviation Weather Service / Aeromedical & Night Operation / Safety of Flight

### FTD Training (3과목)
Checklist & Procedure / Maneuvers & Navigation / Instrument Interpretation

### 지원 링크
- Google Form: `https://docs.google.com/forms/d/e/1FAIpQLSeMWuAgbIi8-xprEo0Sv8G3M-xTmGLZXwNMyYq3KDeMJooAiQ/viewform`

## 파일 구조 (목표)
```
aftc/
├── public/
│   └── images/
│       ├── hero-aircraft.jpg
│       └── ...
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── flight-school/
│   │   │   └── page.tsx
│   │   └── airline-prep/
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Programs.tsx
│   │   │   ├── ComingSoon.tsx
│   │   │   └── Contact.tsx
│   │   └── ui/
│   │       ├── RevealOnScroll.tsx
│   │       ├── Counter.tsx
│   │       └── Button.tsx
│   └── lib/
│       └── constants.ts
├── CLAUDE.md
├── AGENTS.md
├── next.config.ts
├── tsconfig.json
└── package.json
```

## 참조 파일 (프로젝트 외부)
- **프로토타입 HTML**: `/Users/dev/Desktop/dev/index.html` — 마이그레이션 원본
- **히어로 이미지 원본**: `/Users/dev/Desktop/dev/hero-aircraft.jpg`
- **PDF 지침서**: `/Users/dev/Downloads/01.pdf` — 교육원 콘텐츠 원본
- **디자인 참조 템플릿**: `/Users/dev/Downloads/Template/index-ex.html` — nav 플로팅 pill 스타일 fork 원본

## 다음 작업
- [ ] 추가 의존성 설치 (framer-motion, @iconify/react 등)
- [ ] 히어로 이미지 → `public/images/` 복사
- [ ] 폰트 설정 (Pretendard + Outfit)
- [ ] 프로토타입 HTML → Next.js 컴포넌트 마이그레이션
- [ ] Vercel 배포 연결
- [ ] 실제 이미지 교체
- [ ] 비행학교 / 항공사 입사과정 페이지 (자료 수령 후)
- [ ] SEO, OG 이미지, sitemap, robots.txt
- [ ] Google Analytics 연동
- [ ] 접근성(a11y) 검토

@AGENTS.md