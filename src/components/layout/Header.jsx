const Header = ({ onMenuClick }) => {
  return (
    <header className="h-14 bg-white border-b border-notion-gray-200 flex items-center px-4 sm:px-6">
      {/* 모바일 햄버거 메뉴 */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 mr-2 hover:bg-notion-gray-100 rounded transition-colors active:scale-95"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1">
        <h2 className="text-base sm:text-lg font-semibold text-notion-text">친구 게시판</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button className="btn-secondary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
          로그인
        </button>
      </div>
    </header>
  )
}

export default Header
