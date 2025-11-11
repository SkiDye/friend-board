import { supabase } from '../lib/supabase'

/**
 * Supabase Storage에 파일 업로드
 * @param {File} file - 업로드할 파일
 * @param {string} bucket - 버킷 이름 (기본값: 'media')
 * @returns {Promise<{url: string, path: string, error: null} | {error: Error}>}
 */
export const uploadFileToStorage = async (file, bucket = 'media') => {
  try {
    // 고유한 파일명 생성 (타임스탬프 + 랜덤 + 원본 파일명)
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}-${randomString}.${fileExt}`
    const filePath = `posts/${fileName}`

    // Storage에 업로드
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      throw error
    }

    // Public URL 생성
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      url: urlData.publicUrl,
      path: filePath,
      error: null
    }
  } catch (error) {
    console.error('Upload failed:', error)
    return {
      error: error.message || '파일 업로드에 실패했습니다.'
    }
  }
}

/**
 * Storage에서 파일 삭제
 * @param {string} filePath - 삭제할 파일 경로
 * @param {string} bucket - 버킷 이름 (기본값: 'media')
 * @returns {Promise<{success: boolean, error: null} | {error: Error}>}
 */
export const deleteFileFromStorage = async (filePath, bucket = 'media') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Storage delete error:', error)
      throw error
    }

    return {
      success: true,
      error: null
    }
  } catch (error) {
    console.error('Delete failed:', error)
    return {
      error: error.message || '파일 삭제에 실패했습니다.'
    }
  }
}

/**
 * 여러 파일을 Storage에 업로드
 * @param {File[]} files - 업로드할 파일 배열
 * @param {Function} onProgress - 진행 상황 콜백 (current, total)
 * @returns {Promise<Array>} - 업로드된 파일 정보 배열
 */
export const uploadMultipleFiles = async (files, onProgress = null) => {
  const results = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (onProgress) {
      onProgress(i + 1, files.length, file.name)
    }

    const result = await uploadFileToStorage(file)

    if (result.error) {
      results.push({
        name: file.name,
        type: file.type,
        size: file.size,
        error: result.error
      })
    } else {
      results.push({
        id: Date.now() + Math.random(),
        url: result.url,
        path: result.path,
        name: file.name,
        type: file.type,
        size: file.size,
        error: null
      })
    }
  }

  return results
}

/**
 * Storage URL에서 파일 경로 추출
 * @param {string} url - Storage Public URL
 * @returns {string|null} - 파일 경로
 */
export const extractPathFromUrl = (url) => {
  try {
    // URL 형식: https://xxx.supabase.co/storage/v1/object/public/media/posts/file.mp4
    const match = url.match(/\/public\/[^/]+\/(.+)$/)
    return match ? match[1] : null
  } catch (error) {
    console.error('Failed to extract path from URL:', error)
    return null
  }
}
