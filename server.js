const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const mediaDir = path.join(root, 'assets', 'project-media');
const port = Number(process.env.PORT || 4174);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg'
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function safeFileName(name, mime) {
  const extFromMime = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/ogg': '.ogg'
  };
  const parsed = path.parse(name || 'media');
  const ext = (parsed.ext || extFromMime[mime] || '').toLowerCase();
  const base = (parsed.name || 'media')
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'media';
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}-${base}${ext}`;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 80 * 1024 * 1024) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function handleUpload(req, res) {
  try {
    const payload = JSON.parse(await readBody(req));
    const dataUrl = String(payload.dataUrl || '');
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      send(res, 400, JSON.stringify({ error: 'Invalid file data' }), 'application/json; charset=utf-8');
      return;
    }
    const mime = match[1];
    if (!/^(image\/|video\/)/.test(mime)) {
      send(res, 400, JSON.stringify({ error: 'Only image and video files are supported' }), 'application/json; charset=utf-8');
      return;
    }
    fs.mkdirSync(mediaDir, { recursive: true });
    const filename = safeFileName(payload.name, mime);
    const filePath = path.join(mediaDir, filename);
    fs.writeFileSync(filePath, Buffer.from(match[2], 'base64'));
    send(res, 200, JSON.stringify({ url: `./assets/project-media/${filename}` }), 'application/json; charset=utf-8');
  } catch (error) {
    const status = error.message === 'Payload too large' ? 413 : 500;
    send(res, status, JSON.stringify({ error: error.message }), 'application/json; charset=utf-8');
  }
}

function serveStatic(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(requestUrl.pathname);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.normalize(path.join(root, pathname));
  if (!filePath.startsWith(root)) {
    send(res, 403, 'Forbidden');
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, 'Not found');
      return;
    }
    const type = mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    send(res, 204, '');
    return;
  }
  if (req.method === 'POST' && req.url === '/api/upload-media') {
    handleUpload(req, res);
    return;
  }
  if (req.method === 'GET' || req.method === 'HEAD') {
    serveStatic(req, res);
    return;
  }
  send(res, 405, 'Method not allowed');
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Portfolio server running at http://localhost:${port}/`);
});
