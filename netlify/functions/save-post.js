const crypto = require('crypto');

const ALLOWED_ORIGIN = process.env.URL || process.env.DEPLOY_PRIME_URL || '*';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const REPO = 'Ailin-Glez/danielzayas';
const FILE_PATH = 'src/data/posts/posts.json';
const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
const SESSION_MS = 1000 * 60 * 60 * 4;

function timingSafeEqualStr(a, b) {
  const bufA = Buffer.from(String(a ?? ''));
  const bufB = Buffer.from(String(b ?? ''));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function makeToken(secret) {
  const expiry = String(Date.now() + SESSION_MS);
  const hmac = crypto.createHmac('sha256', secret).update(expiry).digest('hex');
  return `${expiry}.${hmac}`;
}

function verifyToken(token, secret) {
  if (!token || typeof token !== 'string') return false;
  const [expiry, hmac] = token.split('.');
  if (!expiry || !hmac || !/^\d+$/.test(expiry)) return false;
  if (Date.now() > Number(expiry)) return false;
  const expected = crypto.createHmac('sha256', secret).update(expiry).digest('hex');
  return timingSafeEqualStr(hmac, expected);
}

function sanitizeSlug(slug) {
  return String(slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 100);
}

async function uploadImage(githubHeaders, slug, base64Data) {
  const safeSlug = sanitizeSlug(slug);
  if (!safeSlug) throw new Error('Slug inválido');

  const ext = base64Data.startsWith('data:image/png') ? 'png' : 'jpg';
  const imagePath = `public/blog/${safeSlug}.${ext}`;
  const imageUrl = `https://api.github.com/repos/${REPO}/contents/${imagePath}`;
  const rawBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

  const existing = await fetch(imageUrl, { headers: githubHeaders });
  const sha = existing.ok ? (await existing.json()).sha : undefined;

  const body = {
    message: `Imagen para: ${safeSlug}`,
    content: rawBase64,
    author: { name: 'Panel Admin', email: 'admin@danielzayas.com' },
  };
  if (sha) body.sha = sha;

  const res = await fetch(imageUrl, {
    method: 'PUT',
    headers: githubHeaders,
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('No se pudo subir la imagen');
  return `/blog/${safeSlug}.${ext}`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'ADMIN_PASSWORD no configurado' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  const { action, post, token, password } = body;

  if (action === 'verify') {
    if (!timingSafeEqualStr(password, ADMIN_PASSWORD)) {
      return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: 'No autorizado' }) };
    }
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true, token: makeToken(ADMIN_PASSWORD) }) };
  }

  if (!verifyToken(token, ADMIN_PASSWORD)) {
    return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: 'No autorizado' }) };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'GITHUB_TOKEN no configurado' }) };
  }

  const githubHeaders = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'danielzayas-admin',
  };

  const getRes = await fetch(API_URL, { headers: githubHeaders });
  if (!getRes.ok) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'No se pudo leer posts.json de GitHub' }) };
  }
  const fileData = await getRes.json();

  let currentPosts;
  try {
    const decoded = Buffer.from(fileData.content.replace(/\n/g, ''), 'base64').toString('utf-8');
    currentPosts = JSON.parse(decoded);
  } catch {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'No se pudo parsear posts.json' }) };
  }

  const sha = fileData.sha;
  let updatedPosts;
  let commitMessage;
  let newId;

  if (action === 'create') {
    const maxId = currentPosts.length > 0 ? Math.max(...currentPosts.map(p => p.id)) : 0;
    newId = maxId + 1;
    let imageUrl;
    if (post.imagenData) {
      try { imageUrl = await uploadImage(githubHeaders, post.slug, post.imagenData); } catch {}
    }
    const { imagenData: _, ...postClean } = post;
    const newPost = { ...postClean, id: newId, ...(imageUrl ? { imagen: imageUrl } : {}) };
    updatedPosts = [newPost, ...currentPosts];
    commitMessage = `Nuevo artículo: ${post.titulo}`;
  } else if (action === 'update') {
    let imageUrl;
    if (post.imagenData) {
      try { imageUrl = await uploadImage(githubHeaders, post.slug, post.imagenData); } catch {}
    }
    const { imagenData: _, ...postClean } = post;
    const updatedPost = { ...postClean, ...(imageUrl ? { imagen: imageUrl } : {}) };
    updatedPosts = currentPosts.map(p => p.id === post.id ? updatedPost : p);
    commitMessage = `Actualizar: ${post.titulo}`;
  } else if (action === 'delete') {
    const target = currentPosts.find(p => p.id === post.id);
    updatedPosts = currentPosts.filter(p => p.id !== post.id);
    commitMessage = `Eliminar artículo: ${target ? target.titulo : post.id}`;
  } else if (action === 'bulk-delete') {
    const ids = new Set(post.ids);
    const targets = currentPosts.filter(p => ids.has(p.id));
    updatedPosts = currentPosts.filter(p => !ids.has(p.id));
    commitMessage = `Eliminar ${targets.length} artículo${targets.length !== 1 ? 's' : ''}`;
  } else {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Acción desconocida' }) };
  }

  const newContent = Buffer.from(JSON.stringify(updatedPosts, null, 2)).toString('base64');

  const putRes = await fetch(API_URL, {
    method: 'PUT',
    headers: githubHeaders,
    body: JSON.stringify({
      message: commitMessage,
      content: newContent,
      sha,
      author: { name: 'Panel Admin', email: 'admin@danielzayas.com' },
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message || 'Error al guardar en GitHub' }) };
  }

  const responseBody = action === 'create' ? { success: true, id: newId } : { success: true };
  return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(responseBody) };
};
