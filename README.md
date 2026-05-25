# Ogden Basic English 850 - Cloudflare Workers + D1 + KV

这是一个可部署到 Cloudflare Workers 的 Ogden Basic English 850 词学习站点。实现包含：

- Worker 静态资源托管和 JSON API
- D1 词表数据库
- KV 接口缓存和学习进度存储
- 无 D1/KV 绑定时的内置 850 词兜底数据
- 搜索、分类筛选、英音/美音/本机朗读、双击标记已学

## 重要说明

本项目是基于公开可见页面行为重写的 Cloudflare 版本；Ogden 850 基础词表为内置数据，D1 中的释义/例句可继续替换成你自己拥有授权的数据。

## 资料依据

- C.K. Ogden, *Basic English: A General Introduction with Rules and Grammar*, London: Paul Treber, 1930。
- Max Planck Institute publication record confirms the title, author, publication type, year, and public PDF record.
- Ogden Basic English grammar summaries were used to structure the in-app rules panel: 850 roots, 18 operators, plural rules, limited derivation, adverbs, comparison, negatives, questions, compounds, and technical-term explanation.

## 目录结构

```txt
ogden-cloudflare-worker/
├─ migrations/
│  ├─ 0001_schema.sql
│  ├─ 0002_seed_reset.sql
│  └─ 0003_seed_words_*.sql
├─ public/
│  ├─ index.html
│  ├─ styles.css
│  ├─ app.js
│  └─ _headers
├─ scripts/
│  └─ build-seed-sql.mjs
├─ src/
│  ├─ catalog.js
│  └─ index.js
├─ package.json
└─ wrangler.toml
```

## 本地运行

需要 Node.js 22 或更新版本。Wrangler 当前版本已不支持 Node 20。

```bash
npm install
npm run build:seed
npm run dev
```

如果尚未创建 D1/KV，Worker 会使用 `src/catalog.js` 的内置词表兜底，页面仍可打开。

没有安装 Wrangler 时，可以先用本地预览脚本查看页面和 fallback API：

```bash
npm run preview:local
```

## 创建 Cloudflare 资源

```bash
npx wrangler login
npx wrangler d1 create ogden_basic_english
npx wrangler kv namespace create KV
npx wrangler kv namespace create KV --preview
```

把命令输出的 `database_id`、`id`、`preview_id` 填入 `wrangler.toml`。

## 初始化 D1

```bash
npm run build:seed
npm run d1:migrate:local
npm run d1:seed:local
```

远程生产库：

```bash
npm run d1:migrate:remote
npm run d1:seed:remote
```

## 部署

```bash
npm run deploy
```

## GitHub Actions 自动 CI/CD

仓库已包含两条 workflow：

- `.github/workflows/ci.yml`：push、PR、手动触发时运行 `npm install`、`npm run check`、校验 seed SQL 是否已提交，并上传源码压缩包 artifact。
- `.github/workflows/deploy.yml`：push 到 `main`/`master` 或手动触发时，先检查、注入 Cloudflare 绑定 ID、执行 D1 migrations，再部署 Worker。

启用自动部署前，在 GitHub 仓库的 `Settings -> Secrets and variables -> Actions` 添加：

```txt
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_D1_DATABASE_ID
CLOUDFLARE_KV_NAMESPACE_ID
CLOUDFLARE_KV_PREVIEW_NAMESPACE_ID
```

`CLOUDFLARE_D1_DATABASE_ID` 必须是 D1 的 UUID 格式 `database_id`，不是数据库名 `ogden_basic_english`。可以从下面命令输出里复制：

```bash
npx wrangler d1 create ogden_basic_english
npx wrangler d1 list
```

`CLOUDFLARE_KV_PREVIEW_NAMESPACE_ID` 可选；未设置时 CI 会复用 `CLOUDFLARE_KV_NAMESPACE_ID`。
如果这些 secrets 未设置，部署 workflow 会只完成检查并跳过 Cloudflare 发布。

## API

- `GET /api/health`：绑定和服务健康检查
- `GET /api/meta`：分类和站点元信息
- `GET /api/words?cat=op&q=go&limit=1000`：词表搜索
- `GET /api/word/go`：单词详情
- `GET /api/progress`：读取学习进度
- `PUT /api/progress`：保存学习进度，body 为 `{ "learned": ["go"] }`

## 数据更新

编辑 `src/catalog.js` 后运行：

```bash
npm run build:seed
```

然后重新执行对应的 D1 migration 命令即可。seed 会拆分成多个小 migration 文件，避免 Cloudflare D1 远程执行时触发 `SQLITE_TOOBIG`。
