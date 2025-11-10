import { extractYoutubeId, getYoutubeEmbedUrl } from "../../utils/youtube"

const YoutubePlayer = ({ url, title = "YouTube video" }) => {
  const videoId = extractYoutubeId(url)
  
  if (!videoId) return null
  
  const embedUrl = getYoutubeEmbedUrl(videoId)
  
  return (
    <div className="my-3 rounded-lg overflow-hidden bg-black">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default YoutubePlayer
