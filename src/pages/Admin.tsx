import React, { useState, useRef } from 'react';
import { posts as initialPosts } from '../data';
import type { Post } from '../types';
import './Admin.css';

function renderInline(text: string): React.ReactNode {
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const m = match[0];
    parts.push(
      m.startsWith('**')
        ? <strong key={match.index}>{m.slice(2, -2)}</strong>
        : <em key={match.index}>{m.slice(1, -1)}</em>
    );
    lastIndex = match.index + m.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}

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

  const [selectMode, setSelectMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [bulkError, setBulkError] = useState('');

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

  const toggleSelectMode = () => {
    setSelectMode(m => !m);
    setCheckedIds(new Set());
    setShowBulkConfirm(false);
    setBulkStatus('idle');
  };

  const toggleCheck = (id: number) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    setBulkStatus('saving');
    setBulkError('');
    try {
      const res = await fetch('/.netlify/functions/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk-delete', password: storedPassword(), post: { ids: Array.from(checkedIds) } }),
      });
      if (res.ok) {
        const deleted = new Set(checkedIds);
        setPosts(prev => prev.filter(p => !deleted.has(p.id)));
        if (selectedId !== null && deleted.has(selectedId)) handleNewPost();
        setCheckedIds(new Set());
        setShowBulkConfirm(false);
        setSelectMode(false);
        setBulkStatus('success');
        setTimeout(() => setBulkStatus('idle'), 3000);
      } else {
        const data = await res.json();
        setBulkStatus('error');
        setBulkError(data.error || 'Error al eliminar');
        setShowBulkConfirm(false);
      }
    } catch {
      setBulkStatus('error');
      setBulkError('Error de conexión');
      setShowBulkConfirm(false);
    }
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
          const newPost: Post = { ...form, id: data.id ?? Date.now() };
          setPosts(prev => [newPost, ...prev]);
          setSelectedId(data.id ?? null);
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
          {selectMode ? (
            <button className="admin-cancel-select-btn" onClick={toggleSelectMode}>
              ✕ Cancelar selección
            </button>
          ) : (
            <>
              <button className="admin-new-btn" onClick={handleNewPost}>
                + Nuevo artículo
              </button>
              <button className="admin-select-btn" onClick={toggleSelectMode}>
                Seleccionar múltiples
              </button>
            </>
          )}

          <input
            className="admin-search"
            type="search"
            placeholder="Buscar artículo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {selectMode && filteredPosts.length > 0 && (
            <div className="admin-select-bar">
              <label className="admin-select-all">
                <input
                  type="checkbox"
                  checked={checkedIds.size > 0 && checkedIds.size === filteredPosts.length}
                  ref={el => { if (el) el.indeterminate = checkedIds.size > 0 && checkedIds.size < filteredPosts.length; }}
                  onChange={() => setCheckedIds(
                    checkedIds.size === filteredPosts.length
                      ? new Set()
                      : new Set(filteredPosts.map(p => p.id))
                  )}
                />
                <span>Todos ({checkedIds.size}/{filteredPosts.length})</span>
              </label>
              {checkedIds.size > 0 && (
                showBulkConfirm ? (
                  <div className="admin-bulk-confirm">
                    <span>¿Eliminar {checkedIds.size} artículo{checkedIds.size > 1 ? 's' : ''}?</span>
                    <button type="button" className="btn-delete-confirm" onClick={handleBulkDelete} disabled={bulkStatus === 'saving'}>
                      {bulkStatus === 'saving' ? '...' : 'Sí, eliminar'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => setShowBulkConfirm(false)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button type="button" className="admin-bulk-delete-btn" onClick={() => setShowBulkConfirm(true)}>
                    Eliminar {checkedIds.size}
                  </button>
                )
              )}
              {bulkStatus === 'error' && <p className="admin-status admin-status--error">{bulkError}</p>}
              {bulkStatus === 'success' && <p className="admin-status admin-status--success">Eliminados correctamente.</p>}
            </div>
          )}

          <div className="admin-posts-list">
            {filteredPosts.length === 0 && (
              <p className="admin-no-results">Sin resultados</p>
            )}
            {filteredPosts.map(post => (
              <button
                key={post.id}
                className={`admin-post-item ${!selectMode && selectedId === post.id ? 'admin-post-item--active' : ''} ${selectMode && checkedIds.has(post.id) ? 'admin-post-item--checked' : ''}`}
                onClick={() => selectMode ? toggleCheck(post.id) : handleSelectPost(post)}
              >
                {selectMode && (
                  <input
                    type="checkbox"
                    className="admin-post-checkbox"
                    checked={checkedIds.has(post.id)}
                    onChange={() => {}}
                    onClick={e => e.stopPropagation()}
                    tabIndex={-1}
                  />
                )}
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
                <label htmlFor="admin-titulo">Título <span className="admin-required" aria-hidden="true">*</span></label>
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
                <label htmlFor="admin-fecha">Fecha <span className="admin-required" aria-hidden="true">*</span></label>
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
                <label htmlFor="admin-slug">Slug (URL) <span className="admin-required" aria-hidden="true">*</span></label>
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
              <label htmlFor="admin-extracto">Extracto <span className="admin-required" aria-hidden="true">*</span></label>
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
              <label htmlFor="admin-contenido">Contenido <span className="admin-required" aria-hidden="true">*</span></label>
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
              {form.contenido && (
                <div className="admin-preview">
                  <span className="admin-preview__label">Previsualización</span>
                  <div className="admin-preview__content">
                    {form.contenido.split('\n\n').map((parrafo, i) => (
                      <p key={i}>{renderInline(parrafo)}</p>
                    ))}
                  </div>
                </div>
              )}
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
