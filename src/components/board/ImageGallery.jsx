const ImageGallery = ({ images }) => {
  if (!images || images.length === 0) return null

  return (
    <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {images.map((image) => (
        <div key={image.id} className="relative group overflow-hidden rounded-lg border border-notion-gray-200">
          <img
            src={image.data}
            alt={image.name}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => window.open(image.data, "_blank")}
          />
        </div>
      ))}
    </div>
  )
}

export default ImageGallery
