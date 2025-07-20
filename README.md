# WebSocket & SSE Mock Server

一个用于本地前端 WebSocket/SSE 联调的轻量级调试工具。支持 WebSocket、Server-Sent Events (SSE) 实时消息推送、HTTP 广播接口以及页面实时热更新，助力前端开发高效调试和联调后端实时推送功能。

---

## 项目特色

- **WebSocket 支持**：内置 WS 服务器，支持多客户端连接、消息广播、客户端互测。
- **Server-Sent Events (SSE) 支持**：支持 SSE 单向事件推送，前端可实时接收服务端推送消息。
- **HTTP 广播接口**：通过 `/push` 或 `/sse-push` POST 接口，将数据广播给所有 WS/SSE 客户端。
- **热更新开发体验**：集成 [livereload](https://github.com/livereload/livereload-js)，前端静态页面修改自动刷新。
- **前端控制台 Demo**：自带可视化控制台，方便手动发送消息、查看日志、测试 WS/SSE 连接。
- **零依赖部署**：仅需 Node.js 环境，无需额外配置。

---

## 安装与运行

### 1. 克隆项目并安装依赖

```bash
git clone https://github.com/cbtpro/ws-mock-server.git
cd ws-mock-server
npm install
```

### 2. 启动开发环境（热更新）

```bash
npm run dev
```

### 3. 启动生产环境

```bash
npm start
```

### 4. 访问前端控制台页面

浏览器打开 [http://localhost:8080](http://localhost:8080)，即可体验 WebSocket 和 SSE 功能。

---

## 功能说明

### 1. WebSocket

- 服务端监听 `/ws`，支持多客户端连接。
- 客户端可通过页面控制台或自定义脚本连接：  
  `ws://localhost:8080/ws?token=xxx`
- 支持消息广播 (`/push`)、客户端自发消息、实时日志。

### 2. Server-Sent Events (SSE)

- 服务端监听 `/sse`，浏览器通过 `EventSource` 建立连接。
- 支持服务端单向推送、客户端断线自动重连。
- 可通过 `/sse-push` POST 广播消息。

### 3. HTTP 广播接口

- 使用 `/push` POST 广播数据到所有 WS/SSE 客户端。
- 支持 JSON 格式，前端页面自带输入框和日志。

---

## 主要接口示例

### WebSocket 客户端连接

```js
const ws = new WebSocket('ws://localhost:8080/ws?token=yourtoken');
ws.onmessage = e => console.log(e.data);
ws.send(JSON.stringify({ type: 'test', content: 'Hello Server' }));
```

### SSE 客户端连接

```js
const sse = new EventSource('http://localhost:8080/sse');
sse.onmessage = e => console.log(e.data);
```

### HTTP 广播（POST）

```bash
curl -X POST http://localhost:8080/push \
  -H "Content-Type: application/json" \
  -d '{"message": "hello from curl"}'
```

---

## 技术栈 & 知识点

- **Node.js + Express**：高效处理 HTTP 与静态资源。
- **WebSocket**：实现多客户端实时双向通讯。
- **SSE (Server-Sent Events)**：服务端单向事件推送，低延迟、自动重连。
- **livereload/connect-livereload**：前端热更新，提升开发效率。
- **模块化设计**：WS/SSE、广播接口独立模块，易扩展。
- **安全性**：仅本地调试，生产建议增加鉴权。

---

## 注意事项

- 本工具仅用于本地开发及联调，不建议直接用于生产环境。
- WebSocket/SSE 广播为无鉴权开放接口，生产环境需加安全校验。
- 推荐 Node.js 18+，依赖 express@5。
- 如果端口冲突可在 `src/main.js` 中修改 `PORT`。

---

## 英文说明

### English Introduction

**WebSocket & SSE Mock Server** is a lightweight local tool for debugging and developing real-time front-end features. It supports WebSocket and Server-Sent Events, HTTP broadcast, and live-reload, making it perfect for front-end and back-end integration testing.

**Features:**
- Real-time WebSocket server and broadcast
- SSE one-way push, easy to test EventSource features
- HTTP API for message broadcasting
- Live-reload for static pages
- Visual control panel for manual testing

**Quick Start:**
1. `git clone https://github.com/cbtpro/ws-mock-server.git && cd ws-mock-server`
2. `npm install`
3. `npm run dev`
4. Open [http://localhost:8080](http://localhost:8080) in your browser

**Notice:**  
This tool is for local development only. Security/authentication should be added for production use.

---

## 贡献

欢迎提交 Issue 或 PR，帮助完善功能和文档！

## License

[ISC License](https://opensource.org/licenses/ISC)
