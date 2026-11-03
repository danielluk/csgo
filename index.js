const http = require('http');
const net = require('net');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, execSync } = require('child_process');
const HttpProxy = require('http-proxy'); 

const csgoPath = process.env.PATHONE || process.env.API_ONE || '/future/v2/csgo';
const port = parseInt(process.env.PORT || '3000', 10);
const testPort = 9528;

if (!csgoPath) {
    console.error('❌ [CONFIG ERROR] PATH is required for opening the gateway!');
    process.exit(1);
}

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
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Scheduled Maintenance</title>
  <style>
    :root {
      --bg-color: #0b0f19;
      --card-bg: rgba(255, 255, 255, 0.03);
      --border-color: rgba(255, 255, 255, 0.08);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --accent-color: #6366f1;
      --accent-glow: rgba(99, 102, 241, 0.15);
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 24px;
      box-sizing: border-box;
      overflow: hidden;
    }

    body::before {
      content: '';
      position: absolute;
      width: 400px;
      height: 400px;
      background: var(--accent-glow);
      filter: blur(120px);
      border-radius: 50%;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 0;
      pointer-events: none;
    }

    .container {
      position: relative;
      z-index: 1;
      max-width: 520px;
      width: 100%;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: 48px;
      border-radius: 20px;
      border: 1px solid var(--border-color);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      text-align: center;
    }

    .icon-wrapper {
      margin-bottom: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 16px;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .icon-wrapper svg {
      width: 32px;
      height: 32px;
      fill: var(--accent-color);
    }

    h1 {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin: 0 0 14px 0;
      color: var(--text-main);
    }

    p {
      font-size: 15px;
      line-height: 1.6;
      color: var(--text-muted);
      margin: 0 0 32px 0;
    }

    .loader-container {
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      margin-bottom: 32px;
      overflow: hidden;
      position: relative;
    }

    .loader-bar {
      height: 100%;
      width: 30%;
      background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
      position: absolute;
      animation: pulse 2.5s infinite ease-in-out;
    }

    @keyframes pulse {
      0% { left: -30%; }
      100% { left: 100%; }
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #10b981;
      background: rgba(16, 185, 129, 0.06);
      padding: 6px 14px;
      border-radius: 30px;
      border: 1px solid rgba(16, 185, 129, 0.15);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="icon-wrapper">
      <svg viewBox="0 0 24 24">
        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
      </svg>
    </div>

    <h1>System Under Maintenance</h1>
    <p>We are upgrading our core workspace architecture to provide a more powerful and secure network environment. This regular optimization will take a few hours. Thank you for your patience.</p>
    
    <div class="loader-container">
      <div class="loader-bar"></div>
    </div>

    <div class="status-badge">
      <span class="status-dot"></span>
      Workspace Active
    </div>
  </div>

</body>
</html>
  `);
});

const proxy = HttpProxy.createProxyServer({
  target: `http://127.0.0.1:${testPort}`,
  ws: true
});

server.on('upgrade', (req, socket, head) => {
  if (req.url === csgoPath) {
    proxy.ws(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 [SYSTEM READY] Original Core with Maintenance WebPage fully operational on port ${port}!`);
});

proxy.on('error', (err) => {
  if (err.message.includes('ECONNRESET') || err.message.includes('EPIPE')) return;
  console.log(`[PROXY ERROR] ${err.message}`);
});
