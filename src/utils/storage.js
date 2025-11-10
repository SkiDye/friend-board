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
 * GitHub Pages 용량 대비 사용률 계산 (%)
 */
export const getUsagePercentage = (usedBytes) => {
  const GITHUB_PAGES_LIMIT = 1024 * 1024 * 1024 // 1GB
  return ((usedBytes / GITHUB_PAGES_LIMIT) * 100).toFixed(4)
}
