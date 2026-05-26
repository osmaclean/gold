# Tropa da Gold — Plataforma CS2

Plataforma web competitiva privada construída pra galera da Tropa da Gold:
ranking, partidas estilo HLTV, cartas FUT-style, conquistas e temporadas.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind 4
- React 19.2 + Framer Motion + Anime.js
- Supabase (Auth + Postgres) + Prisma ORM
- shadcn-style UI (Radix primitives) + Lucide
- Recharts · React Hook Form · Zod · TanStack Table
- Deploy: Vercel

## Setup

### 1. Pré-requisitos

- Node.js 20.9+ ou 22.11+
- pnpm 10+

### 2. Crie um projeto no Supabase

1. Acesse https://supabase.com e crie um novo projeto.
2. Em **Project Settings → API**, copie `URL` e `anon` key.
3. Em **Project Settings → Database → Connection Pooling** (modo **Transaction**),
   copie a string de conexão — essa é a `DATABASE_URL` (porta `6543`).
4. Na mesma página, em modo **Session** (porta `5432`), copie a string para `DIRECT_URL`.
5. Em **Authentication → Providers**, ative:
   - **Email** (já vem ativo — magic link funciona com SMTP nativo do Supabase pra dev).
   - **Discord**: crie um app em https://discord.com/developers/applications,
     adicione o redirect `https://YOUR-PROJECT.supabase.co/auth/v1/callback` e cole
     `Client ID` e `Client Secret` na config.
6. Em **Authentication → URL Configuration**, defina:
   - Site URL: `http://localhost:3000` (dev) ou seu domínio em produção.
   - Redirect URLs: `http://localhost:3000/auth/callback` e a versão de produção.

### 3. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

Variáveis obrigatórias:

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `DATABASE_URL` | Supabase → Database (pooler, porta 6543) |
| `DIRECT_URL` | Supabase → Database (session, porta 5432) |
| `ADMIN_EMAILS` | Lista separada por vírgula. Esses e-mails viram `ADMIN` automaticamente no 1º login. |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` em dev |

### 4. Banco de dados

```bash
pnpm db:push       # cria todas as tabelas
pnpm db:seed       # cria Season 1, achievements e badges base
```

Quando começar a evoluir o schema, use migrações:

```bash
pnpm db:migrate
```

### 5. Rodar

```bash
pnpm dev
```

Abra http://localhost:3000.

- Login na home → `/entrar`
- Após o login, os e-mails listados em `ADMIN_EMAILS` viram admin automaticamente.
- O primeiro login cria automaticamente o User + carta base + stats vazias.

## Scripts úteis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento (Turbopack) |
| `pnpm build` | Build de produção |
| `pnpm start` | Servidor de produção |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Gera Prisma Client |
| `pnpm db:push` | Sincroniza schema com o banco (sem migrações) |
| `pnpm db:migrate` | Cria migração + aplica |
| `pnpm db:seed` | Roda `prisma/seed.ts` |
| `pnpm db:studio` | Abre Prisma Studio |
| `pnpm db:keepalive` | Faz um ping no banco pra evitar pausa do free tier |

> Scripts de banco usam `dotenv-cli` pra carregar `.env.local` antes do Prisma
> (Prisma só lê `.env` por padrão).

## Keepalive (Supabase free tier)

O free tier do Supabase pausa projetos após ~1 semana sem atividade.
O repo tem um workflow `.github/workflows/keepalive.yml` que roda diariamente às
09:00 Brasília e dispara `scripts/keepalive.ts` (`SELECT NOW()` + touch na season ativa).

Pra ativar, basta cadastrar dois GitHub Secrets em
**Settings → Secrets and variables → Actions**:

| Secret | Valor |
|---|---|
| `DATABASE_URL` | Mesmo do `.env.local` (Transaction pooler, 6543) |
| `DIRECT_URL` | Mesmo do `.env.local` (Session pooler, 5432) |

Há também a rota pública `GET /api/keepalive` (retorna `{ ok, now }`) — útil pra plugar
em Vercel Cron, UptimeRobot ou qualquer pinger HTTP quando o app estiver deployado.

## Estrutura

```
src/
  app/
    (auth)/             # /entrar
    (public)/           # /, /regras, /sobre
    (app)/              # área autenticada (dashboard, perfil, partidas, …)
    (admin)/            # /admin/*  (gated por role)
    auth/callback       # OAuth callback
  components/
    ui/                 # primitivos shadcn-style
    cards/              # PlayerCard, RankBadge, AchievementCard, LevelBar
    charts/             # StatRadar, EloLineChart
    feature/            # KpiCard, MatchScoreboard, MatchRow, SectionHeading
    layout/             # Sidebar, Header, CommandPalette, UserMenu
    motion/             # PageTransition
  features/             # vertical slices por domínio
    auth/  matches/  players/  cards/  seasons/  achievements/
  lib/
    auth/               # getCurrentUser, requireUser, requireAdmin
    supabase/           # server/client/middleware
    rating/             # elo, derive (overall), xp
    db.ts               # Prisma singleton
    constants.ts        # mapas, armas, raridades, patentes
    utils.ts            # cn, formatadores
  providers/            # theme, toaster
  proxy.ts              # auth gate (substitui middleware no Next 16)
prisma/
  schema.prisma
  seed.ts
```

## Deploy na Vercel

1. Crie um projeto novo na Vercel apontando pro repo.
2. Cole as mesmas variáveis de ambiente do `.env.local`
   (ajuste `NEXT_PUBLIC_APP_URL` para o domínio Vercel).
3. Adicione o domínio Vercel em **Supabase → URL Configuration** como Redirect URL:
   - `https://SEU-APP.vercel.app/auth/callback`
4. Push → deploy automático.

## Identidade visual

- Dark mode default.
- Paleta: dourado (`--gold-*`), grafite (`--graphite-*`), tinta (`--ink`), névoa (`--mist`).
- Tipografia: Geist Sans (corpo), Bebas Neue (display), Geist Mono (números).
- Efeitos: glassmorphism, neon sutil, holográfico parallax nas cartas raras.

## Roadmap (pós v1)

- Packs / abertura de cartas com animação
- Eventos / torneios com brackets
- Integração com demos `.dem` do CS2 (parser auto-fill de stats)
- App mobile (PWA already in scope)
- Realtime de partidas em andamento
