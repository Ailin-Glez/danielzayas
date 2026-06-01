import { useState } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../data/contenido';
import './Blog.css';

const categorias = ['Todas', ...new Set(posts.map(p => p.categoria))];

export default function Blog() {
  const [categoria, setCategoria] = useState('Todas');

  const filtrados = categoria === 'Todas'
    ? posts
    : posts.filter(p => p.categoria === categoria);

  return (
    <main className="page-blog">
      <div className="page-hero page-hero--blog">
        <div className="container">
          <span className="section-label">Bitácora de escritura</span>
          <h1>Partos<br /><em>bajo tierra</em></h1>
          <p>
            Reflexiones sobre el proceso de escribir, lecturas que me han partido,
            notas de trabajo y todo lo que sucede entre un libro y el siguiente.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filtros */}
          <div className="blog-filtros">
            {categorias.map(cat => (
              <button
                key={cat}
                className={`filtro-btn ${categoria === cat ? 'filtro-btn--active' : ''}`}
                onClick={() => setCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de posts */}
          <div className="blog-full-grid">
            {filtrados.map((post, i) => (
              <article key={post.id} className={`blog-card ${i === 0 && categoria === 'Todas' ? 'blog-card--featured' : ''}`}>
                <div className="blog-card__meta">
                  <span className="post-card__cat">{post.categoria}</span>
                  <span className="post-card__time">{post.tiempoLectura}</span>
                </div>
                <h2 className="blog-card__title">{post.titulo}</h2>
                <p className="blog-card__excerpt">{post.extracto}</p>
                <div className="blog-card__footer">
                  <Link to={`/blog/${post.slug}`} className="btn btn-outline btn--sm">
                    Leer entrada →
                  </Link>
                  <time>
                    {new Date(post.fecha).toLocaleDateString('es-MX', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
