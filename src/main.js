const path = require('path');
const http = require('http');
const express = require('express');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

// 创建 LiveReload
const lrServer = livereload.createServer();
lrServer.watch(path.join(__dirname, 'public'));

// Express 应用
const app = express();
app.use(connectLivereload());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const server = http.createServer(app);

// 模块注入
const { setupWebSocket } = require('./ws-server');
const { setupSSE } = require('./sse-server');

setupWebSocket(server);
setupSSE(app); // SSE 不需要 httpServer，只需绑定路由

// POST 广播接口（广播给 WS 和 SSE）
const { broadcastWS } = require('./ws-server');
const { broadcastSSE } = require('./sse-server');

app.post('/push', (req, res) => {
	const data = {
		type: 'manual_push',
		payload: req.body,
		timestamp: new Date().toISOString()
	};
	broadcastWS(data);
	broadcastSSE(data);
	res.json({ success: true });
});

// 启动
const PORT = 8080;
server.listen(PORT, () => {
	console.log(`✅ Server running at http://localhost:${PORT}`);
	console.log(`✅ WebSocket: ws://localhost:${PORT}/ws?token=xxx`);
	console.log(`✅ SSE: http://localhost:${PORT}/sse`);
});
