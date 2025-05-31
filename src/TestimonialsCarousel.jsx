import React, { useState, useEffect, useRef } from "react";
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
  if (width < 480) return 1;      // Small Mobile
  if (width < 768) return 1;      // Mobile
  if (width < 1024) return 2;     // Tablet
  return 3;                       // Desktop
}

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const textRefs = useRef([]);
  const containerRefs = useRef([]);

  // Wykrywanie rozdzielczości ekranu
  useEffect(() => {
    const handleResize = () => {
      const newVisibleCount = getVisibleCount(window.innerWidth);
      setVisibleCount(newVisibleCount);
    };

    // Ustawienie początkowej wartości
    handleResize();

    // Nasłuchiwanie zmiany rozmiaru okna
    window.addEventListener('resize', handleResize);

    // Sprzątanie
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funkcja do automatycznego dostosowania rozmiaru czcionki i formatowania tekstu
  useEffect(() => {
    // Resetowanie referencji
    textRefs.current = textRefs.current.slice(0, visibleCount);
    containerRefs.current = containerRefs.current.slice(0, visibleCount);

    const adjustTextDisplay = () => {
      textRefs.current.forEach((textElement, index) => {
        if (!textElement || !containerRefs.current[index]) return;

        const container = containerRefs.current[index];
        const containerHeight = container.clientHeight;
        const containerWidth = container.clientWidth;

        // Resetowanie rozmiaru czcionki i stylów do wartości początkowej
        textElement.style.fontSize = '0.95em';
        textElement.style.wordBreak = 'normal';
        textElement.style.overflowWrap = 'break-word';
        textElement.style.hyphens = 'auto';
        textElement.style.textAlign = 'left';
        textElement.style.paddingLeft = '0';
        textElement.style.paddingRight = '0';

        // Sprawdzenie czy tekst przekracza wymiary kontenera
        if (container.scrollHeight > containerHeight || container.scrollWidth > containerWidth) {
          // Zwiększ padding na małych ekranach
          if (window.innerWidth < 480) {
            textElement.style.paddingLeft = '2px';
            textElement.style.paddingRight = '2px';
          }

          // Włącz dzielenie słów
          textElement.style.wordBreak = 'break-word';
          textElement.style.overflowWrap = 'break-word';
          textElement.style.hyphens = 'auto';

          // Stopniowe zmniejszanie rozmiaru czcionki, aż tekst się zmieści
          let fontSize = 0.9;
          while ((container.scrollHeight > containerHeight || container.scrollWidth > containerWidth) && fontSize > 0.65) {
            fontSize -= 0.05;
            textElement.style.fontSize = `${fontSize}em`;

            // Jeśli jesteśmy na bardzo małym urządzeniu i czcionka jest już mała, wycentruj tekst
            if (fontSize <= 0.75 && window.innerWidth < 480) {
              textElement.style.textAlign = 'center';
            }
          }
        }
      });
    };

    // Dostosuj rozmiar czcionki po renderowaniu
    const timer = setTimeout(adjustTextDisplay, 100);
    return () => clearTimeout(timer);
  }, [current, visibleCount, testimonials]);

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
            <div
              className="testimonial-content"
              ref={el => containerRefs.current[index] = el}
            >
              <p
                className="testimonial-text"
                ref={el => textRefs.current[index] = el}
              >
                {item.text}
              </p>
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
