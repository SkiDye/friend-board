import { findYoutubeUrls } from "../../utils/youtube"
import YoutubePlayer from "../common/YoutubePlayer"

/**
 * 게시글 내용을 표시하며, 유튜브 링크를 자동으로 플레이어로 변환합니다
 */
const PostContent = ({ content }) => {
  if (!content) return null
  
  const youtubeUrls = findYoutubeUrls(content)
  
  // 유튜브 링크가 없으면 일반 텍스트만 표시
  if (youtubeUrls.length === 0) {
    return (
      <div className="whitespace-pre-wrap break-words">
        {content}
      </div>
    )
  }
  
  // 유튜브 링크가 있으면 텍스트와 플레이어를 함께 표시
  let remainingText = content
  const parts = []
  
  youtubeUrls.forEach((url, index) => {
    const urlIndex = remainingText.indexOf(url)
    if (urlIndex !== -1) {
      // URL 앞의 텍스트
      if (urlIndex > 0) {
        parts.push({
          type: "text",
          content: remainingText.substring(0, urlIndex),
          key: "text-" + index + "-before"
        })
      }
      
      // 유튜브 플레이어
      parts.push({
        type: "youtube",
        url: url,
        key: "youtube-" + index
      })
      
      remainingText = remainingText.substring(urlIndex + url.length)
    }
  })
  
  // 마지막 남은 텍스트
  if (remainingText) {
    parts.push({
      type: "text",
      content: remainingText,
      key: "text-end"
    })
  }
  
  return (
    <div className="space-y-2">
      {parts.map((part) => {
        if (part.type === "youtube") {
          return <YoutubePlayer key={part.key} url={part.url} />
        }
        return (
          <div key={part.key} className="whitespace-pre-wrap break-words">
            {part.content}
          </div>
        )
      })}
    </div>
  )
}

export default PostContent
