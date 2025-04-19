// mock-websocket-server.js
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const express = require('express');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

// 保存所有连接的 WebSocket 客户端
const clients = new Set();
const PORT = 8080;

// —— 1. 启动 LiveReload 服务器，监视 public 目录 ——
const lrServer = livereload.createServer();
lrServer.watch(path.join(__dirname, 'public'));

// —— 2. 创建 Express 应用，并注入 LiveReload 脚本 ——
const app = express();
app.use(connectLivereload());

// —— 3. JSON 解析中间件 ——
app.use(express.json());

// —— 4. POST /push：接收 JSON，广播给所有 WS 客户端 ——
app.post('/push', (req, res) => {
	const data = req.body;
	const message = JSON.stringify({
		type: 'manual_push',
		payload: data,
		timestamp: new Date().toISOString()
	});

	clients.forEach(ws => {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(message);
		}
	});

	res.json({ success: true });
});

// —— 5. 静态文件服务：将 public 中的 index.html、脚本、样式都托管 ——
app.use(express.static(path.join(__dirname, 'public')));

// —— 6. 创建 HTTP + Express Server ——
const server = http.createServer(app);

// —— 7. WebSocket Server（noServer 模式） ——
const wss = new WebSocket.Server({ noServer: true });

// 处理 HTTP 升级到 WebSocket
server.on('upgrade', (req, socket, head) => {
	const { pathname, query } = url.parse(req.url, true);
	const token = query.token;

	if (pathname === '/ws' && token) {
		console.log('🆗 WS upgrade, token =', token);
		wss.handleUpgrade(req, socket, head, ws => {
			wss.emit('connection', ws, token);
		});
	} else {
		socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
		socket.destroy();
	}
});

// WebSocket 连接建立后
wss.on('connection', (ws, token) => {
	console.log('🔗 WS client connected, token =', token);
	clients.add(ws);

	ws.on('message', msg => {
		console.log('📨 Received WS message:', msg);
	});

	ws.on('close', () => {
		console.log('❌ WS client disconnected');
		clients.delete(ws);
	});
});

// —— 8. 启动服务 ——
server.listen(PORT, () => {
	console.log(`✅ HTTP + LiveReload listening on http://localhost:${PORT}/`);
	console.log(`✅ WebSocket server on ws://localhost:${PORT}/ws?token=YOUR_TOKEN`);
	console.log(`✅ POST to http://localhost:${PORT}/push`);
});
