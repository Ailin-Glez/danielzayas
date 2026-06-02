import { useState, useRef, useEffect } from 'react';
import { libros } from '../data';
import type { Libro } from '../types';
import './Libros.css';

export default function Libros() {
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('libros_selected_id');
      return saved ? parseInt(saved) : null;
    } catch { return null; }
  });

  const selected: Libro | null = selectedId !== null
    ? (libros.find(l => l.id === selectedId) ?? null)
    : null;

  const isFirstRender = useRef(true);

  const handleSelect = (libro: Libro) => {
    try { localStorage.setItem('libros_selected_id', String(libro.id)); } catch {}
    setSelectedId(libro.id);
  };

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; }
  }, [selectedId]);

  return (
    <main className="page-libros">
      <section className="libros-vista">
        <div className="container libros-vista__container">

          <header className="libros-vista__header">
            <h1 className="libros-vista__title">Libros</h1>
          </header>

          <div className={`libros-carousel${!selected ? ' libros-carousel--expanded' : ''}`}>
            {libros.map(libro => (
              <button
                key={libro.id}
                className={`carousel-thumb ${selected?.id === libro.id ? 'carousel-thumb--active' : ''}`}
                onClick={() => handleSelect(libro)}
                style={{ '--libro-color': libro.color } as React.CSSProperties}
                aria-pressed={selected?.id === libro.id}
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

          {selected && (
            <div className="libro-detalle" key={selected.id} aria-live="polite">
              <div className="libro-detalle__cover">
                {selected.portada ? (
                  <img
                    src={selected.portada}
                    alt={`Portada de ${selected.titulo}`}
                    className="libro-portada-img"
                  />
                ) : (
                  <div className="book-placeholder book-placeholder--lg" style={{ '--book-color': selected.color } as React.CSSProperties}>
                    <span>{selected.titulo}</span>
                    <small>{selected.anio}</small>
                  </div>
                )}
              </div>

              <div className="libro-detalle__body">
                <h2>{selected.titulo}</h2>
                <div className="libro-detalle__top-row">
                  <div className="libro-detalle__badges">
                    <span className="tag" data-genero={selected.genero}>{selected.genero}</span>
                    {selected.editorial && <span className="libro-editorial">{selected.editorial}</span>}
                    {selected.anio && <span className="libro-anio">{selected.anio}</span>}
                  </div>
                  <div className="compra-links">
                    <a
                      href={selected.compra.fragmento !== '#' ? selected.compra.fragmento : undefined}
                      target="_blank" rel="noreferrer"
                      className="btn btn-outline btn--sm"
                    >Leer fragmento</a>
                    {selected.compra.amazon !== '#' && (
                      <a href={selected.compra.amazon} target="_blank" rel="noreferrer" className="btn btn-primary btn--sm">Comprar</a>
                    )}
                  </div>
                </div>
                <blockquote className="reseña libro-sinopsis">
                  {selected.sinopsis}
                  {selected.autorPalabras && <cite>— {selected.autorPalabras}</cite>}
                </blockquote>
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
