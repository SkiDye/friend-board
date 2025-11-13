import { useState, useEffect } from 'react'

const BrowserNotification = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // 이미 닫았는지 확인
    const dismissed = localStorage.getItem('browserNotificationDismissed')
    if (dismissed) return

    // 모바일 여부 확인
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (!isMobile) return

    // iOS는 Safari 지원하므로 알림 불필요
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) return

    // PWA 설치 지원 여부 확인
    let installSupported = false

    const handler = (e) => {
      installSupported = true
    }

    window.addEventListener('beforeinstallprompt', handler)

    // 2초 후 지원 여부 체크
    const timer = setTimeout(() => {
      // beforeinstallprompt 이벤트가 발생하지 않았다면 지원하지 않는 브라우저
      if (!installSupported) {
        setIsVisible(true)
        // 애니메이션을 위한 약간의 지연
        setTimeout(() => setIsAnimating(true), 10)
      }
    }, 2000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem('browserNotificationDismissed', 'true')
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isAnimating ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex-1 text-sm">
            <p className="font-semibold mb-1">더 나은 경험을 위해</p>
            <p className="text-blue-100">
              Chrome, Edge, Samsung Internet 등으로 접속하시면 앱을 설치할 수 있습니다!
            </p>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-blue-700 rounded transition-colors"
            aria-label="닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BrowserNotification
