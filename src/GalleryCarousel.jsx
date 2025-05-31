import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Dynamiczny import obrazów
const importImages = () => {
  // Tablica na obrazy
  const images = [];
  
  try {
    // Próbujemy dynamicznie importować obrazy
    const imageContext = import.meta.glob('./assets/images/portfolio/*.jpg', { eager: true });
    
    // Jeśli znaleziono obrazy, dodaj je do tablicy
    if (Object.keys(imageContext).length > 0) {
      Object.values(imageContext).forEach(module => {
        if (module.default) {
          images.push(module.default);
        }
      });
      console.log(`Znaleziono ${images.length} obrazów w katalogu portfolio`);
    }
  } catch (error) {
    console.error("Błąd podczas importowania obrazów:", error);
  }
  
  // Jeśli nie znaleziono żadnych obrazów, użyj logo jako obrazy zastępcze
  if (images.length === 0) {
    const logoPath = "/images/Pani-Stolarka-Logo.svg";
    images.push(logoPath, logoPath, logoPath, logoPath, logoPath, logoPath);
    console.log("Używam obrazów zastępczych (logo)");
  }
  
  return images;
};

// Pobierz obrazy na początku
const images = importImages();

export default function GalleryCarousel() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [modalAnimating, setModalAnimating] = useState(false);

  const openModal = (src) => {
    setModalImg(src);
    setModalOpen(true);
    setModalAnimating(true);
    document.body.style.overflow = "hidden";
    
    // Po zakończeniu animacji wejścia
    setTimeout(() => {
      setModalAnimating(false);
    }, 300);
  };

  const closeModal = () => {
    setModalAnimating(true);
    
    // Opóźnij faktyczne zamknięcie modalu, aby animacja mogła się wykonać
    setTimeout(() => {
      setModalOpen(false);
      setModalImg("");
      setModalAnimating(false);
      document.body.style.overflow = "";
    }, 300);
  };

  const nextSlide = () => {
    if (animating) return;
    goToSlide((currentSlide - 1 + images.length) % images.length);
  };

  const prevSlide = () => {
    if (animating) return;
    goToSlide((currentSlide + 1) % images.length);

  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Oblicz indeksy dla wszystkich 5 obrazów
  const getImageIndex = (offset) => {
    return (currentSlide + offset + images.length) % images.length;
  };

  // Funkcja do bezpośredniego przejścia do określonego slajdu
  const goToSlide = (index) => {
    if (animating || index === currentSlide) return;

    const newDirection = index > currentSlide ?
      // Sprawdź czy klikając na indeks wyższy od obecnego, warto przejść "dookoła" w lewo
      ((index - currentSlide) > (images.length / 2) ? 'right' : 'left') :
      // Sprawdź czy klikając na indeks niższy od obecnego, warto przejść "dookoła" w prawo
      ((currentSlide - index) > (images.length / 2) ? 'left' : 'right');

    setDirection(newDirection);
    setAnimating(true);
    setCurrentSlide(index);
  };

  // Obsługa klawisza ESC do zamykania modalu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  return (
    <>
      <div className="custom-gallery">
        <button className="gallery-arrow gallery-arrow-left" onClick={prevSlide} disabled={animating}>
          <span className="arrow-icon">&#10094;</span>
        </button>
        
        <div className={`custom-gallery-container ${animating ? `animating-${direction}` : ''}`}>
          <div className="custom-gallery-far-left">
            <img 
              src={images[getImageIndex(-2)]} 
              alt="Zdjęcie daleko z lewej" 
              className={`side-image far-left-image ${animating ? direction === 'left' ? 'slide-left-farLeft' : 'slide-out-farLeft' : ''}`}
              onClick={() => !animating && goToSlide(getImageIndex(-2))}
            />
          </div>

          <div className="custom-gallery-left">
            <img 
              src={images[getImageIndex(-1)]} 
              alt="Poprzednie zdjęcie"
              className={`side-image left-image ${animating ? direction === 'left' ? 'slide-center-left' : 'slide-farLeft-left' : ''}`}
              onClick={() => !animating && goToSlide(getImageIndex(-1))}
            />
          </div>
          
          <div className="custom-gallery-main">
            <img 
              src={images[currentSlide]} 
              alt={`Zdjęcie ${currentSlide + 1}`} 
              className={`main-image ${animating ? direction === 'left' ? 'slide-left-center' : 'slide-right-center' : ''}`}
              onClick={() => openModal(images[currentSlide])}
            />
          </div>
          
          <div className="custom-gallery-right">
            <img 
              src={images[getImageIndex(1)]} 
              alt="Następne zdjęcie" 
              className={`side-image right-image ${animating ? direction === 'right' ? 'slide-center-right' : 'slide-farRight-right' : ''}`}
              onClick={() => !animating && goToSlide(getImageIndex(1))}
            />
          </div>

          <div className="custom-gallery-far-right">
            <img 
              src={images[getImageIndex(2)]} 
              alt="Zdjęcie daleko z prawej" 
              className={`side-image far-right-image ${animating ? direction === 'right' ? 'slide-right-farRight' : 'slide-out-farRight' : ''}`}
              onClick={() => !animating && goToSlide(getImageIndex(2))}
            />
          </div>
        </div>
        
        <button className="gallery-arrow gallery-arrow-right" onClick={nextSlide} disabled={animating}>
          <span className="arrow-icon">&#10095;</span>
        </button>
      </div>

      {modalOpen && (
        <div 
          className={`gallery-modal ${modalAnimating ? 'modal-animating' : 'modal-visible'}`} 
          tabIndex={-1} 
          aria-modal="true"
        >
          <div className="gallery-modal-backdrop" onClick={closeModal}></div>
          <div className="gallery-modal-content">
            <button className="gallery-modal-close" aria-label="Zamknij" onClick={closeModal}>
              <span>&times;</span>
            </button>
            <div className="gallery-modal-image-container">
              <img src={modalImg} alt="Powiększone zdjęcie" className="modal-image" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

