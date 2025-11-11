import { useState, useEffect } from 'react'
import StorageInfo from '../components/common/StorageInfo'
import { usePostsForStorage } from '../hooks/usePosts'
import { getTotalPostsSize } from '../utils/storage'
import { getStorageUsage } from '../utils/storage-upload'

const About = () => {
  // DB 저장공간 계산용 전체 데이터 로드
  const { data: posts = [], isLoading } = usePostsForStorage()
  const dbUsedBytes = isLoading ? 0 : getTotalPostsSize(posts)

  // Supabase Storage 사용량 조회 (실제 파일 크기)
  const [storageUsedBytes, setStorageUsedBytes] = useState(0)
  const [isLoadingStorage, setIsLoadingStorage] = useState(true)

  useEffect(() => {
    const fetchStorageUsage = async () => {
      try {
        setIsLoadingStorage(true)
        const usage = await getStorageUsage()
        setStorageUsedBytes(usage)
      } catch (error) {
        console.error('Storage 사용량 조회 실패:', error)
        setStorageUsedBytes(0)
      } finally {
        setIsLoadingStorage(false)
      }
    }

    fetchStorageUsage()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 저장 공간 정보 */}
      {(isLoading || isLoadingStorage) ? (
        <div className="card">
          <p className="text-center text-notion-gray-500">저장 공간 사용량 계산 중...</p>
        </div>
      ) : (
        <StorageInfo dbUsedBytes={dbUsedBytes} storageUsedBytes={storageUsedBytes} />
      )}

      {/* 프로젝트 정보 */}
      <div className="card">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-notion-text">소개</h1>

        <div className="space-y-4 sm:space-y-6 text-notion-gray-700 text-sm sm:text-base">
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-notion-text">프로젝트 소개</h2>
            <p className="leading-relaxed">
              친구들끼리 자유롭게 소통할 수 있는 비공개 게시판입니다.
              깔끔한 디자인과 편리한 기능으로 편하게 소통할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-notion-text">주요 기능</h2>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2">
              <li>간편한 게시글 작성</li>
              <li>이미지 업로드 및 드래그앤드롭</li>
              <li>유튜브 영상 임베드</li>
              <li>모바일 최적화</li>
              <li>실시간 데이터 동기화</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-notion-text">기술 스택</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 bg-notion-gray-100 rounded-md text-xs sm:text-sm hover:bg-notion-gray-200 transition-colors touch-manipulation">
                React
              </span>
              <span className="px-2.5 sm:px-3 py-1 bg-notion-gray-100 rounded-md text-xs sm:text-sm hover:bg-notion-gray-200 transition-colors touch-manipulation">
                Vite
              </span>
              <span className="px-2.5 sm:px-3 py-1 bg-notion-gray-100 rounded-md text-xs sm:text-sm hover:bg-notion-gray-200 transition-colors touch-manipulation">
                Tailwind CSS
              </span>
              <span className="px-2.5 sm:px-3 py-1 bg-notion-gray-100 rounded-md text-xs sm:text-sm hover:bg-notion-gray-200 transition-colors touch-manipulation">
                Supabase
              </span>
              <span className="px-2.5 sm:px-3 py-1 bg-notion-gray-100 rounded-md text-xs sm:text-sm hover:bg-notion-gray-200 transition-colors touch-manipulation">
                React Query
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About
