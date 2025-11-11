import { useState } from "react"
import PostContent from "./PostContent"
import ImageViewer from "./ImageViewer"
import { useAddComment, useDeleteComment } from "../../hooks/usePosts"

const PostDetailModal = ({ isOpen, post, onClose, onEdit, onDelete }) => {
  const [commentText, setCommentText] = useState("")
  const addCommentMutation = useAddComment()
  const deleteCommentMutation = useDeleteComment()

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

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    addCommentMutation.mutate(
      { postId: post.id, commentText: commentText.trim() },
      {
        onSuccess: () => {
          setCommentText("")
        }
      }
    )
  }

  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate({ postId: post.id, commentId })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* 닫기 버튼 - 오른쪽 아래 */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-3 bg-white hover:bg-notion-gray-100 rounded-full shadow-lg transition-colors"
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

          {/* 댓글 섹션 */}
          <div className="px-4 sm:px-6 py-4 border-t border-notion-gray-200">
            <h3 className="text-sm font-semibold text-notion-text mb-3">
              댓글 {post.comments?.length || 0}
            </h3>

            {/* 댓글 입력 */}
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 px-3 py-2 text-sm border border-notion-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-notion-gray-300"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                  className="px-4 py-2 text-sm bg-notion-text text-white rounded-md hover:bg-notion-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  등록
                </button>
              </div>
            </form>

            {/* 댓글 리스트 */}
            <div className="space-y-2">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-2 p-3 bg-notion-gray-50 rounded-md group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-notion-text break-words">
                        {comment.text}
                      </p>
                      <p className="text-xs text-notion-gray-500 mt-1">
                        {new Date(comment.created_at).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-notion-gray-500 text-center py-4">
                  첫 댓글을 작성해보세요
                </p>
              )}
            </div>
          </div>

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
