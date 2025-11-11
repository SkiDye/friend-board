/**
 * 게시판 로딩 스켈레톤 - 레이아웃을 먼저 보여줌
 */
const BoardSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-notion-gray-100 relative">
          {/* 이미지 영역 스켈레톤 */}
          <div className="w-full h-full bg-notion-gray-200 animate-pulse flex items-center justify-center">
            <svg className="w-12 h-12 text-notion-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          {/* 제목 영역 스켈레톤 */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 p-3 sm:p-4">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BoardSkeleton
