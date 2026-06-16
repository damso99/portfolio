// 정적 파일을 제공하는 최소 개발 서버
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = process.env.PORT || 3000;
const rootDir = __dirname;

// 파일 확장자에 맞는 MIME 타입을 반환한다.
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

// 요청 URL을 실제 파일 경로로 매핑한다.
function resolveFilePath(requestUrl) {
  const rawUrl = requestUrl || '/';
  const pathname = rawUrl.split('?')[0].split('#')[0];
  const safeUrl = pathname === '/' ? '/index.html' : pathname;
  const normalizedPath = path.normalize(decodeURIComponent(safeUrl)).replace(/^(\.\.(\\|\/|$))+/, '');
  return path.join(rootDir, normalizedPath);
}

const server = http.createServer((req, res) => {
  try {
    const filePath = resolveFilePath(req.url || '/');
    const resolvedRoot = path.resolve(rootDir);
    const resolvedFilePath = path.resolve(filePath);

    // 루트 밖으로 나가는 요청은 차단한다.
    if (!resolvedFilePath.startsWith(resolvedRoot)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('접근이 허용되지 않습니다.');
      return;
    }

    fs.stat(resolvedFilePath, (statError, stats) => {
      if (statError || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('파일을 찾을 수 없습니다.');
        return;
      }

      res.writeHead(200, { 'Content-Type': getContentType(resolvedFilePath) });
      fs.createReadStream(resolvedFilePath).pipe(res);
    });
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('서버 오류가 발생했습니다.');
  }
});

server.listen(port, () => {
  console.log(`개발 서버가 실행 중입니다: http://localhost:${port}`);
});
