import LazyImage from '../common/LazyImage'

const ImageViewer = ({ images }) => {
  if (!images || images.length === 0) return null

  return (
    <div className="w-full space-y-2">
      {images.map((image, index) => (
        <div key={image.id || index} className="w-full bg-black">
          <LazyImage
            src={image.url || image.data}
            alt={image.name || 'Image'}
            className="w-full h-auto object-contain"
            skeletonClassName="min-h-[300px]"
            type={image.type && image.type.startsWith('video/') ? 'video' : 'image'}
            controls={true}
          />
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
