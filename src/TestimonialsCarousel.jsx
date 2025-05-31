import React, { useState, useEffect } from "react";
import yaml from 'js-yaml';

// Importuj wszystkie pliki YAML z katalogu referrals i parsuj je
const importTestimonials = () => {
  const testimonials = [];
  const files = import.meta.glob('./assets/referrals/*.yaml', { as: 'raw', eager: true });

  Object.values(files).forEach((fileContent) => {
    try {
      // Parsowanie zawartości pliku YAML
      const parsedData = yaml.load(fileContent);
      if (parsedData) {
        testimonials.push(parsedData);
      }
    } catch (e) {
      console.error('Błąd podczas parsowania pliku YAML:', e);
    }
  });

  return testimonials;
};

const testimonials = importTestimonials();

function extractFields(testimonial) {
  // Pobieranie danych z sparsowanej struktury YAML po kluczach
  const text = testimonial?.referral || '';
  const author = testimonial?.who || '';

  return { text, author };
}

function getVisibleCount(width) {
  if (width < 600) return 1;      // Mobile
  if (width < 1024) return 2;     // Tablet
  return 3;                       // Desktop
}

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  // Wykrywanie rozdzielczości ekranu
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount(window.innerWidth));
    };

    // Ustawienie początkowej wartości
    handleResize();

    // Nasłuchiwanie zmiany rozmiaru okna
    window.addEventListener('resize', handleResize);

    // Sprzątanie
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);

  if (!testimonials.length) {
    // Placeholder jeśli nie ma opinii
    return <div className="testimonials-carousel">Brak opinii do wyświetlenia.</div>;
  }

  // Przygotowanie indeksów testimoniali do wyświetlenia
  const visibleTestimonials = [];
  for (let i = 0; i < visibleCount; i++) {
    const index = (current + i) % testimonials.length;
    visibleTestimonials.push(extractFields(testimonials[index]));
  }

  return (
    <div className="testimonials-carousel">
      <button className="testimonials-arrow left" onClick={prev} aria-label="Poprzednia opinia">
        &#10094;
      </button>
      <div className="testimonial-container">
        {visibleTestimonials.map((item, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-content">
              <p className="testimonial-text">{item.text}</p>
              <p className="testimonial-author">{item.author}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="testimonials-arrow right" onClick={next} aria-label="Następna opinia">
        &#10095;
      </button>
    </div>
  );
}
