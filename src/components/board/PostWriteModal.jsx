import { useState, useEffect } from "react"
<<<<<<< HEAD
import { uploadMultipleFiles } from "../../utils/storageUpload"
=======
import { uploadMultipleFiles } from "../../utils/storage-upload"
>>>>>>> 7907bd6 (Migrate to Supabase Storage and improve loading performance)

const PostWriteModal = ({ isOpen, onClose, onSubmit, editPost }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
<<<<<<< HEAD
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, fileName: '' })
=======
>>>>>>> 7907bd6 (Migrate to Supabase Storage and improve loading performance)

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

  // 미디어 파일 처리 (Storage 업로드)
  const processImageFiles = async (files) => {
    const fileArray = Array.from(files)

    // 파일 형식 검증
    for (const file of fileArray) {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (!isImage && !isVideo) {
        alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다.`)
        return
      }

      // 동영상은 100MB, 이미지는 50MB 제한
      const maxSize = isVideo ? 100 * 1024 * 1024 : 50 * 1024 * 1024
      if (file.size > maxSize) {
        const limitText = isVideo ? '100MB' : '50MB'
        alert(`${file.name}은(는) ${limitText}를 초과합니다.`)
        return
      }
    }

<<<<<<< HEAD
    // Storage에 업로드
    setIsUploading(true)

    try {
      const results = await uploadMultipleFiles(fileArray, (current, total, fileName) => {
        setUploadProgress({ current, total, fileName })
      })

      // 업로드 실패한 파일 확인
      const failedFiles = results.filter(r => r.error)
      if (failedFiles.length > 0) {
        const failedNames = failedFiles.map(f => f.name).join(', ')
        alert(`다음 파일 업로드에 실패했습니다: ${failedNames}`)
      }

      // 성공한 파일만 추가
      const successFiles = results.filter(r => !r.error)
      if (successFiles.length > 0) {
        setImages(prev => [...prev, ...successFiles])
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
      setUploadProgress({ current: 0, total: 0, fileName: '' })
    }
=======
      // 미리보기를 위한 임시 URL 생성
      const previewUrl = URL.createObjectURL(file)

      setImages(prev => [...prev, {
        id: Date.now() + Math.random(),
        file: file, // 실제 File 객체 저장 (업로드용)
        previewUrl: previewUrl, // 미리보기 URL
        name: file.name,
        type: file.type,
        // 수정 모드에서 기존 이미지인 경우 url과 path가 있을 수 있음
        url: null,
        path: null
      }])
    })
>>>>>>> 7907bd6 (Migrate to Supabase Storage and improve loading performance)
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("제목을 입력해주세요")
      return
    }

    if (!content.trim() && images.length === 0) {
      alert("내용 또는 이미지를 추가해주세요")
      return
    }

    try {
      setIsUploading(true)

      // 새로운 파일들을 Storage에 업로드
      const filesToUpload = images.filter(img => img.file && !img.url)
      const existingImages = images.filter(img => img.url) // 수정 모드에서 기존 이미지

      let uploadedImages = []
      if (filesToUpload.length > 0) {
        const files = filesToUpload.map(img => img.file)
        uploadedImages = await uploadMultipleFiles(files, 'posts')
      }

      // 최종 이미지 배열: 기존 이미지 + 새 업로드 이미지
      const finalImages = [
        ...existingImages.map(img => ({
          id: img.id,
          url: img.url,
          path: img.path,
          name: img.name,
          type: img.type
        })),
        ...uploadedImages.map((img, index) => ({
          id: filesToUpload[index].id,
          url: img.url,
          path: img.path,
          name: img.name,
          type: img.type
        }))
      ]

      // 미리보기 URL 메모리 해제
      images.forEach(img => {
        if (img.previewUrl) {
          URL.revokeObjectURL(img.previewUrl)
        }
      })

      onSubmit({
        ...(editPost && { id: editPost.id }),
        title: title.trim(),
        content: content.trim(),
        images: finalImages
      })

      // 폼 초기화
      setTitle("")
      setContent("")
      setImages([])
      onClose()
    } catch (error) {
      console.error('업로드 실패:', error)
      alert('파일 업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsUploading(false)
    }
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

          {/* 미디어 업로드 */}
          <div>
            <label className="block text-sm font-medium text-notion-gray-700 mb-2">
              이미지/동영상 (선택사항)
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
                <div className="text-4xl">🎬</div>
                <p className="text-sm text-notion-gray-600">
                  이미지/동영상을 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-notion-gray-500">
                  이미지: 최대 50MB | 동영상: 최대 100MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
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

            {/* 미디어 미리보기 */}
            {images.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-notion-gray-500">
                  {images.length}개의 파일 (화살표로 순서 조정)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      {image.type && image.type.startsWith('video/') ? (
                        <video
<<<<<<< HEAD
                          src={image.url || image.data}
=======
                          src={image.url || image.previewUrl}
>>>>>>> 7907bd6 (Migrate to Supabase Storage and improve loading performance)
                          className="w-full h-24 object-cover rounded border border-notion-gray-200"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => e.target.play()}
                          onMouseLeave={(e) => e.target.pause()}
                        />
                      ) : (
                        <img
<<<<<<< HEAD
                          src={image.url || image.data}
=======
                          src={image.url || image.previewUrl}
>>>>>>> 7907bd6 (Migrate to Supabase Storage and improve loading performance)
                          alt={image.name}
                          className="w-full h-24 object-cover rounded border border-notion-gray-200"
                          loading="lazy"
                        />
                      )}

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

          {/* 업로드 진행 상황 */}
          {isUploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    파일 업로드 중... ({uploadProgress.current}/{uploadProgress.total})
                  </p>
                  {uploadProgress.fileName && (
                    <p className="text-xs text-blue-700 mt-1">
                      {uploadProgress.fileName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

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
<<<<<<< HEAD
            disabled={isUploading}
            className="btn-primary flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
=======
            className="btn-primary flex-1 sm:flex-none"
            disabled={isUploading}
>>>>>>> 7907bd6 (Migrate to Supabase Storage and improve loading performance)
          >
            {isUploading ? "업로드 중..." : (isEditMode ? "수정하기" : "작성하기")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostWriteModal
