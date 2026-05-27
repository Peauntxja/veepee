# Veepee 本地演示 — 操作指南

本文档面向**演示与验收**场景，说明如何启动项目、登录、浏览核心页面并完成购物流程。  
项目为 [veepee.fr](https://www.veepee.fr/) 的前端离线复刻，**无真实后端**，数据来自本地 Mock 与 API 快照。

---

## 在线演示（Vercel）

| 项目 | 内容 |
|------|------|
| **访问地址** | [https://veepee-seven.vercel.app/](https://veepee-seven.vercel.app/) |
| **首页** | [https://veepee-seven.vercel.app/gr/home](https://veepee-seven.vercel.app/gr/home) |
| **登录页** | [https://veepee-seven.vercel.app/gr/authentication](https://veepee-seven.vercel.app/gr/authentication) |
| **演示邮箱** | `demo@veepee.fr` |
| **演示密码** | `demo123` |

打开链接即可体验，无需本地安装。登录后可浏览全部促销、加购与购物车流程。

---

## 1. 快速开始

### 环境要求

| 项目 | 要求 |
|------|------|
| Node.js | **18.18+**（推荐 **24**，仓库含 `.nvmrc`） |
| 包管理 | npm |
| 网络 | 演示本身**可完全离线**（图片已本地化） |

### 安装与启动

```bash
# 克隆仓库后
npm install
npm run dev
```

浏览器访问：**http://localhost:3000**  
根路径会自动跳转到 **`/gr/home`**（与官网 `/gr/*` 路由前缀一致）。

### 生产构建（可选）

```bash
npm run build
npm run start
```

---

## 2. 演示账号

| 用途 | 邮箱 | 密码 |
|------|------|------|
| 预设演示账号 | `demo@veepee.fr` | `demo123` |

- 登录页：`/gr/authentication`
- 注册页：`/gr/registration`（任意合法邮箱 + 至少 6 位密码，数据存于浏览器 `localStorage`）
- 退出：左上角 **Menu** 侧栏 → **Déconnexion**

> **说明**：登录态与购物车均持久化在浏览器本地，清除站点数据或换浏览器需重新登录。

---

## 3. 页面一览

| 路由 | 说明 | 登录要求 |
|------|------|----------|
| `/gr/home` | 首页 — 丛林 Hero、当日促销卡片 | 否（访客仅部分可见） |
| `/gr/authentication` | 登录 | 否 |
| `/gr/registration` | 注册 | 否 |
| `/gr/h/{category}` | 分类 Hub（Mode、Maison、Vin…） | 否 |
| `/gr/catalog/{operationId}/{catalogId}` | Sale Room — 品牌专场商品列表 | 否 |
| `/gr/p/{category}/{slug}` | 商品列表 PLP（筛选 / 分页） | 否 |
| `/gr/p/{category}/{slug}/{id}` | 商品详情 PDP | 否 |
| `/gr/search?q=…` | 搜索结果 | 否 |
| `/gr/cart` | 购物车 | **是**（访客见 404 风格提示） |
| `/gr/my-account` | 我的账户 | 是 |
| `/gr/my-orders` | 我的订单 | 是 |
| `/gr/favourites` | 收藏品牌 | 是 |
| `/gr/notifications` | 通知 | 是 |
| `/gr/parrainage` | 推荐好友 | 是 |
| `/gr/preferences` | 通信偏好 | 是 |
| `/gr/le-club` | Le Club | 是 |

### 分类导航（顶栏 Pill）

Accueil · Mode · Voyage · Maison · Enfant · Chaussures · Beauté · Sport · Vin et Epicerie · Loisir · Rosedeals · The Place

示例 Hub 地址：

- Mode → `/gr/h/mode`
- Maison → `/gr/h/maison`
- Vin → `/gr/h/vin`

---

## 4. 推荐演示流程（约 10 分钟）

### 场景 A：访客 → 引导注册

1. 打开 **`/gr/home`**（未登录）
2. 观察丛林 Hero 头：Menu / Logo / 搜索 / 分类 Pill
3. 向下滚动：Hero 头消失，切换为**白底紧凑头**（对齐官网下滑行为）
4. 首页仅展示**少量**促销卡片，其余**模糊 + 引导登录**
5. 点击模糊卡片或底部 **S'identifier** → 跳转登录

### 场景 B：会员首页浏览

1. 使用 **`demo@veepee.fr` / `demo123`** 登录
2. 返回 **`/gr/home`** — 全部促销卡片可见
3. 底部浮动筛选条：**Toutes les ventes / Nouveautés / Derniers jours / Prochainement**
4. 点击任意促销 Banner → 进入对应 Hub 或 Sale Room

### 场景 C：Sale Room 加购（重点）

1. 直接访问 Tommy Hilfiger 专场（离线快照数据）：

   **`/gr/catalog/903484/24707502`**

2. 页面包含：品牌 Banner、左侧分类侧栏、排序、商品网格
3. 点击商品 **Achat express** → 弹出尺码选择
4. 确认尺码 → 商品加入购物车，右上角出现 **mini-panier** 弹层
5. 观察 Header 购物车：**粉色边框 + 15 分钟倒计时 + 数量角标**

### 场景 D：Hub → PLP → PDP

1. 进入 **`/gr/h/maison`**
2. 浏览多个区块：ventes / catalogue / The Place 等
3. 打开 PLP 示例：**`/gr/p/maison/mobilier-123`**
4. 使用左侧筛选、分页
5. 进入商品详情 → **Ajouter au panier**

### 场景 E：搜索

1. 点击顶栏搜索框，输入 **`GEOX`** 或 **`Dyson`**
2. 回车或提交 → **`/gr/search?q=…`**
3. 结果包含品牌促销与商品链接

### 场景 F：购物车与结算

1. 确保已登录，访问 **`/gr/cart`**
2. 按品牌分组展示，可修改数量、删除
3. 满 **40 €** 促销提示（Tommy 专场同款逻辑）
4. 点击结算 → **模拟成功弹窗**，购物车清空

### 场景 G：账户侧栏

1. 点击左上角 **Menu**
2. 导航：Mon compte / Mes commandes / Marques favorites / Le Club 等
3. 演示完成后 **Déconnexion** 退出

---

## 5. 界面行为说明

### 首页 Header 两种形态

| 状态 | 表现 |
|------|------|
| 页面顶部 | 透明 **Hero Header**（白字 Logo、独立搜索行、半透明分类 Pill） |
| 向下滚动后 | 切换为 **Standard Header**（白底、搜索与 Menu 同行、固定顶部） |

内页（Hub、Sale Room、购物车等）始终使用 **Standard Header**。

### 购物车规则（演示）

- 加购后启动 **15 分钟** 商品预留倒计时（Header 与购物车页同步显示）
- 购物车数据持久化于 `localStorage`（键名 `veepee-cart`）
- 无真实支付，结算仅为前端模拟

### 访客限制

| 功能 | 访客 | 登录用户 |
|------|------|----------|
| 首页全部促销 | 部分可见 | 全部可见 |
| 购物车页 | 404 风格拦截 | 正常 |
| 通知 / 推荐 | Header 不显示 | 显示 |

---

## 6. 数据与离线资源

演示数据主要位于：

```
data/api-snapshots/     # 首页、分类 Hub、Sale Room 等 JSON 快照
public/assets/images/   # 本地化图片（约 40MB）
src/lib/mock/           # TypeScript Mock 与映射逻辑
```

- 运行时**不依赖** veepee.fr CDN
- 图片缺失时自动回退至 `/mock/image` 占位 SVG

---

## 7. 常见问题

### 启动报错 `Unexpected token '??='`

Node 版本过低（常见于 Node 14）。请切换到 Node 24：

```bash
fnm use 24   # 或 nvm use
npm run dev
```

### 端口 3000 被占用

```bash
# 查看占用进程并结束，或 Next 会自动使用 3001
lsof -i :3000
```

### 登录后仍像访客

清除浏览器该站点的 `localStorage`，或用无痕窗口重新登录 `demo@veepee.fr`。

### 购物车角标不更新

刷新页面；若仍异常，清除 `localStorage` 中的 `veepee-cart` 与 `veepee-auth`。

### 图片加载慢

首次访问需加载本地静态资源；生产环境建议 `npm run build && npm run start`。

---

## 8. 开发者参考（可选）

如需更新快照数据或重新抓取官网内容：

```bash
npm run crawl:full -- --pages vin,loisir   # 抓取指定分类
npm run crawl:import -- data/api-snapshots/raw/crawl-live-YYYY-MM-DD.json
npm run crawl:sale-room -- --headed --login # 需登录态抓取 Sale Room
npm run assets:download                     # 重新下载图片资源
npm run lint && npm run build               # 提交前验证
```

详细脚本说明见根目录 **`README.md`**。

---

## 9. 仓库信息

- GitHub：`https://github.com/Peauntxja/veepee.git`
- 技术栈：Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Zustand

---

**演示检查清单**

- [ ] 在线演示 [veepee-seven.vercel.app](https://veepee-seven.vercel.app/gr/home) 可访问
- [ ] `demo@veepee.fr` / `demo123` 登录成功
- [ ] `npm run dev` 正常启动（本地验收时）
- [ ] 访客首页可见 Hero + 模糊墙
- [ ] 下滑后 Header 切换为白底
- [ ] Sale Room 加购 + 倒计时
- [ ] 购物车结算模拟成功
- [ ] Menu 侧栏账户页可访问
