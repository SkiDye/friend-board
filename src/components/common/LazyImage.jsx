import { useState } from 'react'

/**
 * 이미지 로딩 상태를 관리하며 점진적으로 표시하는 컴포넌트
 */
const LazyImage = ({ src, alt, className, skeletonClassName, type = 'image', controls = false }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  if (type === 'video') {
    return (
      <div className="relative w-full h-full">
        {!isLoaded && (
          <div className={`absolute inset-0 bg-notion-gray-200 animate-pulse ${skeletonClassName || ''}`}>
            <div className="flex items-center justify-center h-full text-notion-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        )}
        <video
          src={src}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoadedData={handleLoad}
          onError={handleError}
          onLoadedMetadata={(e) => { e.target.volume = 0.5 }}
          {...(controls ? {
            controls: true
          } : {
            onMouseEnter: (e) => e.target.play(),
            onMouseLeave: (e) => e.target.pause(),
            muted: true
          })}
          loop
          playsInline
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* 스켈레톤 로딩 */}
      {!isLoaded && (
        <div className={`absolute inset-0 bg-notion-gray-200 animate-pulse ${skeletonClassName || ''}`}>
          <div className="flex items-center justify-center h-full text-notion-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}

      {/* 에러 상태 */}
      {hasError && (
        <div className={`absolute inset-0 bg-notion-gray-100 flex items-center justify-center ${skeletonClassName || ''}`}>
          <div className="text-center text-notion-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs">이미지 로드 실패</p>
          </div>
        </div>
      )}

      {/* 실제 이미지 */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
}

export default LazyImage
