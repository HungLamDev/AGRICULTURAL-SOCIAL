import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

const Carousel = ({ images, id }) => {
  const theme = useSelector((state) => state.theme);

  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleShowModal = (index) => {
    setActiveIndex(index);
    setShowModal(true);
  };

  const handleHideModal = () => setShowModal(false);

  const displayedImages = images.slice(0, 5);
  const remainingImagesCount = images.length - 5;

  const getColClass = (totalImages, index) => {
    if (totalImages === 5) {
      return index < 3 ? "col-4" : "col-6";
    } else if (totalImages === 4) {
      return "col-6";
    } else {
      return "col-6 col-md-4";
    }
  };

  return (
    <div>
      {/* Grid Display */}
      <div className="container">
        <div className="row">
          {displayedImages.map((image, index) => (
            <div
              key={index}
              className={`${getColClass(
                displayedImages.length,
                index
              )} position-relative`}
              style={{ padding: "0", overflow: "hidden" }}
            >
              <div
                className="img-container"
                onClick={() => handleShowModal(index)}
                style={{
                  cursor: "pointer",
                  height: displayedImages.length === 1 ? "500px" : "100%",
                  width: "100%",
                  overflow: "hidden",
                  paddingRight: "1px",
                  paddingBottom: "1px",
                }}
              >
                <img
                  src={image.url}
                  className="img-fluid"
                  alt={`grid-${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: theme ? "invert(1)" : "invert(0)",
                  }}
                />
              </div>

              {index === 4 && remainingImagesCount > 0 && (
                <div
                  className="remaining-images d-flex justify-content-center align-items-center"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    color: "white",
                    fontSize: "2rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleShowModal(5)}
                >
                  +{remainingImagesCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Carousel */}
      <Modal show={showModal} onHide={handleHideModal} size="lg" centered>
      <Modal.Body>
        <div
          id={`carouselExample${id}`}
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div
            className="carousel-inner"
            style={{
              filter: theme ? "invert(1)" : "invert(0)",
            }}
          >
            {images.map((img, index) => (
            <div
              key={index}
              className={`carousel-item ${index === activeIndex ? "active" : ""}`}
            >
              {img.url && img.url.match(/video/i) ? (
                <video
                  controls
                  src={img.url}
                  className="d-block w-100"
                  alt={img.url}
                  style={{
                    maxHeight: "1200px",
                    objectFit: "contain",
                    filter: theme ? "invert(1)" : "invert(0)",
                  }}
                />
              ) : (
                img.url && (
                  <img
                    src={img.url}
                    className="d-block w-100"
                    alt={img.url}
                    style={{
                      maxHeight: "1200px",
                      objectFit: "contain",
                      filter: theme ? "invert(1)" : "invert(0)",
                    }}
                  />
                )
              )}
            </div>
          ))}

          </div>

          {images.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carouselExample${id}`}
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carouselExample${id}`}
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      </Modal.Body>

      </Modal>
    </div>
  );
};

export default Carousel;
