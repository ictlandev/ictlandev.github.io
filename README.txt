# Flores Amarillas — versión móvil / iOS Safari

Esta versión está pensada primero para teléfonos, especialmente iPhone con Safari.

## Características

- Pantalla inicial oscura con "Tengo algo para ti..."
- Botón de interacción compatible con las restricciones de audio de iOS.
- Transición tipo sorpresa.
- Ramo de flores amarillas construido con CSS.
- Pétalos y corazones animados mediante Canvas.
- Mensaje romántico.
- Diseño responsive.
- Soporte para safe-area de iPhone (notch / Dynamic Island / barra inferior).
- No requiere servidor, PHP ni base de datos.

## Audio

Coloca:

    assets/flores-amarillas.mp3

El JavaScript intentará reproducir ese archivo después del toque en "Abrir mi sorpresa".

Si el MP3 no está disponible, se genera un pequeño arpegio genérico con Web Audio API.

La grabación original de "Flores Amarillas" no está incluida. Para publicar el sitio utiliza un audio para el que tengas autorización/licencia.

## Estructura

    index.html
    styles.css
    script.js
    assets/
        flores-amarillas.mp3

## Hosting

Puedes subir los archivos directamente a cualquier hosting estático o al public_html de un hosting tradicional.

Ejemplo:

    public_html/
        index.html
        styles.css
        script.js
        assets/
            flores-amarillas.mp3

Después abre tu dominio desde Safari.

## Recomendación para iPhone

La experiencia funciona mejor en orientación vertical. No se requiere instalar una app.

Si el usuario agrega la página a "Pantalla de inicio" en iOS, los metadatos incluidos permiten que se comporte de forma más parecida a una mini-app.
