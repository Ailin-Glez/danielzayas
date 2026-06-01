import { useState } from 'react';
import { libros } from '../data';
import './Libros.css';

export default function Libros() {
  const [selected, setSelected] = useState(libros[0]);

  return (
    <main className="page-libros">
      <section className="libros-vista">
        <div className="container libros-vista__container">

          <header className="libros-vista__header">
            <div>
              <span className="section-label">Obra publicada</span>
              <h1 className="libros-vista__title">Libros</h1>
            </div>
            <div className="compra-links">
              <a href={selected.compra.amazon} target="_blank" rel="noreferrer" className="btn btn-primary btn--sm">Comprar</a>
              <a href={selected.compra.fragmento} target="_blank" rel="noreferrer" className="btn btn-outline btn--sm">Leer fragmento</a>
            </div>
          </header>

          <div className="libro-detalle" key={selected.id} aria-live="polite">
            <div className="libro-detalle__cover">
              {selected.portada ? (
                <img
                  src={selected.portada}
                  alt={`Portada de ${selected.titulo}`}
                  className="libro-portada-img"
                />
              ) : (
                <div className="book-placeholder book-placeholder--lg" style={{ '--book-color': selected.color }}>
                  <span>{selected.titulo}</span>
                  <small>{selected.anio}</small>
                </div>
              )}
            </div>

            <div className="libro-detalle__body">
              <div className="libro-detalle__tags">
                <span className="tag">{selected.genero}</span>
                {selected.editorial && <span className="tag">{selected.editorial}</span>}
                {selected.anio && <span className="tag">{selected.anio}</span>}
              </div>
              <h2>{selected.titulo}</h2>
              <div className="divider" />
              <div className="libro-detalle__scroll">
                <p className="libro-detalle__sinopsis">{selected.sinopsis}</p>
                {selected.reseñas.length > 0 && (
                  <div className="libro-detalle__reseñas">
                    {selected.reseñas.map((r, i) => (
                      <blockquote key={i} className="reseña">
                        "{r.texto}"
                        <cite>— {r.fuente}</cite>
                      </blockquote>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="libros-carousel">
            {libros.map(libro => (
              <button
                key={libro.id}
                className={`carousel-thumb ${selected.id === libro.id ? 'carousel-thumb--active' : ''}`}
                onClick={() => setSelected(libro)}
                style={{ '--libro-color': libro.color }}
                aria-pressed={selected.id === libro.id}
              >
                <div className="carousel-thumb__cover">
                  {libro.portada
                    ? <img src={libro.portada} alt={libro.titulo} />
                    : <span>{libro.titulo}</span>
                  }
                </div>
                <span className="carousel-thumb__title">{libro.titulo}</span>
              </button>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}
