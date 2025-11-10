const Home = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="card">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-notion-text">환영합니다! 🎉</h1>
        <p className="text-notion-gray-600 mb-6 text-sm sm:text-base">
          친구들과 함께 즐거운 시간을 보낼 수 있는 공간입니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="card bg-notion-gray-50 hover:bg-notion-gray-100 transition-colors active:scale-98 touch-manipulation cursor-pointer">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold mb-1 text-sm sm:text-base">게시판</h3>
            <p className="text-xs sm:text-sm text-notion-gray-600">자유롭게 글을 작성하고 공유하세요</p>
          </div>
          <div className="card bg-notion-gray-50 hover:bg-notion-gray-100 transition-colors active:scale-98 touch-manipulation cursor-pointer">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold mb-1 text-sm sm:text-base">댓글</h3>
            <p className="text-xs sm:text-sm text-notion-gray-600">친구들과 대화를 나눠보세요</p>
          </div>
          <div className="card bg-notion-gray-50 hover:bg-notion-gray-100 transition-colors active:scale-98 touch-manipulation cursor-pointer sm:col-span-2 md:col-span-1">
            <div className="text-2xl mb-2">📸</div>
            <h3 className="font-semibold mb-1 text-sm sm:text-base">이미지</h3>
            <p className="text-xs sm:text-sm text-notion-gray-600">사진과 함께 추억을 저장하세요</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
