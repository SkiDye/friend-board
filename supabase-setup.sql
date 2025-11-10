-- 게시글 테이블 생성
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);

-- Row Level Security (RLS) 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 게시글을 읽을 수 있도록 허용
CREATE POLICY "Anyone can read posts" ON posts
  FOR SELECT USING (true);

-- 모든 사용자가 게시글을 작성할 수 있도록 허용
CREATE POLICY "Anyone can create posts" ON posts
  FOR INSERT WITH CHECK (true);

-- 모든 사용자가 게시글을 수정할 수 있도록 허용
CREATE POLICY "Anyone can update posts" ON posts
  FOR UPDATE USING (true);

-- 모든 사용자가 게시글을 삭제할 수 있도록 허용
CREATE POLICY "Anyone can delete posts" ON posts
  FOR DELETE USING (true);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
