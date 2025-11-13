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

  // PWA 설치 관련 상태
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

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

  // PWA 설치 프롬프트 캡처
  useEffect(() => {
    const handler = (e) => {
      // 브라우저의 기본 설치 프롬프트 방지
      e.preventDefault()
      // 나중에 사용하기 위해 이벤트 저장
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // 이미 설치되어 있는지 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // PWA 설치 버튼 클릭 핸들러
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // iOS Safari인 경우 안내 메시지
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        alert('Safari에서 하단의 공유 버튼(⬆️)을 탭한 후 "홈 화면에 추가"를 선택하세요.')
      } else {
        alert('이 브라우저는 앱 설치를 지원하지 않습니다.')
      }
      return
    }

    // 설치 프롬프트 표시
    deferredPrompt.prompt()

    // 사용자의 응답 대기
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA 설치 완료')
    } else {
      console.log('PWA 설치 취소')
    }

    // 프롬프트는 한 번만 사용 가능
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

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

          {/* PWA 설치 섹션 */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-notion-text flex items-center gap-2">
              📱 앱으로 설치하기
            </h2>
            <p className="text-sm mb-3 text-notion-gray-700">
              프렌드보드를 스마트폰 홈 화면에 추가하면 앱처럼 빠르게 사용할 수 있습니다!
            </p>

            {window.matchMedia('(display-mode: standalone)').matches ? (
              <div className="bg-green-100 border border-green-300 rounded-md p-3 text-sm text-green-800">
                ✅ 이미 앱으로 설치되어 사용 중입니다!
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto btn-primary text-sm sm:text-base"
              >
                📲 앱 설치
              </button>
            )}
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
