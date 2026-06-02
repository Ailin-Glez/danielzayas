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
            <h1 className="libros-vista__title">Libros</h1>
          </header>

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
                <div className="libro-detalle__badges">
                  <span className="tag" data-genero={selected.genero}>{selected.genero}</span>
                  {selected.editorial && <span className="libro-editorial">{selected.editorial}</span>}
                  {selected.anio && <span className="libro-anio">{selected.anio}</span>}
                </div>
                <div className="compra-links">
                  {selected.compra.amazon !== '#' && (
                    <a href={selected.compra.amazon} target="_blank" rel="noreferrer" className="btn btn-primary">Comprar</a>
                  )}
                  <a href={selected.compra.fragmento !== '#' ? selected.compra.fragmento : undefined} target="_blank" rel="noreferrer" className="btn btn-outline">Leer fragmento</a>
                </div>
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

        </div>
      </section>
    </main>
  );
}
