-- 샘플 패치노트 삭제 (v1.0.0, v1.1.0, v1.2.0)
-- 이 파일은 supabase-patchnotes-setup.sql에 포함된 샘플 데이터를 제거합니다

DELETE FROM patch_notes
WHERE version IN ('v1.0.0', 'v1.1.0', 'v1.2.0')
AND title IN ('Initial Release', 'Storage Migration', 'Optimistic Updates');

-- 결과 확인
SELECT '✅ 샘플 패치노트가 삭제되었습니다!' as result;
SELECT version, title, created_at FROM patch_notes ORDER BY id DESC;
