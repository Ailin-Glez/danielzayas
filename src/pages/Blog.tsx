import { useState } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../data';
import { calcularLectura } from '../utils/lectura';
import './Blog.css';

const categorias = ['Todas', ...new Set(posts.map(p => p.categoria))];
const POR_PAGINA = 6;

export default function Blog() {
  const [categoria, setCategoria] = useState('Todas');
  const [pagina, setPagina] = useState(0);

  const filtrados = categoria === 'Todas'
    ? posts
    : posts.filter(p => p.categoria === categoria);

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
  const visibles = filtrados.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);

  const cambiarFiltro = (cat: string) => {
    setCategoria(cat);
    setPagina(0);
  };

  return (
    <main className="page-blog">
      <div className="page-hero page-hero--blog">
        <div className="container">
          <span className="section-label">Bitácora de escritura</span>
          <h1>Partos <em>bajo tierra</em></h1>
          <p>
            Reflexiones sobre el proceso de escribir, lecturas que me han partido,
            notas de trabajo y todo lo que sucede entre un libro y el siguiente.
          </p>
        </div>
      </div>

      <section className="section blog-section">
        <div className="container blog-layout">

          <aside className="blog-sidebar">
            <div className="blog-circle-center">
              <img src="/ilustracion-partos.jpg" alt="Ilustración Partos bajo tierra" />
            </div>
          </aside>

          <div className="blog-content">
            <div className="blog-filtros">
              {categorias.map(cat => (
                <button
                  key={cat}
                  data-cat={cat}
                  className={`filtro-btn ${categoria === cat ? 'filtro-btn--active' : ''}`}
                  onClick={() => cambiarFiltro(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="blog-grid">
              {visibles.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} data-cat={post.categoria} className="blog-card">
                  <div className="blog-card__meta">
                    <span className="post-card__cat">{post.categoria}</span>
                    <span className="post-card__time">{calcularLectura(post.contenido)}</span>
                  </div>
                  <h2 className="blog-card__title">
                    {post.titulo.includes(',') ? (
                      <><strong>{post.titulo.split(',')[0]}</strong>{post.titulo.slice(post.titulo.indexOf(','))}</>
                    ) : post.titulo}
                  </h2>
                </Link>
              ))}
            </div>

            {totalPaginas > 1 && (
              <div className="blog-paginacion">
                <button
                  className="pag-btn"
                  onClick={() => setPagina(p => p - 1)}
                  disabled={pagina === 0}
                  aria-label="Anterior"
                >
                  ←
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <button
                    key={i}
                    className={`pag-dot ${i === pagina ? 'pag-dot--active' : ''}`}
                    onClick={() => setPagina(i)}
                    aria-label={`Página ${i + 1}`}
                  />
                ))}
                <button
                  className="pag-btn"
                  onClick={() => setPagina(p => p + 1)}
                  disabled={pagina === totalPaginas - 1}
                  aria-label="Siguiente"
                >
                  →
                </button>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
