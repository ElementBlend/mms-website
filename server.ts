import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import fs from 'fs';
import https from 'https';
// import { createProxyMiddleware } from 'http-proxy-middleware';
// import { environment } from './src/environments/environment';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const commonEngine = new CommonEngine();
  // const backendDomain = environment.backendDomain;
  // const backendPort = environment.backendPort;

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // server.use('/api/', createProxyMiddleware({
  //   target: `https://${backendDomain}:${backendPort}`
  // }));

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }]
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });
  return server;
}

function run(): void {
  const address = process.env['ADDRESS'] || "localhost";
  const port = process.env['PORT'] || 4200;
  const serverOptions = {
    key: fs.readFileSync("./ssl/server.key"),
    cert: fs.readFileSync("./ssl/server.crt"),
    ca: fs.readFileSync("./ssl/combined.crt")
  };
  const server = https.createServer(serverOptions, app());
  server.listen(port, () => {
    console.log(`Node Express server listening on https://${address}:${port}`);
  });
}

run();
