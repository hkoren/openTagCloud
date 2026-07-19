// Minimal static server for the layout smoke tests: serves the fixture page
// and the built @opentagcloud/core dist. No dependencies.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PORT || 5197);

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.map': 'application/json',
};

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let path = url.pathname === '/' ? '/e2e/fixture.html' : url.pathname;
  if (path.startsWith('/core/')) {
    path = '/packages/core/dist/' + path.slice('/core/'.length);
  }
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(port, () => console.log(`e2e server on http://localhost:${port}`));
