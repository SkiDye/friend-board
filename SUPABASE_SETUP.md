# Supabase 설정 가이드 (5분 완성)

## 1단계: Supabase 계정 생성 및 프로젝트 만들기

1. **Supabase 접속**
   - [https://supabase.com](https://supabase.com) 접속
   - "Start your project" 버튼 클릭

2. **계정 생성/로그인**
   - GitHub 계정으로 로그인 (추천)
   - 또는 이메일로 가입

3. **새 프로젝트 생성**
   - "New Project" 버튼 클릭
   - 다음 정보 입력:
     - **Name**: `friend-board` (원하는 이름)
     - **Database Password**: 강력한 비밀번호 (자동 생성된 것 사용 추천)
     - **Region**: `Northeast Asia (Seoul)` 선택 (한국이면 속도 빠름)
     - **Pricing Plan**: `Free` 선택
   - "Create new project" 버튼 클릭
   - ⏳ 1-2분 기다림 (프로젝트 생성 중)

---

## 2단계: 데이터베이스 테이블 생성

1. **SQL Editor 열기**
   - 왼쪽 메뉴에서 🔧 "SQL Editor" 클릭
   - 또는 상단에 "SQL Editor" 탭 클릭

2. **새 쿼리 작성**
   - "New query" 버튼 클릭 (또는 `+ New query`)

3. **SQL 코드 복사 & 붙여넣기**
   - 프로젝트 루트의 `supabase-setup.sql` 파일 열기
   - 전체 내용 복사 (Ctrl+A, Ctrl+C)
   - Supabase SQL Editor에 붙여넣기 (Ctrl+V)

4. **실행하기**
   - 오른쪽 하단의 "Run" 버튼 클릭 (또는 Ctrl+Enter / Cmd+Enter)
   - ✅ "Success. No rows returned" 메시지 확인

5. **테이블 확인 (선택사항)**
   - 왼쪽 메뉴에서 📊 "Table Editor" 클릭
   - `posts` 테이블이 생성되었는지 확인

---

## 3단계: API 키 복사하기

1. **Settings 열기**
   - 왼쪽 메뉴에서 ⚙️ "Project Settings" 클릭 (제일 하단)

2. **API 정보 확인**
   - 왼쪽에서 "API" 클릭
   - 다음 두 가지 정보를 복사:

   **① Project URL**
   ```
   https://abcdefghijk.supabase.co
   ```
   → 복사 버튼 클릭 (📋)

   **② anon public (공개 키)**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(긴 문자열)
   ```
   → 복사 버튼 클릭 (📋)

   ⚠️ **주의**: `service_role` 키는 절대 사용하지 마세요! (보안 위험)

---

## 4단계: 프로젝트에 API 키 입력하기

1. **VS Code에서 .env 파일 열기**
   - 프로젝트 루트의 `.env` 파일 열기

2. **API 키 붙여넣기**
   ```env
   VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
   ```
   
   ↑ 위 예시의 값을 **3단계에서 복사한 실제 값으로 바꾸기**

3. **파일 저장**
   - Ctrl+S (Windows) / Cmd+S (Mac)

---

## 5단계: 개발 서버 재시작

1. **터미널에서 현재 서버 중지**
   - Ctrl+C 눌러서 개발 서버 중지

2. **서버 다시 시작**
   ```bash
   npm run dev
   ```

3. **브라우저에서 확인**
   - http://localhost:5173 접속
   - 게시판 페이지로 이동

---

## 6단계: 테스트하기

### ✅ 정상 작동 확인

1. **게시글 작성**
   - "새 글 작성" 버튼 클릭
   - 제목, 내용, 이미지 추가
   - "작성하기" 버튼 클릭

2. **Supabase에서 확인**
   - Supabase 대시보드 → "Table Editor"
   - `posts` 테이블에 데이터가 추가되었는지 확인

3. **다른 브라우저에서 확인**
   - 새 브라우저 탭 열기 (또는 시크릿 모드)
   - 같은 URL 접속
   - 게시글이 보이는지 확인
   - 한 쪽에서 게시글 작성 → 다른 쪽에서 새로고침(F5) 하면 보임

### 💡 자동 업데이트
- 30초마다 자동으로 새 게시글을 확인합니다
- 또는 페이지를 새로고침(F5)하면 즉시 반영됩니다

### ❌ 문제 발생 시

**"게시글을 불러오는데 실패했습니다" 에러**
1. `.env` 파일의 URL과 Key가 정확한지 확인
2. 개발 서버를 재시작했는지 확인
3. 브라우저 콘솔(F12)에서 에러 메시지 확인

**게시글이 보이지 않음**
1. Supabase 대시보드 → SQL Editor
2. 위의 SQL 코드를 다시 실행
3. 특히 RLS 정책이 제대로 생성되었는지 확인

---

## 완료! 🎉

이제 친구들에게 GitHub Pages 링크를 공유하면 모두가 게시판을 사용할 수 있습니다!

### 다음 단계

**GitHub Pages에 배포하기**
```bash
npm run build
git add .
git commit -m "Add Supabase integration"
git push
```

배포 후 `https://yourusername.github.io/friend-board` 주소를 친구들과 공유하세요!

---

## 추가 정보

### 무료 플랜 제한
- 데이터베이스: 500MB
- 파일 저장소: 1GB
- 월간 대역폭: 5GB
- 동시 요청: 충분히 많음

친구들끼리 쓰기에 충분합니다!

### 보안 참고사항
- `.env` 파일은 절대 Git에 커밋하지 마세요 (이미 .gitignore에 추가됨)
- `VITE_SUPABASE_ANON_KEY`는 공개되어도 괜찮습니다 (RLS 정책으로 보호됨)
- `service_role` 키는 절대 프론트엔드에 넣지 마세요!

### 데이터 업데이트 주기
- 자동: 30초마다 새 데이터 확인
- 수동: F5(새로고침)로 즉시 확인
- 게시글 작성/수정/삭제 후 자동으로 목록 갱신
