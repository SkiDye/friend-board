import PostContent from "./PostContent"
import ImageViewer from "./ImageViewer"

const PostDetailModal = ({ isOpen, post, onClose, onEdit, onDelete }) => {
  if (!isOpen || !post) return null

  const handleDelete = () => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      onDelete(post.id)
      onClose()
    }
  }

  const handleEdit = () => {
    onEdit(post)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* 닫기 버튼만 있는 최소 헤더 */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-notion-gray-100 rounded-full shadow-md transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 - 전체 스크롤 */}
        <div className="flex-1 overflow-y-auto">
          {/* 제목 및 정보 */}
          <div className="p-4 sm:p-6 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-notion-text mb-2">
              {post.title}
            </h2>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-notion-gray-500">
              <span>{post.date}</span>
            </div>
          </div>

          {/* 이미지 뷰어 - 전체 너비, 세로 스크롤 */}
          {post.images && post.images.length > 0 && (
            <div className="w-full">
              <ImageViewer images={post.images} />
            </div>
          )}

          {/* 본문 (이미지 아래 표시) */}
          {post.content && (
            <div className="prose max-w-none px-4 sm:px-6 py-4">
              <PostContent content={post.content} />
            </div>
          )}

          {/* 수정/삭제 버튼 - 맨 아래 */}
          <div className="flex gap-3 p-4 sm:p-6 border-t border-notion-gray-200">
            <button
              onClick={handleEdit}
              className="btn-secondary flex-1 sm:flex-none"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all active:scale-95 touch-manipulation flex-1 sm:flex-none"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailModal
