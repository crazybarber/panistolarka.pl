import React from "react";
import ReactDOM from "react-dom/client";
import GalleryCarousel from "./GalleryCarousel";
import TestimonialsCarousel from "./TestimonialsCarousel";

document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("gallery-container");
  
  if (galleryContainer) {
    ReactDOM.createRoot(galleryContainer).render(
      <React.StrictMode>
        <GalleryCarousel />
      </React.StrictMode>
    );
  } else {
    console.error("Nie znaleziono elementu gallery-container");
  }

  const testimonialsContainer = document.getElementById("testimonials-carousel-container");
  if (testimonialsContainer) {
    ReactDOM.createRoot(testimonialsContainer).render(
      <React.StrictMode>
        <TestimonialsCarousel />
      </React.StrictMode>
    );
  }
});
