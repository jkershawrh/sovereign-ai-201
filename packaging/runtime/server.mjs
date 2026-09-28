import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, request as upstreamRequest } from 'node:http'
import { extname, join, normalize } from 'node:path'

const port = Number(process.env.PORT ?? 8080)
const root = '/app/dist'
const api = new URL(process.env.DEMO_API_URL ?? 'http://demo-api:9099')
const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.otf': 'font/otf', '.png': 'image/png', '.svg': 'image/svg+xml' }

function proxy(req, res) {
  const upstream = upstreamRequest({ hostname: api.hostname, port: api.port || 80, method: req.method, path: req.url, headers: req.headers }, (response) => {
    res.writeHead(response.statusCode ?? 502, response.headers)
    response.pipe(res)
  })
  upstream.on('error', () => { res.writeHead(502, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: 'demo-api unavailable' })) })
  req.pipe(upstream)
}

createServer((req, res) => {
  if (req.url === '/healthz') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end('{"status":"ok"}') }
  if (req.url?.startsWith('/api/')) return proxy(req, res)
  const requested = normalize(decodeURIComponent((req.url ?? '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '')
  let file = join(root, requested === '/' ? 'index.html' : requested)
  if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) file = join(root, 'index.html')
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': file.endsWith('index.html') ? 'no-cache' : 'public, max-age=86400' })
  createReadStream(file).pipe(res)
}).listen(port, '0.0.0.0')
