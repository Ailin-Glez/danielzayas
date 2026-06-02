const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const REPO = 'Ailin-Glez/danielzayas';
const FILE_PATH = 'src/data/posts/posts.json';
const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  const { password, action, post } = body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: 'No autorizado' }) };
  }

  if (action === 'verify') {
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true }) };
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
    const newPost = { ...post, id: newId };
    updatedPosts = [newPost, ...currentPosts];
    commitMessage = `Nuevo artículo: ${post.titulo}`;
  } else if (action === 'update') {
    updatedPosts = currentPosts.map(p => p.id === post.id ? { ...post } : p);
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
