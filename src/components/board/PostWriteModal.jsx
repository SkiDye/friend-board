import { useState, useEffect } from "react"

const PostWriteModal = ({ isOpen, onClose, onSubmit, editPost }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  // 수정 모드일 때 기존 값 채우기
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title)
      setContent(editPost.content)
      setImages(editPost.images || [])
    } else {
      setTitle("")
      setContent("")
      setImages([])
    }
  }, [editPost, isOpen])

  // 이미지 파일 처리 (공통)
  const processImageFiles = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}은(는) 이미지 파일이 아닙니다.`)
        return
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        alert(`${file.name}은(는) 5MB를 초과합니다.`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          data: reader.result,
          name: file.name
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    processImageFiles(e.target.files)
  }

  // 드래그 앤 드롭 핸들러
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processImageFiles(files)
    }
  }

  // 이미지 삭제
  const handleRemoveImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId))
  }

  // 이미지 순서 변경
  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    setImages(newImages)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("제목을 입력해주세요")
      return
    }

    if (!content.trim() && images.length === 0) {
      alert("내용 또는 이미지를 추가해주세요")
      return
    }

    onSubmit({
      ...(editPost && { id: editPost.id }),
      title: title.trim(),
      content: content.trim(),
      images: images
    })

    // 폼 초기화
    setTitle("")
    setContent("")
    setImages([])
    onClose()
  }

  if (!isOpen) return null

  const isEditMode = !!editPost

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-notion-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-notion-text">
            {isEditMode ? "글 수정" : "새 글 작성"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-notion-gray-100 rounded transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-notion-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="input"
              required
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-notion-gray-700 mb-2">
              내용 (선택사항)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요. 유튜브 링크를 붙여넣으면 자동으로 플레이어가 표시됩니다."
              rows={8}
              className="input resize-none"
            />
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-notion-gray-700 mb-2">
              이미지 (선택사항)
            </label>

            {/* 드래그 앤 드롭 영역 */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-notion-gray-300 hover:border-notion-gray-400'
              }`}
            >
              <div className="space-y-2">
                <div className="text-4xl">📷</div>
                <p className="text-sm text-notion-gray-600">
                  이미지를 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-notion-gray-500">
                  최대 5MB, 여러 장 가능
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="btn-secondary mt-3 cursor-pointer inline-block"
              >
                파일 선택
              </label>
            </div>

            {/* 이미지 미리보기 */}
            {images.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-notion-gray-500">
                  {images.length}장의 이미지 (화살표로 순서 조정)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.data}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded border border-notion-gray-200"
                      />

                      {/* 삭제 버튼 */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="삭제"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* 순서 조정 버튼 */}
                      <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, index - 1)}
                            className="bg-notion-text text-white rounded p-1"
                            title="왼쪽으로"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        )}
                        {index < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, index + 1)}
                            className="bg-notion-text text-white rounded p-1"
                            title="오른쪽으로"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* 순서 번호 */}
                      <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 도움말 */}
          <div className="text-xs text-notion-gray-500 bg-notion-gray-50 p-3 rounded">
            💡 <strong>팁:</strong> 유튜브 링크를 본문에 붙여넣으면 자동으로 영상 플레이어가 표시됩니다.
            이미지와 설명을 함께 올려보세요!
          </div>
        </form>

        {/* 푸터 */}
        <div className="flex gap-3 p-4 sm:p-6 border-t border-notion-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1 sm:flex-none"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary flex-1 sm:flex-none"
          >
            {isEditMode ? "수정하기" : "작성하기"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostWriteModal
