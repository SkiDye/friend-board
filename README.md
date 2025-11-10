# 친구 게시판 (Friend Board)

친구들끼리 자유롭게 소통할 수 있는 비공개 게시판입니다.

## 특징

- 📝 **디씨인사이드 스타일 게시판**: 익명 게시, 댓글, 대댓글 기능
- 🎨 **노션/쓰레드 스타일 디자인**: 깔끔하고 미니멀한 UI
- 🚀 **빠른 성능**: Vite + React 기반
- 🔒 **보안**: Supabase RLS로 친구만 접근 가능
- 📱 **반응형**: 모바일 지원

## 기술 스택

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `.env.example`을 복사하여 `.env` 파일 생성
3. Supabase 프로젝트 URL과 anon key를 입력

```bash
cp .env.example .env
```

### 3. 개발 서버 실행

```bash
npm run dev
```

## 프로젝트 구조

```
friend-board/
├── src/
│   ├── components/
│   │   ├── layout/       # 레이아웃 컴포넌트 (Sidebar, Header, MainLayout)
│   │   ├── board/        # 게시판 관련 컴포넌트
│   │   └── common/       # 공통 컴포넌트
│   ├── pages/            # 페이지 컴포넌트
│   ├── lib/              # 라이브러리 설정 (Supabase, React Query)
│   ├── hooks/            # Custom Hooks
│   └── utils/            # 유틸리티 함수
├── public/               # 정적 파일
└── ...
```

## 다음 단계

- [ ] Supabase 데이터베이스 스키마 생성
- [ ] 게시글 CRUD 기능 구현
- [ ] 댓글 시스템 구현
- [ ] 이미지 업로드 기능
- [ ] 사용자 인증 구현
- [ ] GitHub Pages 배포 설정

## 배포

### GitHub Pages 배포

1. `vite.config.js`에 base 설정 추가
2. GitHub Actions 워크플로우 설정
3. `npm run build && npm run deploy`

자세한 내용은 [Vite 공식 문서](https://vitejs.dev/guide/static-deploy.html)를 참고하세요.

## 라이선스

MIT
