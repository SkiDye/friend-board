import { useState, useEffect } from 'react'

/**
 * URL의 Open Graph 메타데이터를 가져와 미리보기 카드를 표시하는 컴포넌트
 * 낮은 직사각형 형태로 제목, 설명, 이미지를 표시
 */
const LinkPreview = ({ url }) => {
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true)
        setError(false)

        // Microlink API를 사용하여 Open Graph 데이터 가져오기
        // 무료 티어: API 키 없이 사용 가능, 50 requests/day per IP
        const response = await fetch(
          `https://api.microlink.io?url=${encodeURIComponent(url)}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch preview')
        }

        const data = await response.json()

        if (data.status === 'success' && data.data) {
          setPreview({
            title: data.data.title || url,
            description: data.data.description || '',
            image: data.data.image?.url || data.data.logo?.url || null,
            url: data.data.url || url
          })
        } else {
          throw new Error('Invalid response')
        }
      } catch (err) {
        console.error('Link preview fetch error:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [url])

  // 로딩 중이거나 에러 발생 시 일반 링크로 표시
  if (loading) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline break-all"
      >
        {url}
      </a>
    )
  }

  if (error || !preview) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline break-all"
      >
        {url}
      </a>
    )
  }

  // 미리보기 카드 표시 (낮은 직사각형)
  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block my-2 border border-notion-gray-300 rounded-lg overflow-hidden hover:border-notion-gray-400 hover:shadow-md transition-all no-underline bg-white"
    >
      <div className="flex items-center gap-3 p-3">
        {/* 왼쪽: 텍스트 정보 */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-notion-text line-clamp-1 mb-1">
            {preview.title}
          </h4>
          {preview.description && (
            <p className="text-xs text-notion-gray-600 line-clamp-2">
              {preview.description}
            </p>
          )}
          <p className="text-xs text-notion-gray-500 truncate mt-1">
            {new URL(preview.url).hostname}
          </p>
        </div>

        {/* 오른쪽: 썸네일 이미지 */}
        {preview.image && (
          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
            <img
              src={preview.image}
              alt={preview.title}
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                // 이미지 로드 실패 시 숨김
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}
      </div>
    </a>
  )
}

export default LinkPreview
