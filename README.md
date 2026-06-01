# Daniel Zayas — Sitio web del escritor

Sitio web personal construido con React. Incluye:

- **Inicio** — Hero, libro destacado, preview del blog, newsletter CTA
- **Libros** — Galería interactiva con sinopsis, reseñas y links de compra
- **Partos bajo tierra** — Blog con filtros por categoría
- **Sobre mí** — Biografía y datos del autor
- **Contacto** — Formulario de contacto con tipos de consulta
- **Newsletter** — Página placeholder (lista para integrar)

## Paleta de colores

Derivada de la ilustración "Partos bajo tierra":
- Crema: `#FAF4E8`
- Ocre: `#C8873A`
- Terra: `#E1694C`
- Tierra profunda: `#3A1500`
- Verde brote: `#5A8A3C`

## Arrancar en local

```bash
npm install
npm start
```

## Build para producción

```bash
npm run build
```

## Deploy en Netlify

1. Subir este repositorio a GitHub
2. Conectar el repo en [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `build`
5. El archivo `netlify.toml` ya configura el routing automáticamente

## Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx / .css
│   └── Footer.jsx / .css
├── pages/
│   ├── Home.jsx / .css
│   ├── Libros.jsx / .css
│   ├── Blog.jsx / .css
│   ├── SobreMi.jsx / .css
│   ├── Contacto.jsx / .css
│   └── Newsletter.jsx / .css
├── data/
│   └── contenido.js    ← aquí van los datos reales (libros, posts)
├── App.jsx
├── index.js
└── index.css           ← design tokens y estilos globales
```

## Personalización

- **Contenido:** Editar `src/data/contenido.js` con los datos reales
- **Colores:** Variables en `src/index.css`
- **Fotos de portadas:** Agregar imágenes y reemplazar los `book-placeholder`
- **Foto del autor:** Reemplazar `.foto-placeholder` en `SobreMi.jsx`
- **Formulario de contacto:** Conectar con [Netlify Forms](https://docs.netlify.com/forms/setup/) o [Formspree](https://formspree.io)
- **Newsletter:** Integrar con Mailchimp, ConvertKit o Substack

## Próximos pasos sugeridos

- [ ] Agregar imágenes reales de portadas
- [ ] Foto del autor en página "Sobre mí"
- [ ] Conectar formulario de contacto con Netlify Forms
- [ ] Crear entradas reales del blog (pueden ser archivos .md o datos en `contenido.js`)
- [ ] Integrar newsletter con Mailchimp / ConvertKit
- [ ] Agregar dominio personalizado en Netlify
- [ ] SEO: agregar `react-helmet` para meta tags por página
- [ ] Analytics: conectar con Plausible o Google Analytics
