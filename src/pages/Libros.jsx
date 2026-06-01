import { useState } from 'react';
import { libros } from '../data/contenido';
import './Libros.css';

export default function Libros() {
  const [selected, setSelected] = useState(libros[0]);

  return (
    <main className="page-libros">
      <div className="page-hero page-hero--sm">
        <div className="container">
          <span className="section-label">Obra publicada</span>
          <h1>Libros</h1>
          <div className="divider" />
          <p>Cuatro libros que exploran los límites del género y del cuerpo.</p>
        </div>
      </div>

      <section className="section libros-lista">
        <div className="container">
          <div className="libros-grid">
            {libros.map(libro => (
              <button
                key={libro.id}
                className={`libro-thumb ${selected.id === libro.id ? 'libro-thumb--active' : ''}`}
                onClick={() => setSelected(libro)}
                style={{ '--libro-color': libro.color }}
              >
                <div className="libro-thumb__cover">
                  <span>{libro.titulo}</span>
                  <small>{libro.anio}</small>
                </div>
                <div className="libro-thumb__info">
                  <strong>{libro.titulo}</strong>
                  <span>{libro.anio}</span>
                </div>
              </button>
            ))}
          </div>

          {/* ── Detalle del libro seleccionado ── */}
          <div className="libro-detalle" key={selected.id}>
            <div className="libro-detalle__cover">
              <div className="book-placeholder book-placeholder--lg" style={{ '--book-color': selected.color }}>
                <span>{selected.titulo}</span>
                <small>{selected.anio}</small>
              </div>
            </div>
            <div className="libro-detalle__body">
              <div className="libro-detalle__tags">
                <span className="tag">{selected.genero}</span>
                <span className="tag">{selected.editorial}</span>
                <span className="tag">{selected.anio}</span>
              </div>
              <h2>{selected.titulo}</h2>
              <div className="divider" />
              <p className="libro-detalle__sinopsis">{selected.sinopsis}</p>

              {selected.reseñas.length > 0 && (
                <div className="libro-detalle__reseñas">
                  <span className="section-label">Reseñas</span>
                  {selected.reseñas.map((r, i) => (
                    <blockquote key={i} className="reseña">
                      "{r.texto}"
                      <cite>— {r.fuente}</cite>
                    </blockquote>
                  ))}
                </div>
              )}

              <div className="libro-detalle__compra">
                <span className="section-label">Dónde conseguirlo</span>
                <div className="compra-links">
                  <a href={selected.compra.amazon} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Amazon
                  </a>
                  <a href={selected.compra.gandhi} target="_blank" rel="noreferrer" className="btn btn-outline">
                    Gandhi
                  </a>
                  <a href={selected.compra.editorial} target="_blank" rel="noreferrer" className="btn btn-outline">
                    Editorial
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
