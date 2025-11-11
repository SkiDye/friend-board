import { supabase } from '../lib/supabase'

/**
 * Supabase Storage에 파일 업로드
 * @param {File} file - 업로드할 파일
 * @param {string} folder - 저장할 폴더 경로 (예: 'posts/images')
 * @returns {Promise<{url: string, path: string}>} 업로드된 파일의 URL과 경로
 */
export const uploadFileToStorage = async (file, folder = 'posts') => {
  try {
    // 파일명 생성 (타임스탬프 + 랜덤값 + 원본파일명)
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const fileName = `${timestamp}_${random}_${file.name}`
    const filePath = `${folder}/${fileName}`

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Public URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    return {
      url: publicUrl,
      path: filePath,
      name: file.name,
      type: file.type,
      size: file.size
    }
  } catch (error) {
    console.error('파일 업로드 실패:', error)
    throw new Error(`파일 업로드 실패: ${error.message}`)
  }
}

/**
 * 여러 파일을 Storage에 업로드
 * @param {File[]} files - 업로드할 파일 배열
 * @param {string} folder - 저장할 폴더 경로
 * @returns {Promise<Array>} 업로드된 파일 정보 배열
 */
export const uploadMultipleFiles = async (files, folder = 'posts') => {
  try {
    const uploadPromises = files.map(file => uploadFileToStorage(file, folder))
    const results = await Promise.all(uploadPromises)
    return results
  } catch (error) {
    console.error('다중 파일 업로드 실패:', error)
    throw error
  }
}

/**
 * Storage에서 파일 삭제
 * @param {string} filePath - 삭제할 파일 경로
 * @returns {Promise<void>}
 */
export const deleteFileFromStorage = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('media')
      .remove([filePath])

    if (error) throw error
  } catch (error) {
    console.error('파일 삭제 실패:', error)
    throw new Error(`파일 삭제 실패: ${error.message}`)
  }
}

/**
 * 여러 파일을 Storage에서 삭제
 * @param {string[]} filePaths - 삭제할 파일 경로 배열
 * @returns {Promise<void>}
 */
export const deleteMultipleFiles = async (filePaths) => {
  try {
    const { error } = await supabase.storage
      .from('media')
      .remove(filePaths)

    if (error) throw error
  } catch (error) {
    console.error('다중 파일 삭제 실패:', error)
    throw error
  }
}

/**
 * Storage의 전체 사용량 조회 (바이트)
 * 재귀적으로 모든 폴더와 파일을 조회하여 정확한 사용량 계산
 * @returns {Promise<number>} 사용 중인 바이트 수
 */
export const getStorageUsage = async () => {
  try {
    console.log('🔍 [Storage] 사용량 조회 시작...')
    let totalSize = 0
    let fileCount = 0

    // 재귀적으로 폴더 내 모든 파일 조회
    const calculateFolderSize = async (path = '') => {
      let offset = 0
      const limit = 1000
      let hasMore = true

      console.log(`📂 [Storage] 폴더 조회: "${path || '(루트)'}"`)

      while (hasMore) {
        const { data: items, error } = await supabase.storage
          .from('media')
          .list(path, {
            limit: limit,
            offset: offset,
            sortBy: { column: 'created_at', order: 'desc' }
          })

        if (error) {
          console.error(`❌ [Storage] 폴더 "${path}" 조회 실패:`, error)
          throw error
        }

        if (!items || items.length === 0) {
          console.log(`   ℹ️ 항목 없음`)
          hasMore = false
          break
        }

        console.log(`   ✅ ${items.length}개 항목 발견 (offset: ${offset})`)

        // 각 항목 처리
        for (const item of items) {
          if (item.id) {
            // 파일인 경우 크기 합산
            const size = item.metadata?.size || 0
            totalSize += size
            fileCount++
            console.log(`      📄 ${item.name} - ${(size / 1024 / 1024).toFixed(2)} MB`)
          } else if (item.name) {
            // 폴더인 경우 재귀 호출
            console.log(`      📁 ${item.name} (폴더)`)
            const subPath = path ? `${path}/${item.name}` : item.name
            await calculateFolderSize(subPath)
          }
        }

        // 다음 페이지가 있는지 확인
        if (items.length < limit) {
          hasMore = false
        } else {
          offset += limit
        }
      }
    }

    // 루트부터 시작
    await calculateFolderSize('')

    console.log(`✅ [Storage] 조회 완료: ${fileCount}개 파일, ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
    return totalSize
  } catch (error) {
    console.error('❌ [Storage] 사용량 조회 실패:', error)
    return 0
  }
}

/**
 * 파일 URL에서 path 추출
 * @param {string} url - Supabase Storage public URL
 * @returns {string} 파일 경로
 */
export const extractPathFromUrl = (url) => {
  try {
    // URL 형식: https://[project].supabase.co/storage/v1/object/public/media/posts/xxx.jpg
    const match = url.match(/\/media\/(.+)$/)
    return match ? match[1] : null
  } catch (error) {
    console.error('URL에서 경로 추출 실패:', error)
    return null
  }
}
