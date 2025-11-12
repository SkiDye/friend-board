-- Friend Board 개발 변천사 패치노트
-- Supabase SQL Editor에서 실행하세요

-- v0.1.0 - Initial Release
INSERT INTO patch_notes (version, title, content) VALUES (
  'v0.1.0',
  'Initial Release - 최초 출시',
  '🎉 **Friend Board 탄생!**

## 구조
- **Frontend**: React + Vite
- **Styling**: Tailwind CSS (유틸리티 우선)
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query
- **Routing**: React Router DOM

## 핵심 기능
✅ 게시글 작성/수정/삭제
✅ **이미지 업로드 (Base64)**: 드래그앤드롭 지원
✅ 이미지 순서 조정 (화살표 버튼)
✅ 유튜브 영상 임베드 (URL 자동 감지)
✅ 검색 기능 (제목 + 내용)
✅ 스크롤 위치 기억 (7일간 유지)
✅ 모바일 반응형 디자인

## 문제점
❌ **이미지를 Base64로 DB에 저장**
- 500MB DB 용량 제한에 빠르게 도달
- Base64 인코딩으로 33% 용량 증가
- 큰 이미지 로드 시 성능 저하

## 사용된 기술
- **React Query**: 서버 상태 관리 및 캐싱
- **Supabase**: 백엔드 서비스 (Auth, Database)
- **Tailwind CSS**: 빠른 스타일링
- **Vite**: 초고속 개발 서버'
);

-- v0.2.0 - Gallery UI Improvements
INSERT INTO patch_notes (version, title, content) VALUES (
  'v0.2.0',
  'Gallery UI Improvements - 갤러리 UI 전면 개편',
  '🎨 **DCInside 스타일 갤러리**

## 구조 변경
- **Before**: 리스트 형식
- **After**: 그리드 갤러리 (2/3/4열 반응형)
- **카드 스타일**: 정사각형 비율

## 개선 사항
✅ **제목 표시 개선**
- 반투명 배경 → **완전 검정 배경**
- 말줄임표(...) 제거 → **전체 제목 표시**
- 닫기 버튼 위치 변경 (우측 하단)

✅ **갤러리 카드 통일**
- 이미지 있음: 이미지 표시
- 이미지 없음: 내용 미리보기 표시
- 모든 카드 하단: 검정 배경 + 제목

## 사용된 아이디어
- **DCInside 스타일**: 정사각형 썸네일 + 제목 오버레이
- **CSS Grid**: 반응형 갤러리 레이아웃'
);

-- v0.3.0 - Media Support
INSERT INTO patch_notes (version, title, content) VALUES (
  'v0.3.0',
  'Media Support - 동영상 및 다양한 미디어 지원',
  '🎬 **멀티미디어 시대**

## 구조 확장
- **이미지**: JPG, PNG, GIF, WebP
- **동영상**: MP4, WebM, OGG

## 파일 크기 제한
- 이미지: **50MB**
- 동영상: **100MB**

## 핵심 기능
✅ **동영상 업로드 및 재생**
- 썸네일에서 호버 시 자동 재생
- 상세보기에서 controls 제공
- 기본 볼륨 **50%** 설정

✅ **GIF 및 WebP 지원**
- 움직이는 이미지 정상 표시
- 고품질 이미지 포맷 지원

## 문제점
⚠️ **대용량 파일 문제**
- 100MB 동영상 → Base64로 133MB
- DB 용량 압박 심화

→ **v1.0.0에서 Storage Migration으로 해결**'
);

