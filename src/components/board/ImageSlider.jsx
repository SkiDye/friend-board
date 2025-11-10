import { useState } from 'react'

const ImageSlider = ({ images, fullWidth = false, large = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  const goToPrevious = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // 높이 설정: large이면 높게, 아니면 기본값
  const heightClass = large ? 'h-96 sm:h-[500px]' : 'h-48'
  // 둥근 모서리: fullWidth이면 없애기
  const roundedClass = fullWidth ? '' : 'rounded'

  return (
    <div className={`relative w-full ${heightClass} bg-notion-gray-100 ${roundedClass} overflow-hidden group`}>
      {/* 이미지 */}
      <img
        src={images[currentIndex].data}
        alt={images[currentIndex].name}
        className="w-full h-full object-contain bg-black"
      />

      {/* 이미지가 2개 이상일 때만 컨트롤 표시 */}
      {images.length > 1 && (
        <>
          {/* 왼쪽 화살표 */}
          <button
            onClick={goToPrevious}
            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white ${large ? 'p-3' : 'p-2'} rounded-full ${large ? 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity z-10`}
          >
            <svg className={`${large ? 'w-6 h-6' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 오른쪽 화살표 */}
          <button
            onClick={goToNext}
            className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white ${large ? 'p-3' : 'p-2'} rounded-full ${large ? 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity z-10`}
          >
            <svg className={`${large ? 'w-6 h-6' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 이미지 인디케이터 */}
          <div className={`absolute ${large ? 'bottom-4' : 'bottom-2'} left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white ${large ? 'text-sm px-3 py-1.5' : 'text-xs px-2 py-1'} rounded`}>
            {currentIndex + 1} / {images.length}
          </div>

          {/* 점 인디케이터 */}
          <div className={`absolute ${large ? 'bottom-4' : 'bottom-2'} right-2 sm:right-4 flex gap-1.5`}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={`${large ? 'w-2 h-2' : 'w-1.5 h-1.5'} rounded-full transition-all ${
                  index === currentIndex
                    ? `bg-white ${large ? 'w-4' : 'w-3'}`
                    : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageSlider
