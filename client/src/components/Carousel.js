import React from "react";
import { useSelector } from "react-redux";

const Carousel = ({ images, id }) => {
  const isActive = (index) => {
    if (index === 0) return "active";
  };
  const { theme } = useSelector((state) => state);
  console.log({ theme });
  return (
    <div id={`image${id}`} className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators" style={{ zIndex: 1 }}>
        {images.map((img, index) => (
          <button
            type="button"
            key={index}
            data-bs-target={`#image${id}`}
            data-bs-slide-to={index}
            className={isActive(index)}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div key={index} className={`carousel-item ${isActive(index)}`}>
            {image && image.url ? (
              image.url.match(/video/i) ? (
                <video
                  controls
                  src={image.url}
                  className="d-block w-100 ${theme ? 'dark-theme' : ''}"
                  alt="video"
                  style={{ filter: `${theme ? "invert(1)" : "invert(0)"} ` }}
                />
              ) : (
                <img
                  src={image.url}
                  className="d-block w-100 ${theme ? 'dark-theme' : ''}"
                  alt="carousel"
                  style={{ filter: `${theme ? "invert(1)" : "invert(0)"} ` }}
                />
              )
            ) : (
              <p>No image available</p>
            )}
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#image${id}`}
        data-bs-slide="prev"
        style={{ height: "85%" }}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#image${id}`}
        data-bs-slide="next"
        style={{ height: "85%" }}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
