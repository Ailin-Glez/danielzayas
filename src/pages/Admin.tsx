import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import ImageCropper from '../components/ImageCropper';
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

const CATEGORIAS = ['Reseñas', 'Dossier', 'Crónicas'];

type FormData = {
  titulo: string;
  slug: string;
  fecha: string;
  categoria: string;
  extracto: string;
  contenido: string;
  archivado: boolean;
};

function emptyForm(): FormData {
  return {
    titulo: '',
    slug: '',
    fecha: new Date().toISOString().split('T')[0],
    categoria: 'Reseñas',
    extracto: '',
    contenido: '',
    archivado: false,
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
  const [mostrarArchivados, setMostrarArchivados] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: form.contenido || '<p></p>',
    onUpdate: ({ editor }) => {
      setForm(f => ({ ...f, contenido: editor.getHTML() }));
    },
  });


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
      archivado: post.archivado ?? false,
    });
    editor?.commands.setContent(post.contenido || '<p></p>', { emitUpdate: false });
    setCroppedImage(null);
    setRawImageSrc(null);
    setExistingImage(post.imagen ?? null);
    setSlugEdited(true);
    setStatus('idle');
    setShowDeleteConfirm(false);
  };

  const handleNewPost = () => {
    setSelectedId(null);
    setForm(emptyForm());
    editor?.commands.setContent('<p></p>', { emitUpdate: false });
    setCroppedImage(null);
    setRawImageSrc(null);
    setExistingImage(null);
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
    const basePayload = selectedId !== null ? { ...form, id: selectedId } : form;
    const postPayload = croppedImage
      ? { ...basePayload, imagenData: croppedImage }
      : basePayload;

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
          const newPost: Post = { ...form, id: data.id ?? Date.now(), ...(data.imagen ? { imagen: data.imagen } : {}) };
          setPosts(prev => [newPost, ...prev]);
          setSelectedId(data.id ?? null);
          setCroppedImage(null);
          editor?.commands.setContent('<p></p>', { emitUpdate: false });
          setForm(emptyForm());
          setSlugEdited(false);
        } else {
          setPosts(prev => prev.map(p => p.id === selectedId ? { ...form, id: selectedId! } : p));
          if (data.imagen) setExistingImage(data.imagen);
          setCroppedImage(null);
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

  const handleArchive = async (archivar: boolean) => {
    if (selectedId === null) return;
    setStatus('saving');
    setErrorMsg('');
    const updatedForm = { ...form, archivado: archivar };
    try {
      const res = await fetch('/.netlify/functions/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', password: storedPassword(), post: { ...updatedForm, id: selectedId } }),
      });
      if (res.ok) {
        setForm(updatedForm);
        setPosts(prev => prev.map(p => p.id === selectedId ? { ...p, archivado: archivar } : p));
        setStatus('success');
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMsg(data.error || 'Error al archivar');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Error de conexión');
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
  const visiblePosts = mostrarArchivados ? posts : posts.filter(p => !p.archivado);
  const filteredPosts = search.trim()
    ? visiblePosts.filter(p => normalize(p.titulo).includes(normalize(search)) || normalize(p.categoria).includes(normalize(search)))
    : visiblePosts;

  const archivedCount = posts.filter(p => p.archivado).length;
  const hasContent = form.contenido && form.contenido !== '<p></p>';

  return (
    <main className="admin-panel">
      <header className="admin-header">
        <div className="admin-header__brand">
          <span className="admin-header__site">Partos bajo tierra</span>
          <span className="admin-header__sep">·</span>
          <span className="admin-header__label">Admin</span>
        </div>
        <button className="admin-logout" onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <div className="admin-layout">
        {/* ── Sidebar ── */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar__top">
            {selectMode ? (
              <button className="admin-cancel-select-btn" onClick={toggleSelectMode}>
                ✕ Cancelar selección
              </button>
            ) : (
              <button className="admin-new-btn" onClick={handleNewPost}>
                + Nuevo artículo
              </button>
            )}
          </div>

          <input
            className="admin-search"
            type="search"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="admin-sidebar__meta">
            <span className="admin-sidebar__count">
              {filteredPosts.length} artículo{filteredPosts.length !== 1 ? 's' : ''}
            </span>
            <div className="admin-sidebar__actions-row">
              {!selectMode && (
                <button className="admin-select-btn" onClick={toggleSelectMode}>Seleccionar</button>
              )}
              {archivedCount > 0 && (
                <label className="admin-toggle-archivados">
                  <input
                    type="checkbox"
                    checked={mostrarArchivados}
                    onChange={e => setMostrarArchivados(e.target.checked)}
                  />
                  Archivados ({archivedCount})
                </label>
              )}
            </div>
          </div>

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
              {bulkStatus === 'success' && <p className="admin-status admin-status--success">Eliminados.</p>}
            </div>
          )}

          <div className="admin-posts-list">
            {filteredPosts.length === 0 && (
              <p className="admin-no-results">Sin resultados</p>
            )}
            {filteredPosts.map(post => (
              <button
                key={post.id}
                className={`admin-post-item${!selectMode && selectedId === post.id ? ' admin-post-item--active' : ''}${selectMode && checkedIds.has(post.id) ? ' admin-post-item--checked' : ''}${post.archivado ? ' admin-post-item--archived' : ''}`}
                onClick={() => selectMode ? toggleCheck(post.id) : handleSelectPost(post)}
              >
                {selectMode && (
                  <input
                    type="checkbox"
                    className="admin-post-checkbox"
                    checked={checkedIds.has(post.id)}
                    onChange={() => toggleCheck(post.id)}
                    onClick={e => e.stopPropagation()}
                    tabIndex={-1}
                  />
                )}
                <div className="admin-post-item__info">
                  <div className="admin-post-item__cats">
                    <span className="admin-post-cat">{post.categoria}</span>
                    {post.archivado && <span className="admin-post-badge-archivado">archivado</span>}
                  </div>
                  <strong>{post.titulo}</strong>
                  <time>
                    {new Date(post.fecha + 'T12:00:00').toLocaleDateString('es-MX', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </time>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Editor / empty state ── */}
        <section className="admin-form-section">
          {selectedId === null && !form.titulo ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state__icon">✦</div>
              <p className="admin-empty-state__title">Selecciona un artículo para editarlo</p>
              <p className="admin-empty-state__sub">o crea uno nuevo desde el panel lateral</p>
            </div>
          ) : (
            <>
              {selectedId !== null && form.archivado && (
                <div className="admin-archivado-banner">
                  Este artículo está archivado y no se muestra en el blog público.
                </div>
              )}

              <form onSubmit={handleSave} className="admin-form">
                {/* Fila 1: título + fecha */}
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

                {/* Fila 2: slug + categoría */}
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

                {/* Imagen destacada */}
                <div className="admin-form__field">
                  <label>Imagen destacada <span className="admin-hint-inline">(opcional)</span></label>
                  <div className="admin-imagen-wrap">
                    {(croppedImage || existingImage) && (
                      <div className="admin-imagen-preview">
                        <img src={croppedImage ?? existingImage!} alt="Vista previa" />
                        <button
                          type="button"
                          className="admin-imagen-remove"
                          onClick={() => { setCroppedImage(null); setExistingImage(null); }}
                          title="Quitar imagen"
                        >✕</button>
                      </div>
                    )}
                    <button
                      type="button"
                      className="admin-imagen-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {croppedImage || existingImage ? 'Cambiar imagen' : '+ Añadir imagen'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setRawImageSrc(ev.target?.result as string);
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                </div>

                {/* Extracto */}
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

                {/* Contenido con TipTap y preview toggle */}
                <div className="admin-form__field">
                  <div className="admin-content-header">
                    <label>Contenido <span className="admin-required" aria-hidden="true">*</span></label>
                    {hasContent && (
                      <button
                        type="button"
                        className={`admin-preview-toggle${showPreview ? ' admin-preview-toggle--active' : ''}`}
                        onClick={() => setShowPreview(v => !v)}
                      >
                        {showPreview ? '✎ Editar' : '◉ Vista previa'}
                      </button>
                    )}
                  </div>

                  {showPreview && hasContent ? (
                    <div className="admin-preview-panel">
                      <div
                        className="admin-preview-panel__content"
                        dangerouslySetInnerHTML={{ __html: form.contenido }}
                      />
                    </div>
                  ) : (
                    editor && (
                      <>
                        <div className="admin-toolbar">
                          <button type="button" title="Negrita" className={editor.isActive('bold') ? 'active' : ''} onClick={() => editor.chain().focus().toggleBold().run()}><strong>N</strong></button>
                          <button type="button" title="Cursiva" className={editor.isActive('italic') ? 'active' : ''} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
                          <button type="button" title="Subrayado" className={editor.isActive('underline') ? 'active' : ''} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>S</u></button>
                          <div className="admin-toolbar__sep" />
                          <button type="button" title="Título H2" className={editor.isActive('heading', { level: 2 }) ? 'active' : ''} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                          <button type="button" title="Título H3" className={editor.isActive('heading', { level: 3 }) ? 'active' : ''} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
                          <div className="admin-toolbar__sep" />
                          <button type="button" title="Lista con viñetas" className={editor.isActive('bulletList') ? 'active' : ''} onClick={() => editor.chain().focus().toggleBulletList().run()}>• —</button>
                          <button type="button" title="Lista numerada" className={editor.isActive('orderedList') ? 'active' : ''} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
                          <button type="button" title="Cita" className={editor.isActive('blockquote') ? 'active' : ''} onClick={() => editor.chain().focus().toggleBlockquote().run()}>" "</button>
                          <div className="admin-toolbar__sep" />
                          <button type="button" title="Alinear izquierda" className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''} onClick={() => editor.chain().focus().setTextAlign('left').run()}>⬅</button>
                          <button type="button" title="Centrar" className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''} onClick={() => editor.chain().focus().setTextAlign('center').run()}>⬛</button>
                          <button type="button" title="Alinear derecha" className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''} onClick={() => editor.chain().focus().setTextAlign('right').run()}>➡</button>
                          <div className="admin-toolbar__sep" />
                          <button type="button" title="Deshacer" onClick={() => editor.chain().focus().undo().run()}>↩</button>
                          <button type="button" title="Rehacer" onClick={() => editor.chain().focus().redo().run()}>↪</button>
                        </div>
                        <div className="admin-tiptap">
                          <EditorContent editor={editor} />
                        </div>
                      </>
                    )
                  )}
                </div>

                {/* Acciones */}
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
                    <div className="admin-form__actions-inner">
                      <div className="admin-form__actions-primary">
                        <button type="submit" className="btn-save" disabled={status === 'saving'}>
                          {status === 'saving' ? 'Guardando...' : selectedId !== null ? 'Actualizar' : 'Publicar'}
                        </button>
                        {selectedId !== null && (
                          form.archivado ? (
                            <button type="button" className="btn-unarchive" disabled={status === 'saving'} onClick={() => handleArchive(false)}>
                              Publicar de nuevo
                            </button>
                          ) : (
                            <button type="button" className="btn-archive" disabled={status === 'saving'} onClick={() => handleArchive(true)}>
                              Archivar
                            </button>
                          )
                        )}
                      </div>
                      {selectedId !== null && (
                        <button type="button" className="btn-delete" onClick={() => setShowDeleteConfirm(true)}>
                          Eliminar
                        </button>
                      )}
                    </div>
                  )}

                  {status === 'success' && (
                    <p className="admin-status admin-status--success">
                      Guardado. El sitio se actualizará en 1–2 min.
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="admin-status admin-status--error">Error: {errorMsg}</p>
                  )}
                </div>
              </form>
            </>
          )}
        </section>
      </div>

      {rawImageSrc && (
        <ImageCropper
          src={rawImageSrc}
          onDone={base64 => { setCroppedImage(base64); setRawImageSrc(null); }}
          onCancel={() => setRawImageSrc(null)}
        />
      )}
    </main>
  );
}
