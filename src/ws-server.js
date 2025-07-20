const WebSocket = require('ws');
const url = require('url');

const clients = new Set();

let wss = null;

function setupWebSocket(server) {
	wss = new WebSocket.Server({ noServer: true });

	server.on('upgrade', (req, socket, head) => {
		const { pathname, query } = url.parse(req.url, true);
		if (pathname === '/ws' && query.token) {
			console.log('🆗 WS upgrade, token =', query.token);
			wss.handleUpgrade(req, socket, head, ws => {
				wss.emit('connection', ws, query.token);
			});
		} else {
			socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
			socket.destroy();
		}
	});

	wss.on('connection', (ws, token) => {
		console.log('🔗 WS client connected:', token);
		clients.add(ws);

		ws.on('message', msg => {
			console.log('📨 WS message:', msg);
		});
		ws.on('close', () => {
			console.log('❌ WS client disconnected');
			clients.delete(ws);
		});
	});
}

function broadcastWS(data) {
	const message = JSON.stringify(data);
	for (const client of clients) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	}
}

module.exports = {
	setupWebSocket,
	broadcastWS
};
