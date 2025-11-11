import { useState, useEffect } from 'react'
import PostContent from '../components/board/PostContent'
import PostWriteModal from '../components/board/PostWriteModal'
import PostDetailModal from '../components/board/PostDetailModal'
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from '../hooks/usePosts'

const Board = () => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [editPost, setEditPost] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // React Query로 게시글 데이터 관리
  const { data: posts = [], isLoading, error } = usePosts()
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const deletePost = useDeletePost()

  // 검색 필터링
  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase()
    const titleMatch = post.title.toLowerCase().includes(query)
    const contentMatch = post.content.toLowerCase().includes(query)

    return titleMatch || contentMatch
  })

  // 스크롤 위치 복원 (페이지 로드 시)
  useEffect(() => {
    if (!isLoading && filteredPosts.length > 0) {
      const savedScrollPos = localStorage.getItem('boardScrollPos')
      const savedScrollTime = localStorage.getItem('boardScrollTime')

      if (savedScrollPos && savedScrollTime) {
        const daysSince = (Date.now() - parseInt(savedScrollTime)) / (1000 * 60 * 60 * 24)

        // 7일 이내 데이터만 복원
        if (daysSince < 7) {
          setTimeout(() => {
            window.scrollTo(0, parseInt(savedScrollPos))
          }, 100) // 약간의 지연을 주어 렌더링 완료 후 스크롤
        } else {
          // 7일 지났으면 삭제
          localStorage.removeItem('boardScrollPos')
          localStorage.removeItem('boardScrollTime')
        }
      }
    }
  }, [isLoading, filteredPosts.length])

  // 스크롤 위치 저장 (스크롤 이벤트)
  useEffect(() => {
    let scrollTimeout

    const handleScroll = () => {
      // 디바운스: 스크롤이 멈춘 후 500ms 후에 저장
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        localStorage.setItem('boardScrollPos', window.scrollY.toString())
        localStorage.setItem('boardScrollTime', Date.now().toString())
      }, 500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 게시글 클릭 - 상세보기
  const handlePostClick = (post) => {
    setSelectedPostId(post.id)
    setIsDetailModalOpen(true)
  }

  // 새 게시글 추가 또는 수정
  const handleSubmitPost = async (postData) => {
    try {
      if (postData.id) {
        // 수정 모드
        await updatePost.mutateAsync(postData)
      } else {
        // 새 글 작성
        await createPost.mutateAsync(postData)
      }
    } catch (error) {
      console.error('게시글 저장 실패:', error)
      alert('게시글 저장에 실패했습니다.')
    }
  }

  // 게시글 삭제
  const handleDeletePost = async (postId) => {
    try {
      await deletePost.mutateAsync(postId)
    } catch (error) {
      console.error('게시글 삭제 실패:', error)
      alert('게시글 삭제에 실패했습니다.')
    }
  }

  // 게시글 수정 시작
  const handleEditPost = (post) => {
    setEditPost(post)
    setIsWriteModalOpen(true)
  }

  // 모달 닫기 핸들러
  const handleCloseWriteModal = () => {
    setIsWriteModalOpen(false)
    setEditPost(null)
  }

  // 로딩 중이거나 에러 상태 처리
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <div className="text-center py-12 text-notion-gray-500">
          <p>게시글을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <div className="text-center py-12 text-red-500">
          <p>게시글을 불러오는데 실패했습니다.</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-notion-text">게시판</h1>
        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="btn-primary w-full sm:w-auto"
        >
          + 새 글 작성
        </button>
      </div>

      {/* 검색창 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목 또는 내용으로 검색..."
            className="w-full px-4 py-3 pl-11 rounded-lg border border-notion-gray-300 focus:outline-none focus:border-notion-text transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-notion-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-notion-gray-500 hover:text-notion-text"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-notion-gray-500">
            {filteredPosts.length}개의 게시글 찾음
          </p>
        )}
      </div>

      {/* 게시글 그리드 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-notion-gray-500">
          {searchQuery ? (
            <>
              <p>검색 결과가 없습니다.</p>
              <p className="text-sm mt-2">다른 키워드로 검색해보세요.</p>
            </>
          ) : (
            <>
              <p>아직 게시글이 없습니다.</p>
              <p className="text-sm mt-2">첫 게시글을 작성해보세요!</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post)}
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-notion-gray-100 hover:shadow-lg transition-all duration-200 relative">
                {/* 이미지가 있는 경우 */}
                {post.thumbnail ? (
                  <>
                    {post.thumbnail.type && post.thumbnail.type.startsWith('video/') ? (
                      <video
                        src={post.thumbnail.data}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => e.target.pause()}
                      />
                    ) : (
                      <img
                        src={post.thumbnail.data}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* 제목 영역 - 완전 검정 배경 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black p-3 sm:p-4">
                      <h3 className="font-semibold text-white text-sm sm:text-base mb-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/80">
                        <span>{post.date}</span>
                        {post.imageCount > 1 && (
                          <>
                            <span>•</span>
                            <span>🎬 {post.imageCount}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* 이미지가 없는 경우 */
                  <>
                    {/* 내용 미리보기 영역 */}
                    <div className="w-full h-full bg-notion-gray-50 p-4 flex items-center justify-center overflow-hidden">
                      {post.content ? (
                        <div className="text-xs sm:text-sm text-notion-gray-600 line-clamp-6 text-center">
                          <PostContent content={post.content} />
                        </div>
                      ) : (
                        <div className="text-notion-gray-400 text-sm">
                          내용 없음
                        </div>
                      )}
                    </div>
                    {/* 제목 영역 - 완전 검정 배경 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black p-3 sm:p-4">
                      <h3 className="font-semibold text-white text-sm sm:text-base mb-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/80">
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 글 작성/수정 모달 */}
      <PostWriteModal
        isOpen={isWriteModalOpen}
        onClose={handleCloseWriteModal}
        onSubmit={handleSubmitPost}
        editPost={editPost}
      />

      {/* 글 상세보기 모달 */}
      <PostDetailModal
        isOpen={isDetailModalOpen}
        postId={selectedPostId}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
      />
    </div>
  )
}

export default Board
