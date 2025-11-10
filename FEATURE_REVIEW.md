# 기능 검토 보고서

## 1. 검색 기능 (제목 + 본문)

### ✅ 구현 가능
완전히 구현 가능하며, 두 가지 방식이 있습니다.

### 방식 A: 프론트엔드 필터링 (추천)

**장점:**
- 구현 간단 (10분)
- 빠른 검색 (클라이언트에서 즉시 필터링)
- 추가 DB 쿼리 불필요

**단점:**
- 모든 게시글을 먼저 불러와야 함
- 게시글이 1000개 이상일 때 느려질 수 있음

**적합한 경우:**
- 친구들끼리 쓰는 게시판 (게시글 수백 개 이하)
- 빠른 반응 속도 필요

### 방식 B: Supabase 서버 검색

**장점:**
- 게시글이 많아도 빠름
- 필요한 데이터만 불러옴

**단점:**
- 구현 복잡 (20분)
- DB 쿼리 사용 (무료 플랜 제한 있음)

**적합한 경우:**
- 게시글이 매우 많을 때 (1000개 이상)

### 추천: 방식 A (프론트엔드 필터링)
친구들 게시판이므로 게시글이 많지 않을 것 → 간단하고 빠른 방식 A 추천

---

## 2. 스크롤 위치 저장 (읽은 위치 기억)

### ✅ 구현 가능
localStorage를 사용하여 완전히 구현 가능합니다.

### 동작 방식

**저장:**
```
사용자가 게시물 목록 스크롤
  ↓
스크롤 위치를 localStorage에 저장
  ↓
브라우저별로 독립적 저장
```

**복원:**
```
게시판 페이지 접속
  ↓
localStorage에서 저장된 위치 읽기
  ↓
자동으로 해당 위치로 스크롤
```

### 저장 정보
- 스크롤 Y 위치
- 마지막 본 게시물 ID
- 타임스탬프 (7일 후 자동 삭제)

### 장점
- ✅ 브라우저별로 독립적 (폰/PC 각각 저장)
- ✅ 추가 서버 비용 없음 (localStorage 사용)
- ✅ 즉시 복원 (빠름)
- ✅ 프라이버시 보호 (서버에 저장 안 함)

### 단점
- ❌ 브라우저 캐시 삭제 시 초기화
- ❌ 시크릿 모드는 저장 안 됨
- ❌ 다른 기기와 동기화 안 됨 (의도된 동작)

### 적합성
친구들 게시판에 매우 적합! 각자 브라우저에서 읽던 위치를 기억합니다.

---

## 3. 구현 우선순위

### 높음 ⭐⭐⭐
1. **검색 기능** - 게시물 찾기 편함
2. **스크롤 위치 저장** - UX 크게 개선

둘 다 구현 추천!

---

## 4. 예상 개발 시간

| 기능 | 예상 시간 | 난이도 |
|------|----------|--------|
| 검색 (방식 A) | 10-15분 | 쉬움 |
| 스크롤 저장 | 15-20분 | 중간 |
| **합계** | **25-35분** | - |

---

## 5. 기술 상세

### 검색 기능 구현

```javascript
// 검색 상태
const [searchQuery, setSearchQuery] = useState('')

// 필터링
const filteredPosts = posts.filter(post => 
  post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  post.content.toLowerCase().includes(searchQuery.toLowerCase())
)
```

### 스크롤 저장 구현

```javascript
// 저장
useEffect(() => {
  const handleScroll = () => {
    localStorage.setItem('boardScrollPos', window.scrollY)
    localStorage.setItem('boardScrollTime', Date.now())
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// 복원
useEffect(() => {
  const savedPos = localStorage.getItem('boardScrollPos')
  const savedTime = localStorage.getItem('boardScrollTime')
  
  // 7일 이내 데이터만 복원
  if (savedPos && savedTime) {
    const daysSince = (Date.now() - savedTime) / (1000 * 60 * 60 * 24)
    if (daysSince < 7) {
      window.scrollTo(0, parseInt(savedPos))
    }
  }
}, [])
```

---

## 6. 결론

### 검색 기능
✅ **구현 추천** - 게시물 많아질 때 필수

### 스크롤 위치 저장
✅ **구현 추천** - UX 크게 개선, 구현 쉬움

### 총평
둘 다 구현 가능하고, 친구 게시판에 매우 유용한 기능입니다.
약 30분이면 둘 다 구현 가능합니다.

---

## 7. 추가 고려사항

### localStorage 용량
- 검색 기록: 없음
- 스크롤 위치: ~50 bytes
- 총 용량: 매우 작음 (문제없음)

### 브라우저 호환성
- localStorage: 모든 모던 브라우저 지원
- 스크롤 복원: 모든 브라우저 지원

### 프라이버시
- 모든 데이터가 브라우저에만 저장됨
- 서버에 전송되지 않음
