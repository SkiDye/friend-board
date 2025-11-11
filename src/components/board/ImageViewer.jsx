import LazyImage from '../common/LazyImage'

const ImageViewer = ({ images }) => {
  if (!images || images.length === 0) return null

  return (
    <div className="w-full space-y-2">
      {images.map((image, index) => (
        <div key={image.id || index} className="w-full bg-black">
<<<<<<< HEAD
          {image.type && image.type.startsWith('video/') ? (
            <video
              src={image.url || image.data}
              className="w-full h-auto object-contain"
              controls
              playsInline
              loop
              volume="0.5"
              onLoadedMetadata={(e) => { e.target.volume = 0.5 }}
            />
          ) : (
            <img
              src={image.url || image.data}
              alt={image.name || 'Image'}
              className="w-full h-auto object-contain"
            />
          )}
=======
          <LazyImage
            src={image.url || image.data}
            alt={image.name || 'Image'}
            className="w-full h-auto object-contain"
            skeletonClassName="min-h-[300px]"
            type={image.type && image.type.startsWith('video/') ? 'video' : 'image'}
          />
>>>>>>> 7907bd6 (Migrate to Supabase Storage and improve loading performance)
        </div>
      ))}

      {images.length > 1 && (
        <div className="text-center py-2">
          <span className="text-xs text-notion-gray-500">
            총 {images.length}개
          </span>
        </div>
      )}
    </div>
  )
}

export default ImageViewer
