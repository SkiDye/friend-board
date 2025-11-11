/**
 * 유튜브 URL에서 비디오 ID를 추출합니다
 * @param {string} url - 유튜브 URL
 * @returns {string|null} - 비디오 ID 또는 null
 */
export const extractYoutubeId = (url) => {
  if (!url) return null
  
  // 다양한 유튜브 URL 패턴 지원
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
    /(?:youtube\.com\/embed\/)([\w-]+)/,
    /(?:youtube\.com\/v\/)([\w-]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

/**
 * 텍스트에서 유튜브 URL을 찾습니다
 * @param {string} text - 검색할 텍스트
 * @returns {string[]} - 발견된 유튜브 URL 배열
 */
export const findYoutubeUrls = (text) => {
  if (!text) return []

  const urlPattern = /(https?:\/\/(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\/[^\s]+)/g
  const matches = text.match(urlPattern)

  return matches || []
}

/**
 * 유튜브 임베드 URL을 생성합니다
 * @param {string} videoId - 비디오 ID
 * @returns {string} - 임베드 URL (기본 볼륨 50%)
 */
export const getYoutubeEmbedUrl = (videoId) => {
  // volume 파라미터는 YouTube iframe API에서 지원하지 않음
  // 대신 플레이어 로드 시 50%로 설정하도록 안내
  return "https://www.youtube.com/embed/" + videoId
}
