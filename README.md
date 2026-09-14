# Zayra APIs 🚀

Social media API reseller hub — coins system, Sri Lankan LKR price list, multi-user accounts (username + password), per-user API keys, and an admin panel that sends coins by username. **Vercel eke host karanna puluwan.**

## ✨ Features

- 🔐 **Multi-user auth** — username + password eken signup/login (okkoma user lata wage password ekak)
- 🪙 **Coin system** — 1 coin = LKR 1.00, order dapu gaman coins cut wenawa
- 🔑 **Per-user API key** — sign up karama auto-generate wenawa
- 💰 **LKR price list** — Facebook, Instagram, TikTok, YouTube, X, Telegram (site eke table eka + API eken)
- ⚙️ **Admin panel** — admin kenek username eka dunama coins send karanna puluwan (+/-)
- 📡 **Reseller API (`/api/v1`)** — `list`, `balance`, `add`, `status` actions
- 🔒 Provider API keys okkoma **environment variables** walin — code eke hardcoded nathi lada

## 🏃 Local eke Run Karanna

```bash
npm install
npm run db:push        # SQLite database eka hadanna
npm run seed           # admin user hadanna (admin / Admin@1234)
npm run dev            # http://localhost:3000
```

`.env` file eka already tiyanawa (SQLite). `ADMIN_PASSWORD` eka `.env` eke change karanna.

## 🚀 Vercel Deploy Karanna (GitHub eken)

> ⚠️ **Wadagath**: Vercel eke filesystem eka read-only nisa SQLite wada karanne NA.
> Deploy karanna kalin **free PostgreSQL** ekak ganna: [neon.tech](https://neon.tech) (signup → project → connection string eka copy karanna).

### Step 1 — GitHub ekata push karanna

```bash
cd zayra-apis
git init
git add .
git commit -m "Zayra APIs initial"
# github.com eke repo ekak hadala (e.g. zayra-apis), passe:
git remote add origin https://github.com/YOUR-USERNAME/zayra-apis.git
git push -u origin main
```

### Step 2 — Vercel eke project ekak hadanna

1. [vercel.com](https://vercel.com) ekata GitHub eken log wenna
2. **Add New → Project** → `zayra-apis` repo eka import karanna
3. **Deploy karanna kalin** me env variables add karanna (**Settings → Environment Variables**):

| Key | Value |
|---|---|
| `DATABASE_URL` | Neon connection string eka (`postgresql://...?sslmode=require`) |
| `JWT_SECRET` | randama loku string ekak (e.g. `zayra-super-secret-8f2k...`) |
| `ADMIN_USERNAME` | oyage admin username eka (e.g. `zayraadmin`) |
| `ADMIN_PASSWORD` | oyage admin password eka (loku ekak) |
| `PROVIDER_API_URL` | SMM/API provider ge endpoint eka (nathnam demo mode) |
| `PROVIDER_API_KEY` | provider API key eka |

### Step 3 — PostgreSQL schema eka maru karanna

Local eke SQLite use wenne witharai. Deploy karanna kalin:

```bash
# 1. schema eka postgres version ekata maru karanna
cp prisma/schema.postgres.prisma prisma/schema.prisma

# 2. Neon database ekata tables hadanna (local eken run karanna)
npx prisma db push

# 3. Admin user eka hadanna (DATABASE_URL eka .env eke Neon string ekata maru karala)
npm run seed

# 4. GitHub ekata push karanna
git add . && git commit -m "postgres schema" && git push
```

4. Vercel eke **Deploy** click karanna. ✅ Done!

### Step 4 — Admin panel eka use karanna

1. `https://your-site.vercel.app/login` ekata gihin admin username + password eken log wenna
2. Auto `/admin` panel ekata yanna — **Coins Send Karanna** section eken username eka + coin gana dala send karanna
3. Users list eka + total coins stats okkoma panel eke pennanawa

## 📡 API Usage

```bash
# Price list ganna
curl -X POST https://your-site.vercel.app/api/v1 \
  -H "x-api-key: zayra_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{"action":"list"}'

# Order ekak danna
curl -X POST https://your-site.vercel.app/api/v1 \
  -H "x-api-key: zayra_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{"action":"add","service":"ig-followers","quantity":1000,"link":"https://instagram.com/user"}'
```

Actions: `list`, `balance`, `add`, `status`. Full docs: `/docs` page eka.

## 📁 Project Structure

```
zayra-apis/
├── app/
│   ├── api/
│   │   ├── auth/{login,signup,logout,me}/route.js
│   │   ├── services/route.js        # price list
│   │   ├── orders/route.js          # dashboard orders
│   │   ├── admin/coins/route.js     # admin coin send + users list
│   │   └── v1/route.js              # public reseller API (API key eken)
│   ├── page.js                      # landing + LKR price list
│   ├── login/  signup/  dashboard/  admin/  docs/
│   └── layout.js  globals.css
├── lib/{prisma,auth,services}.js
├── prisma/{schema,schema.postgres}.prisma + seed.js
└── .env.example  next.config.js  package.json
```
