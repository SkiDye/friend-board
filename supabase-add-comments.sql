-- 기존 posts 테이블에 comments 컬럼 추가
ALTER TABLE posts ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb;
