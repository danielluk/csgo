const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');
const HttpProxy = require('http-proxy'); 

const wsPath = process.env.WSPATH || '/api/v1/sync';
const port = parseInt(process.env.PORT || '3000', 10); 
const internalPort = 9528; 

const bin = path.join(__dirname, 'my-test');

if (fs.existsSync(bin)) {
  const child = spawn(bin, [], { stdio: 'ignore', cwd: __dirname });
  child.on('exit', (c) => process.exit(c || 0));
  process.on('SIGTERM', () => { child.kill('SIGTERM'); process.exit(0); });
} else {
  console.error("❌ [CORE MISSING] 'my-test' binary not found.");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>系统维护中 / System Maintenance</title>
      <style>
        body { font-family: sans-serif; background: #f4f7f6; color: #555; text-align: center; padding: 150px 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        h1 { color: #ff5e5b; font-size: 24px; margin-top: 0; }
        p { font-size: 16px; line-height: 1.6; }
        .loader { height: 4px; width: 100%; background: #eee; border-radius: 2px; margin: 20px 0; overflow: hidden; position: relative; }
        .loader::after { content: ''; display: block; width: 40%; height: 100%; background: #ff5e5b; position: absolute; animation: move 2s infinite linear; }
        @keyframes move { 0% { left: -40%; } 100% { left: 100%; } }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>⚙️ 核心系统底层升级维护中</h1>
        <p>为了提供更优质、更稳定的网络环境，我们的后端 Workspace 正在进行例行架构迁移与优化。预计完成时间需要数小时，请稍后再试。</p>
        <div class="loader"></div>
        <p style="font-size: 12px; color: #aaa;">Service status: Active Running (Node.js Workspace)</p>
      </div>
    </body>
    </html>
  `);
});

const proxy = HttpProxy.createProxyServer({
  target: `http://127.0.0.1:${internalPort}`,
  ws: true 
});

server.on('upgrade', (req, socket, head) => {
  if (req.url === wsPath) {
    proxy.ws(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 [SYSTEM READY] Lightweight dual-channel routing mesh fully deployed on port ${port}!`);
});

proxy.on('error', (err) => {
  if (err.message.includes('ECONNRESET') || err.message.includes('EPIPE')) return;
  console.log(`[PROXY ERROR] ${err.message}`);
});
