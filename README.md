# Pani Stolarka - Strona Portfolio

## O Projekcie

Strona internetowa dla "Pani Stolarka" - portfolio stolarki artystycznej. Projekt zbudowany w React z wykorzystaniem Vite jako narzędzia deweloperskiego, prezentujący rękodzieło, projekty oraz usługi wykonywane przez Panią Stolarkę.

### Funkcjonalności

- Responsywny design dostosowany do urządzeń mobilnych i desktopowych
- Interaktywna karuzela galerii prezentująca projekty
- Dynamiczny carousel z opiniami klientów ładowanymi z plików YAML
- Sekcja kontaktowa z formularzem
- Animowane przejścia między sekcjami

## Technologie

- React 18
- Vite
- JavaScript (ES6+)
- CSS3

## Uruchamianie Lokalnie

Aby uruchomić projekt lokalnie:

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/[twój-username]/panistolarka.git
   cd panistolarka
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   ```

3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```

4. Otwórz przeglądarkę pod adresem:
   ```
   http://localhost:5173
   ```

## Deployment

Projekt jest skonfigurowany do automatycznego deploymentu przez [Vercel](https://vercel.com). 


## Struktura Projektu

```
/public             # Statyczne pliki, w tym obrazy i zasoby
/src                # Kod źródłowy aplikacji
  /assets           # Zasoby aplikacji (zdjęcia, pliki YAML)
  /components       # Komponenty React (jeśli są używane)
  GalleryCarousel.jsx  # Komponent karuzeli galerii
  TestimonialsCarousel.jsx # Komponent karuzeli opinii
  main.jsx          # Punkt wejścia dla React
/styles.css         # Główny arkusz stylów
```

## Licencja

[MIT](LICENSE) © Pani Stolarka

## Autor

Projekt stworzony dla Pani Stolarki.
