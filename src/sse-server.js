const express = require('express');

const clients = [];

function setupSSE(app) {
  app.get('/sse', (req, res) => {
    console.log('🔗 SSE client connected');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.push(res);

    res.write(`event: connected\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);

    req.on('close', () => {
      console.log('❌ SSE client disconnected');
      const index = clients.indexOf(res);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });
  });
  // 新增一个 POST /sse-push 接口，用于广播消息
  app.post('/sse-push', express.json(), (req, res) => {
    const data = req.body || {};
    const payload = {
      type: 'sse_push',
      timestamp: new Date().toISOString(),
      payload: data,
    };

    const text = `data: ${JSON.stringify(payload)}\n\n`;
    clients.forEach(client => client.write(text));

    console.log('📢 SSE 广播消息：', payload);
    res.json({ success: true });
  });
}

function broadcastSSE(data) {
  const text = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(client => client.write(text));
  console.log('📢 SSE broadcastSSE:', data);
}

module.exports = {
  setupSSE,
  broadcastSSE
};
