# Supabase Storage 설정 가이드 (5분 완성)

이 가이드는 동영상 및 이미지 파일을 Supabase Storage에 업로드하기 위한 설정입니다.

## 왜 Storage가 필요한가?

- **기존 방식의 문제**: Base64로 인코딩된 파일을 JSONB에 저장하면 1MB API 제한에 걸려 업로드 실패
- **Storage 방식의 장점**: 파일을 별도 저장소에 보관하고 URL만 DB에 저장 → 용량 제한 없음 (최대 5GB)

---

## 1단계: Supabase Dashboard 접속

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 (`friend-board` 또는 본인의 프로젝트명)

---

## 2단계: Storage 버킷 생성

### 2-1. Storage 메뉴로 이동
- 왼쪽 사이드바에서 **🗄️ Storage** 클릭

### 2-2. 새 버킷 생성
1. **"New bucket"** 버튼 클릭
2. 다음 정보 입력:
   - **Name**: `media` (정확히 이 이름으로 입력)
   - **Public bucket**: ✅ **체크** (누구나 파일을 볼 수 있도록)
   - **File size limit**: 100MB (또는 원하는 크기)
   - **Allowed MIME types**: 비워두기 (모든 파일 형식 허용)

3. **"Create bucket"** 버튼 클릭

### 2-3. 버킷 생성 확인
- Storage 목록에 `media` 버킷이 표시되어야 함
- Public 배지가 표시되어야 함

---

## 3단계: Storage 정책 설정 (RLS)

버킷을 생성한 후, 모든 사용자가 파일을 업로드하고 읽을 수 있도록 정책을 설정해야 합니다.

### 3-1. 정책 설정 페이지로 이동
1. `media` 버킷 클릭
2. 상단의 **"Policies"** 탭 클릭

### 3-2. 읽기 정책 추가
1. **"New policy"** 버튼 클릭
2. **"For full customization"** 선택
3. 다음 정보 입력:
   - **Policy name**: `Public read access`
   - **Allowed operation**: `SELECT` ✅ 체크
   - **Target roles**: `public` 선택
   - **USING expression**: `true` (모든 사용자 허용)

4. **"Review"** → **"Save policy"** 클릭

### 3-3. 업로드 정책 추가
1. 다시 **"New policy"** 버튼 클릭
2. **"For full customization"** 선택
3. 다음 정보 입력:
   - **Policy name**: `Public insert access`
   - **Allowed operation**: `INSERT` ✅ 체크
   - **Target roles**: `public` 선택
   - **WITH CHECK expression**: `true` (모든 사용자 허용)

4. **"Review"** → **"Save policy"** 클릭

### 3-4. 삭제 정책 추가 (선택사항)
1. 다시 **"New policy"** 버튼 클릭
2. **"For full customization"** 선택
3. 다음 정보 입력:
   - **Policy name**: `Public delete access`
   - **Allowed operation**: `DELETE` ✅ 체크
   - **Target roles**: `public` 선택
   - **USING expression**: `true` (모든 사용자 허용)

4. **"Review"** → **"Save policy"** 클릭

---

## 4단계: 설정 확인

### 4-1. 정책 확인
`media` 버킷의 **Policies** 탭에서 다음 정책이 있어야 합니다:
- ✅ `Public read access` (SELECT)
- ✅ `Public insert access` (INSERT)
- ✅ `Public delete access` (DELETE) - 선택사항

### 4-2. Public 설정 확인
- `media` 버킷 옆에 **"Public"** 배지가 표시되어야 함

---

## 5단계: 개발 서버 재시작

코드 변경사항을 적용하기 위해 개발 서버를 재시작합니다.

```bash
# 현재 실행 중인 서버가 있다면 Ctrl+C로 중지

# 개발 서버 시작
npm run dev
```

---

## 6단계: 테스트

### 6-1. 이미지 업로드 테스트
1. 브라우저에서 http://localhost:5173 접속
2. **"+ 새 글 작성"** 버튼 클릭
3. 작은 이미지 파일(1-2MB) 업로드
4. 업로드 진행 표시 확인
5. **"작성하기"** 버튼 클릭
6. 게시물이 정상적으로 등록되는지 확인

### 6-2. 동영상 업로드 테스트
1. 다시 **"+ 새 글 작성"** 버튼 클릭
2. 큰 동영상 파일(50-100MB) 업로드
3. 업로드 진행 표시 확인
4. **"작성하기"** 버튼 클릭
5. 게시물이 정상적으로 등록되는지 확인
6. 게시물 클릭 → 동영상 재생 확인

### 6-3. Supabase Storage에서 확인
1. Supabase Dashboard → Storage → `media` 버킷
2. `posts/` 폴더에 업로드된 파일이 표시되어야 함
3. 파일명 형식: `타임스탬프-랜덤문자열.확장자`

---

## ❌ 문제 발생 시

### "Failed to upload file" 에러
**원인**: Storage 정책이 올바르게 설정되지 않았습니다.

**해결방법**:
1. Supabase Dashboard → Storage → `media` → Policies
2. 위의 3단계 정책을 다시 확인
3. `public` role에 대한 INSERT 권한이 있는지 확인

### "Bucket not found" 에러
**원인**: 버킷 이름이 `media`가 아닙니다.

**해결방법**:
1. Storage 메뉴에서 버킷 이름이 정확히 `media`인지 확인
2. 다른 이름이면 `src/utils/storageUpload.js`에서 버킷 이름 수정

### 파일이 업로드되지만 이미지가 표시되지 않음
**원인**: 버킷이 Public으로 설정되지 않았습니다.

**해결방법**:
1. Storage → `media` 버킷 설정
2. **"Make public"** 버튼 클릭

### 브라우저 콘솔에서 CORS 에러
**원인**: Supabase Storage CORS 설정 문제 (드물게 발생)

**해결방법**:
1. Supabase는 기본적으로 모든 origin을 허용하므로 문제가 없어야 함
2. 계속 발생하면 Supabase Support에 문의

---

## 🎉 완료!

이제 큰 동영상과 여러 파일을 문제없이 업로드할 수 있습니다!

### 변경사항 요약
- ✅ 파일을 Supabase Storage에 직접 업로드
- ✅ JSONB에는 URL만 저장 (1MB 제한 우회)
- ✅ 최대 5GB 파일 지원
- ✅ 기존 Base64 게시물도 계속 표시 가능 (하위 호환성)

### 다음 단계
- 기존 Base64 게시물 마이그레이션 (선택사항)
- GitHub Pages에 배포
- 친구들과 공유!

---

## 📚 참고 자료

- [Supabase Storage 공식 문서](https://supabase.com/docs/guides/storage)
- [Storage RLS 정책](https://supabase.com/docs/guides/storage/security/access-control)
- [코드 변경사항](https://github.com/SkiDye/friend-board/commits/main)