-- v0.4.0 - Community Features
INSERT INTO patch_notes (version, title, content) VALUES (
  'v0.4.0',
  'Community Features - 커뮤니티 기능 추가',
  '💬 **소통의 시작**

## 구조 추가
- **댓글 시스템**: posts 테이블의 comments 배열
- **JSON 형식**: `[{id, text, created_at}, ...]`

## 핵심 기능
✅ **댓글 작성/삭제**
- 댓글 작성 폼
- 호버 시 삭제 버튼 표시
- 작성 시간 표시

## 문제점
❌ **댓글 작성 후 지연**
- 서버 응답 대기 (1-2초)
- 새로고침해야 댓글 표시
- 답답한 사용자 경험

→ **v1.2.0에서 Optimistic UI로 해결**'
);

-- v0.5.0 - Performance Optimization
INSERT INTO patch_notes (version, title, content) VALUES (
  'v0.5.0',
  'Performance Optimization - 로딩 성능 최적화',
  '⚡ **속도가 곧 경쟁력**

## 구조 개선
- **Before**: 모든 데이터 한 번에 로드
- **After**: 갤러리/상세보기 분리

## 핵심 아이디어
✅ **쿼리 분리**
```javascript
// 갤러리용: 썸네일만
usePosts() → images[0], imageCount

// 상세보기용: 전체 데이터
usePost(id) → images[], comments[]
```

✅ **Storage 계산 최적화**
- 별도 hook (`usePostsForStorage`)
- 1분간 캐시
- 자동 새로고침 비활성화

## 개선 결과
- ✅ 초기 로딩 시간 감소
- ✅ 메모리 사용량 감소
- ✅ 불필요한 데이터 전송 제거'
);

-- v1.0.0 - Storage Migration
INSERT INTO patch_notes (version, title, content) VALUES (
  'v1.0.0',
  'Storage Migration - Supabase Storage로 대전환',
  '📦 **Base64에서 Object Storage로**

## 구조 변경
```javascript
// Before
{ data: "data:image/jpeg;base64,/9j/4AAQ..." }

// After
{
  url: "https://.../storage/.../media/...",
  path: "posts/123456_abc.jpg",
  size: 1024000
}
```

## 문제점 인식
❌ **Base64의 근본적인 문제**
1. 500MB DB 용량 부족
2. 33% 용량 증가 (인코딩 오버헤드)
3. 대용량 파일 로드 시 느림
4. DB 백업 크기 증가

## 해결책
✅ **Supabase Storage 도입**
- S3 호환 객체 스토리지
- 1GB 용량 제공
- URL 기반 접근
- RLS (Row Level Security)

✅ **마이그레이션 스크립트**
- Base64 → Blob 변환
- Storage 업로드
- DB 레코드 업데이트
- **33개 이미지 성공적으로 이전**

## 사용된 기술
- **Supabase Storage**: S3 호환 객체 스토리지
- **Blob API**: Base64 ↔ Binary 변환
- **RLS**: 파일 접근 권한 관리

## 개선 결과
- **용량**: 500MB → **1.5GB** (DB 500MB + Storage 1GB)
- **성능**: 파일 독립 로딩으로 속도 향상
- **확장성**: 대용량 파일 지원 가능'
);

-- v1.1.0 - UX Improvements
INSERT INTO patch_notes (version, title, content) VALUES (
  'v1.1.0',
  'UX Improvements - 사용자 경험 대폭 개선',
  '✨ **Progressive Loading 구현**

## 문제점
❌ "게시글을 불러오는 중..." 텍스트만 표시
❌ 이미지 로드 상태 불명확
❌ 첫 방문 시 느린 느낌

## 해결책
✅ **LazyImage 컴포넌트**
- 스켈레톤 UI (로딩 중)
- 페이드인 효과 (로드 완료)
- 에러 처리 (로드 실패)

✅ **BoardSkeleton 컴포넌트**
- 게시판 그리드 레이아웃 미리 표시
- 8개 카드 스켈레톤
- 로딩 중임을 시각적으로 표현

✅ **Storage 사용량 실시간 조회**
- Supabase Storage API 호출
- 재귀적 폴더 탐색
- DB + Storage 분리 표시

## 사용된 기술
- **Skeleton UI Pattern**: 로딩 상태 시각화
- **CSS Transitions**: 부드러운 페이드인
- **React Suspense 패턴**: 점진적 로딩

## 개선 결과
- ✅ 체감 로딩 속도 향상
- ✅ 사용자 피드백 즉각 제공
- ✅ 프로페셔널한 UX'
);

