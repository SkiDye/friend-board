# GitHub Pages 배포 가이드

## 1단계: Git 저장소 초기화 및 푸시

### 1. Git 초기화 (이미 되어있으면 건너뛰기)
```bash
git init
```

### 2. 원격 저장소 연결
```bash
git remote add origin https://github.com/SkiDye/friend-board.git
```

### 3. 모든 파일 추가
```bash
git add .
```

### 4. 커밋 생성
```bash
git commit -m "Initial commit: Friend board with search and scroll features"
```

### 5. GitHub에 푸시
```bash
git branch -M main
git push -u origin main
```

---

## 2단계: GitHub Pages 설정

### 방법 A: GitHub Actions 자동 배포 (추천)

1. **GitHub 저장소 페이지 접속**
   - https://github.com/SkiDye/friend-board

2. **Settings 클릭**
   - 상단 탭에서 "Settings" 선택

3. **Pages 설정**
   - 왼쪽 메뉴에서 "Pages" 클릭
   - Source: "GitHub Actions" 선택

4. **완료!**
   - 자동으로 배포 워크플로우가 생성됨
   - 푸시할 때마다 자동 배포

### 방법 B: gh-pages 브랜치 사용

1. **gh-pages 패키지 설치**
```bash
npm install --save-dev gh-pages
```

2. **package.json 수정**
```json
{
  "homepage": "https://SkiDye.github.io/friend-board",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **배포 실행**
```bash
npm run deploy
```

4. **GitHub Pages 설정**
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "gh-pages" → "/" (root) 선택
   - Save

---

## 3단계: vite.config.js 설정 확인

프로젝트 루트의 `vite.config.js` 파일에 다음 설정이 있어야 합니다:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/friend-board/'  // ← 이 부분 중요!
})
```

---

## 4단계: 배포 확인

### 배포 URL
```
https://SkiDye.github.io/friend-board/
```

### 배포 상태 확인
1. GitHub 저장소 → "Actions" 탭
2. 워크플로우 실행 상태 확인
3. 초록색 체크 표시 → 배포 성공

### 배포 시간
- 첫 배포: 2-5분
- 이후 배포: 1-3분

---

## 5단계: Supabase 설정 (중요!)

GitHub Pages에서는 환경 변수를 사용할 수 없으므로, `.env` 파일의 내용을 코드에 직접 넣어야 합니다.

⚠️ **보안 주의**: `ANON_KEY`는 공개되어도 괜찮지만, `SERVICE_ROLE_KEY`는 절대 넣지 마세요!

---

## 문제 해결

### 404 Not Found
- `vite.config.js`에 `base: '/friend-board/'` 설정 확인
- GitHub Pages 설정에서 브랜치 확인

### 빈 페이지
- 브라우저 콘솔(F12)에서 에러 확인
- Supabase 설정 확인

### 이미지/CSS 안 보임
- `base` 설정 확인
- 빌드 후 다시 배포

---

## 업데이트 방법

코드 수정 후:

```bash
git add .
git commit -m "Update: 업데이트 내용"
git push
```

GitHub Actions를 사용하면 자동으로 재배포됩니다!

---

## 유용한 명령어

```bash
# 로컬 빌드 테스트
npm run build
npm run preview

# 배포 로그 확인
git log --oneline

# 원격 저장소 확인
git remote -v
```
