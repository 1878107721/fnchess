# fnchess

函数棋前端可以直接部署到 GitHub Pages。仓库当前的联机方案基于 `PeerJS + WebRTC DataChannel`：

- 页面本身可以放在 `github.io`
- 双方走子的实时数据直接在浏览器之间传输
- 仍然需要一个“信令服务”帮助双方先找到彼此

## 现在这版联机的实际边界

### 1. GitHub Pages 能不能做在线联机

可以，但只能做“静态前端 + 外部信令服务”的联机。

GitHub Pages 不能跑你仓库里的 `server/index.js`，因为它不提供 Node.js 常驻服务。也就是说：

- `github.io` 可以托管页面
- 不能直接托管 PeerJS 信令服务器

所以联机有两种部署方式：

1. 直接用默认公共 PeerJS 服务器
2. 自己把 `server/` 部署到一台公网服务器，再让 GitHub Pages 前端连过去

当前代码默认使用公共 PeerJS 服务器，可以直接先跑起来验证体验。

## 2. 联机数据能不能存在浏览器里面

可以存一部分，但不能替代在线同步。

浏览器本地存储适合保存：

- 最近输入过的房间码
- 本机偏好设置
- 本机游戏记录
- 断线后本地快照

浏览器本地存储不适合承担：

- 两个人之间的实时同步
- 跨设备共享房间状态
- 云端房间列表
- 玩家离线后由服务器继续保管对局

原因很简单：`localStorage / IndexedDB` 只在当前设备、当前浏览器里有效，对手看不到。

## GitHub Pages 发布方法

把仓库发布到 GitHub Pages，入口就是根目录的 `index.html`。

常见做法：

1. 推送到 GitHub 仓库
2. 在仓库 `Settings -> Pages` 里启用 Pages
3. 选择从默认分支根目录发布

发布后地址一般类似：

```text
https://<你的用户名>.github.io/fnchess/
```

## 如需改用你自己的信令服务

前端支持在页面加载前覆盖配置：

```html
<script>
window.FNCHESS_CONFIG = {
  p2pSignaling: {
    host: 'your-signal.example.com',
    port: 443,
    path: '/',
    secure: true,
    debug: 0
  }
};
</script>
```

这段配置已经在 `index.html` 里预留好了，默认值是公共 PeerJS 服务。

## 本地信令服务启动

如果你要自托管：

```bash
cd server
npm install
npm start
```

然后把前端配置改成你的服务地址。

## 这次我补的内容

- 保留 `github.io` 可直接使用的联机前端
- 增加了统一前端联机配置入口 `window.FNCHESS_CONFIG`
- 增加“最近房间码”本地保存，便于重复加入房间
- 增加邀请链接复制与 `?room=房间码` 自动加入支持
- 明确区分“浏览器本地存储”和“在线联机同步”的职责

## 推荐方案

如果你的目标是“先能上线给别人玩”，建议这样做：

1. 前端发布到 GitHub Pages
2. 先用默认公共 PeerJS 服务验证玩法
3. 稳定后再把 `server/` 部署到你自己的域名

如果你的目标是“房间永久存在、掉线可恢复、可观战、可查战绩”，那就不是纯 P2P 方案了，需要真正的后端房间服务。