-- v1.2.0 - Optimistic UI Updates
INSERT INTO patch_notes (version, title, content) VALUES (
  'v1.2.0',
  'Optimistic UI Updates - 낙관적 UI 업데이트 도입',
  '⚡ **즉시 반영되는 댓글**

## 문제점
❌ 댓글 작성 → 등록 → **1-2초 대기** → 표시
❌ 삭제도 동일한 지연
❌ 답답한 사용자 경험

## 해결책 - Optimistic UI Pattern
```javascript
// 1. 즉시 UI 업데이트 (0.001초)
onMutate: async ({ commentText }) => {
  queryClient.setQueryData([''post'', id], {
    ...post,
    comments: [...comments, 임시댓글]
  })
  return { 백업데이터 }
}

// 2. 백그라운드 서버 요청
mutationFn: async () => {
  await supabase.댓글저장()
}

// 3. 성공 시 서버 데이터로 교체
onSettled: () => {
  queryClient.invalidateQueries()
}

// 4. 실패 시 자동 롤백
onError: (err, vars, context) => {
  queryClient.setQueryData(context.백업데이터)
}
```

## 핵심 아이디어
💡 **"눈속임" 전략**
1. 서버에 요청 보냄
2. **동시에** 화면에 즉시 표시
3. 성공하면 진짜 데이터로 교체
4. 실패하면 롤백

## 실제 사례
- **Twitter/X**: 트윗, 좋아요
- **Instagram**: 좋아요, 댓글
- **Gmail**: 메일 발송 (5초 취소)

## 개선 결과
- **Before**: 1-2초 지연
- **After**: **0.001초** 즉시 반영
- 사용자 만족도 급상승 📈'
);

-- v1.3.0 - Patch Notes System
INSERT INTO patch_notes (version, title, content) VALUES (
  'v1.3.0',
  'Patch Notes System - 패치노트 시스템 구축',
  '📋 **개발 변천사를 기록하다**

## 구조 추가
```sql
CREATE TABLE patch_notes (
  id BIGINT PRIMARY KEY,
  version TEXT,
  title TEXT,
  content TEXT (Markdown),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 핵심 설계
✅ **독립적인 메타데이터 저장소**
- posts 테이블과 완전 분리
- 게시물 로딩에 **0% 영향**
- 별도 queryKey (`patchNotes`)

✅ **타임라인 UI**
- 가로로 긴 레이아웃
- 버전 뱃지 + 타임라인 선
- 카드 형태로 각 패치노트 표시

✅ **마크다운 지원**
- react-markdown으로 렌더링
- 제목, 목록, 굵게, 링크 등
- Claude Code가 작성하기 쉬움

## 사용된 기술
- **react-markdown**: 마크다운 렌더링
- **Timeline UI Pattern**: 시간순 표시
- **Markdown**: 구조화된 텍스트 포맷

## 활용 방안
📝 **Claude Code에게 작성 시키기**
```
Claude, 패치노트를 작성해줘:
- 버전: v1.3.0
- 제목: 패치노트 시스템
- 내용: 방금 구현한 기능들 정리
```

## 개발 철학
> **"사용자는 기다리기 싫어한다"**
→ Optimistic UI, Progressive Loading

> **"확장성을 고려하라"**
→ Storage Migration, Query Separation

> **"독립성을 유지하라"**
→ 패치노트 분리, 쿼리 분리

> **"피드백은 즉각적이어야 한다"**
→ 스켈레톤 UI, 즉시 반영'
);

-- 완료 메시지
SELECT '✅ 9개 패치노트가 성공적으로 추가되었습니다!' as result;
