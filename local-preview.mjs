import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const relative = normalize(pathname).replace(/^[/\\]+/, '');
    if (relative.startsWith('..')) throw new Error('Invalid path');
    const file = join(root, relative);
    const content = await readFile(file);
    const extension = file.slice(file.lastIndexOf('.'));
    response.writeHead(200, { 'content-type': mime[extension] || 'application/octet-stream' });
    response.end(content);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Página não encontrada');
  }
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173/'));
