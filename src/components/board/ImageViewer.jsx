const ImageViewer = ({ images }) => {
  if (!images || images.length === 0) return null

  return (
    <div className="w-full space-y-2">
      {images.map((image, index) => (
        <div key={image.id || index} className="w-full bg-black">
          <img
            src={image.data}
            alt={image.name || 'Image'}
            className="w-full h-auto object-contain"
          />
        </div>
      ))}
      
      {images.length > 1 && (
        <div className="text-center py-2">
          <span className="text-xs text-notion-gray-500">
            총 {images.length}장의 이미지
          </span>
        </div>
      )}
    </div>
  )
}

export default ImageViewer
