import React, { useState, useRef } from 'react';
import { posts as initialPosts } from '../data';
import type { Post } from '../types';
import './Admin.css';

function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const CATEGORIAS = ['Reseña', 'Presentación', 'Textos'];

type FormData = {
  titulo: string;
  slug: string;
  fecha: string;
  categoria: string;
  extracto: string;
  contenido: string;
};

function emptyForm(): FormData {
  return {
    titulo: '',
    slug: '',
    fecha: new Date().toISOString().split('T')[0],
    categoria: 'Reseña',
    extracto: '',
    contenido: '',
  };
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('admin_auth') === 'true'
  );
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [slugEdited, setSlugEdited] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (before: string, after: string) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = form.contenido;
    const newText = text.slice(0, start) + before + text.slice(start, end) + after + text.slice(end);
    setForm(f => ({ ...f, contenido: newText }));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    });
  };

  const storedPassword = () => sessionStorage.getItem('admin_password') || '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/.netlify/functions/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', password }),
      });
      if (res.ok) {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('admin_password', password);
        setAuthenticated(true);
      } else {
        setLoginError('Contraseña incorrecta.');
      }
    } catch {
      setLoginError('Error de conexión. Inténtalo de nuevo.');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_password');
    setAuthenticated(false);
    setPassword('');
  };

  const handleSelectPost = (post: Post) => {
    setSelectedId(post.id);
    setForm({
      titulo: post.titulo,
      slug: post.slug,
      fecha: post.fecha,
      categoria: post.categoria,
      extracto: post.extracto,
      contenido: post.contenido,
    });
    setSlugEdited(true);
    setStatus('idle');
    setShowDeleteConfirm(false);
  };

  const handleNewPost = () => {
    setSelectedId(null);
    setForm(emptyForm());
    setSlugEdited(false);
    setStatus('idle');
    setShowDeleteConfirm(false);
  };

  const handleTitleChange = (titulo: string) => {
    setForm(f => ({
      ...f,
      titulo,
      slug: slugEdited ? f.slug : generateSlug(titulo),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMsg('');

    const action = selectedId === null ? 'create' : 'update';
    const postPayload = selectedId !== null ? { ...form, id: selectedId } : form;

    try {
      const res = await fetch('/.netlify/functions/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, password: storedPassword(), post: postPayload }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        if (action === 'create') {
          const tempPost: Post = { ...form, id: Date.now() };
          setPosts(prev => [tempPost, ...prev]);
          setSelectedId(null);
          setForm(emptyForm());
          setSlugEdited(false);
        } else {
          setPosts(prev => prev.map(p => p.id === selectedId ? { ...form, id: selectedId! } : p));
        }
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Error desconocido');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Error de conexión');
    }
  };

  const handleDelete = async () => {
    if (selectedId === null) return;
    setStatus('saving');
    setErrorMsg('');
    try {
      const res = await fetch('/.netlify/functions/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', password: storedPassword(), post: { id: selectedId } }),
      });

      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== selectedId));
        handleNewPost();
        setStatus('success');
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMsg(data.error || 'Error al eliminar');
        setShowDeleteConfirm(false);
      }
    } catch {
      setStatus('error');
      setErrorMsg('Error de conexión');
      setShowDeleteConfirm(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="admin-login">
        <form onSubmit={handleLogin} className="admin-login__card">
          <h1>Panel de administración</h1>
          <p>Partos bajo tierra</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            required
          />
          {loginError && <p className="admin-status admin-status--error">{loginError}</p>}
          <button type="submit" disabled={loginLoading}>
            {loginLoading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </main>
    );
  }

  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const filteredPosts = search.trim()
    ? posts.filter(p => normalize(p.titulo).includes(normalize(search)) || normalize(p.categoria).includes(normalize(search)))
    : posts;

  return (
    <main className="admin-panel">
      <header className="admin-header">
        <h1>Partos bajo tierra — Panel de administración</h1>
        <button className="admin-logout" onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <button className="admin-new-btn" onClick={handleNewPost}>
            + Nuevo artículo
          </button>
          <input
            className="admin-search"
            type="search"
            placeholder="Buscar artículo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="admin-posts-list">
            {filteredPosts.length === 0 && (
              <p className="admin-no-results">Sin resultados</p>
            )}
            {filteredPosts.map(post => (
              <button
                key={post.id}
                className={`admin-post-item ${selectedId === post.id ? 'admin-post-item--active' : ''}`}
                onClick={() => handleSelectPost(post)}
              >
                <span className="admin-post-cat">{post.categoria}</span>
                <strong>{post.titulo}</strong>
                <time>
                  {new Date(post.fecha + 'T12:00:00').toLocaleDateString('es-MX', {
                    year: 'numeric', month: 'short',
                  })}
                </time>
              </button>
            ))}
          </div>
        </aside>

        <section className="admin-form-section">
          <form onSubmit={handleSave} className="admin-form">
            <div className="admin-form__row">
              <div className="admin-form__field admin-form__field--grow">
                <label htmlFor="admin-titulo">Título</label>
                <input
                  id="admin-titulo"
                  type="text"
                  value={form.titulo}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Título del artículo"
                  required
                />
              </div>
              <div className="admin-form__field">
                <label htmlFor="admin-fecha">Fecha</label>
                <input
                  id="admin-fecha"
                  type="date"
                  value={form.fecha}
                  onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="admin-form__row">
              <div className="admin-form__field admin-form__field--grow">
                <label htmlFor="admin-slug">Slug (URL)</label>
                <input
                  id="admin-slug"
                  type="text"
                  value={form.slug}
                  onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                  placeholder="url-del-articulo"
                  required
                />
              </div>
              <div className="admin-form__field">
                <label htmlFor="admin-cat">Categoría</label>
                <select
                  id="admin-cat"
                  value={form.categoria}
                  onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                >
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="admin-form__field">
              <label htmlFor="admin-extracto">Extracto</label>
              <textarea
                id="admin-extracto"
                value={form.extracto}
                onChange={e => setForm(f => ({ ...f, extracto: e.target.value }))}
                rows={3}
                placeholder="Breve resumen del artículo..."
                required
              />
            </div>

            <div className="admin-form__field">
              <label htmlFor="admin-contenido">Contenido</label>
              <p className="admin-form__hint">Separa los párrafos con una línea en blanco. Selecciona texto para aplicar formato.</p>
              <div className="admin-toolbar">
                <button type="button" onClick={() => wrapSelection('**', '**')} title="Negrita">
                  <strong>N</strong>
                </button>
                <button type="button" onClick={() => wrapSelection('*', '*')} title="Cursiva">
                  <em>C</em>
                </button>
              </div>
              <textarea
                id="admin-contenido"
                ref={contentRef}
                value={form.contenido}
                onChange={e => setForm(f => ({ ...f, contenido: e.target.value }))}
                rows={22}
                placeholder="Escribe el contenido del artículo aquí..."
                required
              />
            </div>

            <div className="admin-form__actions">
              {showDeleteConfirm ? (
                <div className="admin-delete-confirm">
                  <span>¿Seguro que quieres eliminar este artículo?</span>
                  <button type="button" className="btn-delete-confirm" onClick={handleDelete}>
                    Sí, eliminar
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <button type="submit" className="btn-save" disabled={status === 'saving'}>
                    {status === 'saving' ? 'Guardando...' : selectedId !== null ? 'Actualizar' : 'Publicar'}
                  </button>
                  {selectedId !== null && (
                    <button type="button" className="btn-delete" onClick={() => setShowDeleteConfirm(true)}>
                      Eliminar
                    </button>
                  )}
                </>
              )}

              {status === 'success' && (
                <p className="admin-status admin-status--success">
                  Guardado. El sitio se actualizará en 1-2 minutos.
                </p>
              )}
              {status === 'error' && (
                <p className="admin-status admin-status--error">Error: {errorMsg}</p>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
