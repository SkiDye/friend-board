-- ⚠️ 게시글은 유지하고, 필요없는 컬럼만 제거합니다

-- author 컬럼 제거 (작성자 정보)
ALTER TABLE posts DROP COLUMN IF EXISTS author;

-- comment_count 컬럼 제거 (댓글 수)
ALTER TABLE posts DROP COLUMN IF EXISTS comment_count;

-- 확인: 남아있는 컬럼 보기
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts';

-- 확인: 게시글 데이터 보기 (제목, 날짜만)
SELECT id, title, created_at FROM posts ORDER BY created_at DESC;
