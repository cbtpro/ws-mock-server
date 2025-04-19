# WebSocket Mock Server

用来对前端 WebSocket 代码进行联调的小工具。该项目实现了一个 WebSocket 服务器，支持通过 HTTP POST 请求广播消息到所有 WebSocket 客户端，同时提供一个 WebSocket 连接，供前端进行调试。

## 功能

- 启动一个 WebSocket 服务，允许前端客户端进行连接。
- 通过 HTTP POST 接口手动推送消息到 WebSocket 客户端。
- 支持浏览器的实时页面更新 (LiveReload)，方便前端开发时查看修改效果。
- 使用 Express 作为 HTTP 服务器，提供静态文件服务以及 WebSocket 支持。

## 安装与运行

### 1. 克隆项目并安装依赖

```bash
git clone git@github.com:cbtpro/ws-mock-server.git
cd ws-mock-server
npm install
```

### 2. 启动开发环境

使用 `nodemon` 进行热更新，运行以下命令：

```bash
npm run dev
```

这将启动 WebSocket 服务器，并通过热更新自动重载服务器。

### 3. 启动生产环境

如果你不需要热更新，可以直接运行：

```bash
npm start
```

此命令会启动 WebSocket 服务器，监听 WebSocket 和 HTTP 请求。

### 4. 访问 WebSocket 控制台

1. 打开浏览器访问 `http://localhost:8080`。
2. 在控制台中，你可以通过输入 JSON 格式的消息，并点击 "发送消息" 按钮，通过 POST 请求将消息广播到所有 WebSocket 客户端。

## 主要功能

### 1. POST 消息推送

你可以通过 `POST /push` 接口向 WebSocket 客户端发送自定义消息。例如：

```json
{
	"message": "hello from web console",
	"source": "web-ui"
}
```

这会将消息广播到所有已连接的 WebSocket 客户端。

### 2. WebSocket 客户端接收消息

WebSocket 客户端会接收来自服务器的消息并打印到控制台。你可以通过页面上的 WebSocket 控制台查看接收到的消息。

### 3. 热更新

通过 `livereload` 和 `connect-livereload` 实现了页面的实时更新。当你修改前端页面时，页面会自动刷新，无需手动刷新。

## 脚本命令

- `npm run dev`: 启动开发环境，支持热更新 (通过 `nodemon` 启动服务器)。
- `npm start`: 启动生产环境（没有热更新）。

## 技术栈

- **WebSocket**：实现实时双向通信。
- **Express**：用于处理 HTTP 请求和静态文件服务。
- **Livereload**：实现页面实时更新。
- **Nodemon**：支持开发环境下的自动重启。

## 贡献

欢迎贡献代码！如果你有建议或问题，请创建一个 issue，或者直接提交 pull request。

## License

[ISC License](https://opensource.org/licenses/ISC)
````
