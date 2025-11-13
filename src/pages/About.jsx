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

  // PWA 설치 가능 여부 확인
  useEffect(() => {
    // App.jsx에서 캡처한 프롬프트 확인
    const checkInstallability = () => {
      if (window.deferredPrompt) {
        setIsInstallable(true)
      }
    }

    // 초기 확인
    checkInstallability()

    // 주기적으로 확인 (이벤트가 늦게 발생할 수 있음)
    const interval = setInterval(checkInstallability, 500)

    setTimeout(() => {
      clearInterval(interval)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // PWA 설치 버튼 클릭 핸들러
  const handleInstallClick = async () => {
    const deferredPrompt = window.deferredPrompt

    if (!deferredPrompt) {
      const ua = navigator.userAgent

      // iOS Safari인 경우 안내 메시지
      if (/iPad|iPhone|iPod/.test(ua)) {
        alert('Safari에서 하단의 공유 버튼(⬆️)을 탭한 후 "홈 화면에 추가"를 선택하세요.')
        return
      }

      // 인앱 브라우저 감지
      const inAppBrowserPatterns = [
        { pattern: /KAKAOTALK/i, name: '카카오톡' },
        { pattern: /Telegram/i, name: '텔레그램' },
        { pattern: /FBAN|FBAV/i, name: '페이스북' },
        { pattern: /Instagram/i, name: '인스타그램' },
        { pattern: /Line/i, name: '라인' }
      ]

      for (const browser of inAppBrowserPatterns) {
        if (browser.pattern.test(ua)) {
          alert(`${browser.name} 인앱 브라우저에서는 앱 설치가 지원되지 않습니다.\n\n우측 상단 ⋮ 메뉴에서 "외부 브라우저로 열기" 또는 "Chrome으로 열기"를 선택해주세요.\n\n그런 다음 Chrome 앱 자체에서 이 사이트를 직접 열어야 합니다!`)
          return
        }
      }

      // 일반 브라우저
      alert('앱 설치가 지원되지 않습니다.\n\n가능한 원인:\n• 이미 앱이 설치되어 있음\n• Chrome, Edge, Samsung Internet 등 지원 브라우저가 아님\n• 인앱 브라우저나 Custom Tabs에서 열림\n\n해결 방법:\nChrome 앱을 직접 열고 주소창에 URL을 입력하거나 북마크로 접속해주세요!')
      return
    }

    // 설치 프롬프트 표시
    deferredPrompt.prompt()

    // 사용자의 응답 대기
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('✅ PWA 설치 완료')
    } else {
      console.log('❌ PWA 설치 취소')
    }

    // 프롬프트는 한 번만 사용 가능
    window.deferredPrompt = null
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
