import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { libros } from '../data';
import type { Libro } from '../types';
import { dividirBloques, parseBloque, renderBloque } from '../utils/fragmento';
import { renderInline } from '../utils/renderInline';
import './Libros.css';
import './fragmento-preview.css';

function FragmentoPanel({ libro, onClose }: { libro: Libro; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 320);
  }, [onClose]);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const bloques = dividirBloques(libro.fragmento ?? '');

  return (
    <>
      <aside
        className={`fragmento-panel${visible ? ' fragmento-panel--visible' : ''}`}
        aria-label={`Fragmento de ${libro.titulo}`}
      >
        <div className="fragmento-panel__header">
          <div className="fragmento-panel__meta">
            <span className="fragmento-panel__label">Fragmento</span>
            <h2 className="fragmento-panel__titulo">{libro.titulo}</h2>
          </div>
          <button className="fragmento-panel__close" onClick={handleClose} aria-label="Cerrar panel">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="15" y2="15" />
              <line x1="15" y1="3" x2="3" y2="15" />
            </svg>
          </button>
        </div>

        <div className="fragmento-panel__body">
          {bloques.map((bloque, i) => {
            const trimmed = bloque.trim();
            if (!trimmed) return null;
            return renderBloque(parseBloque(trimmed), i);
          })}

          {libro.compra.amazon && (
            <div className="fragmento-panel__compra">
              <a
                href={libro.compra.amazon}
                target="_blank"
                rel="noreferrer"
                className="btn btn-compra"
              >Comprar libro</a>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default function Libros() {
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('libros_selected_id');
      return saved ? parseInt(saved) : null;
    } catch { return null; }
  });
  const [panelFragmento, setPanelFragmento] = useState<Libro | null>(null);
  const location = useLocation();

  const selected: Libro | null = selectedId !== null
    ? (libros.find(l => l.id === selectedId) ?? null)
    : null;

  const isFirstRender = useRef(true);

  const handleSelect = (libro: Libro) => {
    try { localStorage.setItem('libros_selected_id', String(libro.id)); } catch {}
    setSelectedId(libro.id);
  };

  const handleFragmento = useCallback((libro: Libro) => {
    if (libro.fragmento) {
      setPanelFragmento(libro);
    } else if (libro.compra.fragmento) {
      window.open(libro.compra.fragmento, '_blank', 'noreferrer');
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; }
  }, [selectedId]);

  useEffect(() => {
    const state = location.state as { libroId?: number; abrirFragmento?: boolean } | null;
    if (!state?.libroId) return;
    const libro = libros.find(l => l.id === state.libroId);
    if (!libro) return;
    handleSelect(libro);
    if (state.abrirFragmento) handleFragmento(libro);
    window.history.replaceState({}, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    document.body.style.overflow = panelFragmento ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [panelFragmento]);

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
                    ? <img src={libro.portada} alt={libro.titulo} loading="lazy" />
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
                    {(selected.fragmento || selected.compra.fragmento) && (
                      <button
                        className="btn btn-outline btn--sm"
                        onClick={() => handleFragmento(selected)}
                      >Leer fragmento</button>
                    )}
                    {selected.compra.amazon && (
                      <a href={selected.compra.amazon} target="_blank" rel="noreferrer" className="btn btn-compra btn--sm">Comprar</a>
                    )}
                  </div>
                </div>
                <blockquote className="reseña libro-sinopsis">
                  {renderInline(selected.sinopsis)}
                  {selected.autorPalabras && <cite>— {selected.autorPalabras}</cite>}
                </blockquote>
              </div>
            </div>
          )}

        </div>
      </section>

      {panelFragmento && (
        <FragmentoPanel libro={panelFragmento} onClose={() => setPanelFragmento(null)} />
      )}
    </main>
  );
}
