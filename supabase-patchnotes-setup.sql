-- 패치노트 테이블 생성
CREATE TABLE IF NOT EXISTS patch_notes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가 (최신순 정렬용)
CREATE INDEX IF NOT EXISTS patch_notes_created_at_idx ON patch_notes(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE patch_notes ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 읽기 가능
CREATE POLICY "Anyone can read patch notes"
ON patch_notes FOR SELECT
TO public
USING (true);

-- 정책: 누구나 작성 가능
CREATE POLICY "Anyone can insert patch notes"
ON patch_notes FOR INSERT
TO public
WITH CHECK (true);

-- 정책: 누구나 수정 가능
CREATE POLICY "Anyone can update patch notes"
ON patch_notes FOR UPDATE
TO public
USING (true);

-- 정책: 누구나 삭제 가능
CREATE POLICY "Anyone can delete patch notes"
ON patch_notes FOR DELETE
TO public
USING (true);

-- 샘플 데이터 (선택사항)
INSERT INTO patch_notes (version, title, content) VALUES
('v1.0.0', 'Initial Release', '🎉 Friend Board 첫 출시!

## 주요 기능
- 게시글 작성/수정/삭제
- 이미지/동영상 업로드 (드래그앤드롭)
- 유튜브 영상 임베드
- 댓글 기능
- 검색 기능
- 모바일 최적화'),

('v1.1.0', 'Storage Migration', '📦 Supabase Storage 마이그레이션

## 개선 사항
- Base64 → Supabase Storage 전환
- 점진적 이미지 로딩 (LazyImage)
- 로딩 스켈레톤 UI 추가
- Storage 사용량 실시간 조회
- DB + Storage 분리 표시 (총 1.5GB)'),

('v1.2.0', 'Optimistic Updates', '⚡ 댓글 즉시 반영

## 개선 사항
- Optimistic UI Update 적용
- 댓글 작성 시 즉시 표시
- 댓글 삭제 시 즉시 반영
- 에러 시 자동 롤백');
