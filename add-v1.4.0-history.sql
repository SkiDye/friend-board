-- v1.4.0 개발 히스토리 추가
-- Supabase SQL Editor에서 실행하세요

INSERT INTO patch_notes (version, title, content) VALUES (
  'v1.4.0',
  'Back Navigation Control - 뒤로가기 제어',
  '⬅️ **스마트한 뒤로가기 처리**

## 문제점
❌ 모바일에서 뒤로가기 누르면 페이지 탈출
❌ 모달 열린 상태에서도 페이지가 나가짐
❌ 의도치 않은 네비게이션으로 사용성 저하

## 해결책 - 브라우저 히스토리 API 활용

### 1️⃣ 게시판에서 뒤로가기 방지
```javascript
useEffect(() => {
  // 히스토리 엔트리 추가
  window.history.pushState(null, '''', window.location.href)

  const handlePopState = () => {
    if (모달 열림) {
      // 모달 닫기
      setIsModalOpen(false)
    } else {
      // 페이지 탈출 방지
      window.history.pushState(null, '''', window.location.href)
    }
  }

  window.addEventListener(''popstate'', handlePopState)
  return () => window.removeEventListener(''popstate'', handlePopState)
}, [isModalOpen])
```

### 2️⃣ 모달 열릴 때 히스토리 추가
```javascript
useEffect(() => {
  if (isDetailModalOpen || isWriteModalOpen) {
    window.history.pushState(null, '''', window.location.href)
  }
}, [isDetailModalOpen, isWriteModalOpen])
```

## 핵심 아이디어

💡 **히스토리 스택 조작**
- 모달 열림 → 히스토리 엔트리 추가
- 뒤로가기 감지 → 모달 상태 체크
- 모달 있음 → 모달 닫기
- 모달 없음 → 히스토리 다시 추가 (페이지 유지)

💡 **계층적 뒤로가기**
```
앱 탈출 ← 게시판 ← 모달 ← 사용자
            ↑         ↓
            └─────────┘ (뒤로가기 시 이동)
```

## 작동 흐름

1. **게시판 진입**
   - `pushState()` 호출 → 히스토리 버퍼 생성

2. **모달 열기**
   - `pushState()` 호출 → 또 다른 히스토리 엔트리

3. **뒤로가기 (모달 열림)**
   - `popstate` 이벤트 감지
   - 모달 닫기 + `pushState()` 호출
   - 결과: 게시판으로 돌아감

4. **뒤로가기 (모달 없음)**
   - `popstate` 이벤트 감지
   - `pushState()` 호출로 히스토리 유지
   - 결과: 게시판에 머물기

## 사용된 기술

- **History API**: `pushState()`, `popstate` 이벤트
- **React Hooks**: `useEffect()`, 의존성 배열
- **상태 기반 분기**: 모달 상태에 따른 동작 분리

## 개선 결과

✅ 모바일 사용성 대폭 개선
✅ 모달 ↔ ESC 키와 동일한 경험
✅ 실수로 페이지 나가는 것 방지
✅ 직관적인 네비게이션

## 실제 사례

- **Instagram**: 모달에서 뒤로가기 → 모달 닫기
- **Pinterest**: 이미지 상세보기 → 뒤로가기 → 그리드로
- **YouTube Mobile**: 영상 재생 → 뒤로가기 → 목록으로

→ 모바일 웹 앱의 표준 패턴'
);

-- 결과 확인
SELECT '✅ v1.4.0 개발 히스토리가 추가되었습니다!' as result;
SELECT version, title, created_at FROM patch_notes ORDER BY id DESC LIMIT 5;
