import { Link, useLocation } from "react-router-dom"

const Sidebar = ({ isMobileOpen, onClose }) => {
  const location = useLocation()

  const menuItems = [
    { path: "/", label: "게시판", icon: "📝" },
    { path: "/dev-history", label: "개발 히스토리", icon: "📋" },
    { path: "/about", label: "소개", icon: "ℹ️" },
  ]

  const handleLinkClick = () => {
    // 모바일에서 링크 클릭 시 사이드바 닫기
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* 모바일 오버레이 */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 h-screen bg-notion-gray-50 border-r border-notion-gray-200
          flex flex-col transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-notion-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-notion-text">우리들의 쉼터</h1>
          {/* 모바일 닫기 버튼 */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-notion-gray-200 rounded transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                active:scale-95 touch-manipulation
                ${location.pathname === item.path
                  ? "bg-notion-gray-200 text-notion-text"
                  : "text-notion-gray-600 hover:bg-notion-gray-100 active:bg-notion-gray-200"}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-notion-gray-200">
          <div className="text-xs text-notion-gray-500">
            친구들과 함께하는 공간
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
