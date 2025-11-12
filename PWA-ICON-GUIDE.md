# PWA 아이콘 생성 가이드

프렌드보드를 완전한 앱처럼 사용하려면 아이콘이 필요합니다!

## 방법 1: 온라인 아이콘 생성기 (추천)

### 1. PWA Asset Generator 사용
https://www.pwabuilder.com/imageGenerator

1. 사이트 접속
2. 512x512 크기의 이미지 업로드 (또는 직접 디자인)
3. "Generate" 클릭
4. 다운로드된 `icon-192.png`, `icon-512.png` 파일을 `public/` 폴더에 복사

### 2. Favicon Generator 사용
https://realfavicongenerator.net/

1. 사이트 접속
2. 이미지 업로드
3. iOS, Android 옵션 설정
4. 생성된 아이콘들 다운로드
5. `icon-192.png`, `icon-512.png`를 `public/` 폴더에 복사

## 방법 2: 직접 만들기

### 필요한 크기
- `icon-192.png` - 192x192px
- `icon-512.png` - 512x512px

### 디자인 팁
- 📝 게시판 아이콘 또는 이모지 사용
- 심플한 디자인이 가장 좋음
- 배경색: `#1a1a1a` (어두운 회색)
- 아이콘 색: `#ffffff` (흰색)

### 추천 도구
- Figma (무료)
- Canva (무료)
- Photoshop
- GIMP (무료)

## 현재 상태

✅ PWA 기본 설정 완료
⏳ 아이콘만 추가하면 완벽!

아이콘을 추가한 후:
1. `npm run build` 실행
2. `git add public/icon-192.png public/icon-512.png`
3. `git commit -m "Add PWA icons"`
4. `git push`

그러면 모바일에서 "홈 화면에 추가"할 수 있습니다!
