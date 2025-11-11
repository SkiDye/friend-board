-- Supabase Storage 버킷 생성 및 설정

-- 1. 'media' 버킷 생성 (이미지/동영상 저장용)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. 누구나 파일을 업로드할 수 있도록 허용
CREATE POLICY "Anyone can upload media"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'media');

-- 3. 누구나 파일을 볼 수 있도록 허용
CREATE POLICY "Anyone can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- 4. 누구나 파일을 삭제할 수 있도록 허용
CREATE POLICY "Anyone can delete media"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'media');

-- 5. 파일 업데이트 허용
CREATE POLICY "Anyone can update media"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'media');
