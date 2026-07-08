/**
 * 函数棋 P2P 信令服务器
 * 基于 PeerJS Server，用于本地/局域网对战联机
 *
 * 启动方式：
 *   cd server && npm install && npm start
 *
 * 玩家A（房主）和玩家B（访客）都连接此服务器即可跨浏览器对战。
 * 若需跨互联网对战，请将本服务部署到公网服务器，并修改
 * files/js/P2PController.js 中 P2PController.signaling 的 host。
 */
const { PeerServer } = require('peer');

const PORT = process.env.P2P_PORT || 9000;
const HOST = process.env.P2P_HOST || '0.0.0.0';

const server = PeerServer({
    port: Number(PORT),
    host: HOST,
    path: '/',
    // 允许任意 API key（前端默认使用 'peerjs'）
    allow_discovery: true,
    proxied: false
});

server.on('connection', (client) => {
    console.log(`[P2P] 客户端已连接: ${client.getId()}`);
});

server.on('disconnect', (client) => {
    console.log(`[P2P] 客户端已断开: ${client.getId()}`);
});

console.log(`✅ 函数棋 P2P 信令服务器已启动: http://localhost:${PORT}`);
console.log(`   前端配置: files/js/P2PController.js → P2PController.signaling`);
