import { useState, useRef, useEffect, useCallback } from 'react';
import { libros } from '../data';
import type { Libro } from '../types';
import { renderInline } from '../utils/renderInline';
import './Libros.css';

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

  const bloques = (libro.fragmento ?? '')
    .replace(/\n[ \t]+\n/g, '\n\n')
    .split(/\n{2,}/);

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

            const esNumeralRomano = (t: string) => /^[IVXivx]+$/.test(t.trim()) && t.trim().length <= 5;
            const esLineaTitulo = (l: string) => {
              const t = l.trim();
              return !esNumeralRomano(t) &&
                t === t.toUpperCase() &&
                t.length < 100 &&
                t.split(' ').length <= 14 &&
                t.split(' ').every(w => /^[A-ZÁÉÍÓÚÜÑ\d]+$/.test(w));
            };

            const lineasBloque = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
            const todasSonTitulo = lineasBloque.length >= 1 && lineasBloque.every(l => esLineaTitulo(l));
            if (todasSonTitulo && !esNumeralRomano(trimmed)) {
              return <h3 key={i} className="fragmento-seccion">{lineasBloque.join(' ')}</h3>;
            }

            const esBloqueCursiva = trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**');
            const contenido = esBloqueCursiva ? trimmed.slice(1, -1).trim() : trimmed;
            const lineas = contenido.split('\n');
            const esPoesia = lineas.length > 1 && lineas.filter(l => l.trim().length < 70).length > lineas.length * 0.6;
            if (esPoesia) {
              const primeraEsTitulo = esLineaTitulo(lineas[0]) && !esNumeralRomano(lineas[0]);
              const versos = primeraEsTitulo ? lineas.slice(1) : lineas;
              return (
                <span key={i}>
                  {primeraEsTitulo && <h3 className="fragmento-seccion">{lineas[0].trim()}</h3>}
                  {versos.length > 0 && (
                    <p className="fragmento-parrafo fragmento-parrafo--verso">
                      {versos.map((linea, j) => {
                        const esDedicatoria = linea.trimStart().startsWith('>');
                        const textoLinea = esDedicatoria ? linea.trimStart().slice(1).trim() : linea;
                        return (
                          <span key={j} className={esDedicatoria ? 'fragmento-dedicatoria' : undefined}>
                            {renderInline(textoLinea)}<br />
                          </span>
                        );
                      })}
                    </p>
                  )}
                </span>
              );
            }
            return (
              <p key={i} className={`fragmento-parrafo${esBloqueCursiva ? ' fragmento-parrafo--carta' : ''}`}>
                {lineas.map((linea, j) => {
                  const esDedicatoria = linea.trimStart().startsWith('>');
                  const textoLinea = esDedicatoria ? linea.trimStart().slice(1).trim() : linea;
                  return (
                    <span key={j} className={esDedicatoria ? 'fragmento-dedicatoria' : 'fragmento-linea'}>
                      {renderInline(textoLinea)}
                    </span>
                  );
                })}
              </p>
            );
          })}

          {libro.compra.amazon !== '#' && (
            <div className="fragmento-panel__compra">
              <a
                href={libro.compra.amazon}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
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
    } else if (libro.compra.fragmento !== '#') {
      window.open(libro.compra.fragmento, '_blank', 'noreferrer');
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; }
  }, [selectedId]);

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
                    {(selected.fragmento || selected.compra.fragmento !== '#') && (
                      <button
                        className="btn btn-outline btn--sm"
                        onClick={() => handleFragmento(selected)}
                      >Leer fragmento</button>
                    )}
                    {selected.compra.amazon !== '#' && (
                      <a href={selected.compra.amazon} target="_blank" rel="noreferrer" className="btn btn-primary btn--sm">Comprar</a>
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
