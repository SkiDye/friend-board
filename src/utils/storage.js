/**
 * 문자열의 바이트 크기 계산
 */
export const getStringByteSize = (str) => {
  return new Blob([str]).size
}

/**
 * 게시글 데이터의 크기 계산 (바이트)
 * 이미지(base64), 제목, 내용 등 모든 데이터 포함
 */
export const getPostSize = (post) => {
  const jsonString = JSON.stringify(post)
  return getStringByteSize(jsonString)
}

/**
 * 전체 게시글 목록의 크기 계산 (바이트)
 */
export const getTotalPostsSize = (posts) => {
  return posts.reduce((total, post) => total + getPostSize(post), 0)
}

/**
 * 바이트를 읽기 쉬운 형식으로 변환
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

/**
 * Supabase Database 용량 대비 사용률 계산 (%)
 */
export const getUsagePercentage = (usedBytes) => {
  const SUPABASE_DB_LIMIT = 500 * 1024 * 1024 // 500MB
  return ((usedBytes / SUPABASE_DB_LIMIT) * 100).toFixed(4)
}

/**
 * Supabase Storage 용량 대비 사용률 계산 (%)
 */
export const getStorageUsagePercentage = (usedBytes) => {
  const SUPABASE_STORAGE_LIMIT = 1024 * 1024 * 1024 // 1GB
  return ((usedBytes / SUPABASE_STORAGE_LIMIT) * 100).toFixed(4)
}

/**
 * 전체 사용률 계산 (DB + Storage)
 */
export const getTotalUsagePercentage = (dbBytes, storageBytes) => {
  const SUPABASE_DB_LIMIT = 500 * 1024 * 1024 // 500MB
  const SUPABASE_STORAGE_LIMIT = 1024 * 1024 * 1024 // 1GB
  const TOTAL_LIMIT = SUPABASE_DB_LIMIT + SUPABASE_STORAGE_LIMIT // 1.5GB
  return (((dbBytes + storageBytes) / TOTAL_LIMIT) * 100).toFixed(2)
}

/**
 * posts 데이터에서 Storage 사용량 계산
 * images 배열의 size 필드를 합산
 */
export const getStorageSizeFromPosts = (posts) => {
  return posts.reduce((total, post) => {
    if (!post.images || post.images.length === 0) return total

    const postStorageSize = post.images.reduce((sum, image) => {
      // Storage에 저장된 파일만 계산 (url이 있고 size가 있는 경우)
      if (image.url && image.size) {
        return sum + image.size
      }
      // base64 데이터는 제외 (url이 없고 data만 있는 경우)
      return sum
    }, 0)

    return total + postStorageSize
  }, 0)
}
