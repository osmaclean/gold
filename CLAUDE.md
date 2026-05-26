# Tropa da Gold — Plataforma CS2

Plataforma web competitiva privada (Next.js 16 + Supabase + Prisma + Postgres).
Uso restrito ao grupo "Tropa da Gold". Stack moderna, padrão sênior.

## Comandos

- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Type-check: `pnpm tsc --noEmit`
- Format: `pnpm exec prettier --write .`
- DB schema → banco: `pnpm db:push`
- DB migrar: `pnpm db:migrate`
- DB seed: `pnpm db:seed`
- DB studio: `pnpm db:studio`

## Stack travada

- Next.js 16 (App Router + Turbopack) · React 19.2 · TypeScript 5 · Tailwind 4
- Supabase (Auth + Postgres) via `@supabase/ssr` · Prisma 6
- Radix primitives (shadcn-style manuais) · Lucide v1 · Framer Motion · Anime.js v4
- React Hook Form · Zod · Recharts · TanStack Table · Sonner
- Deploy Vercel · pnpm 10

## Quirks do Next 16 (não esquecer)

- `middleware` foi renomeado para `proxy` (`src/proxy.ts`)
- `cookies()`, `headers()`, `params`, `searchParams` são todos `Promise` — sempre `await`
- Tailwind 4 configurado via CSS (`@theme` em `globals.css`), sem `tailwind.config.ts`
- `revalidateTag` exige segundo argumento (`cacheLife` profile)
- Páginas que leem cookies/DB já são dinâmicas; layouts `(app)` e `(admin)` marcados
  explicitamente com `export const dynamic = "force-dynamic"`

## Regras de código

- Commits em conventional: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`
- Nunca commitar sem instrução explícita do usuário
- Nunca fazer push sem instrução explícita
- Não criar arquivos novos sem necessidade comprovada
- Não refatorar fora do escopo solicitado
- Componentes em React: máximo ~500 linhas; quebrar em sub-componentes antes disso
- Validação de input externo via Zod (Server Actions usam `schema.parse()`)
- Tipagem forte: nada de `any` salvo justificativa explícita

## Segurança (inegociável)

- Toda entrada de usuário DEVE ser validada/sanitizada via Zod no servidor
- Validação client-side é UX, não segurança — o Server Action é a única barreira real
- Server Actions de admin sempre começam com `await requireAdmin()`
- Nunca logar dados sensíveis (cookies, tokens, e-mails de prod)
- Nunca expor stack traces ao cliente (Next 16 já mascara em prod)
- Cookies sensíveis: httpOnly, Secure, SameSite=Strict — Supabase SSR já cuida
- Avaliar OWASP Top 10 em toda mudança que toca request/data
- `SUPABASE_SERVICE_ROLE_KEY` só em código server-side (nunca em `"use client"`)

## Arquitetura

```
src/
  app/
    (auth)/             # /entrar
    (public)/           # /, /regras, /sobre
    (app)/              # área autenticada (force-dynamic)
    (admin)/            # /admin/*  (gated por role no layout)
    auth/callback       # OAuth callback Supabase
  components/
    ui/                 # primitivos shadcn-style manuais
    cards/              # PlayerCard, RankBadge, AchievementCard, LevelBar
    charts/             # StatRadar, EloLineChart
    feature/            # KpiCard, MatchScoreboard, MatchRow, SectionHeading
    layout/             # Sidebar, Header, CommandPalette, UserMenu
    motion/             # PageTransition
  features/             # vertical slices: actions + queries por domínio
    auth/  matches/  players/  cards/  seasons/  achievements/
  lib/
    auth/               # getCurrentUser, requireUser, requireAdmin
    supabase/           # server + client + middleware
    rating/             # elo, derive (overall), xp
    db.ts               # Prisma singleton
    constants.ts        # mapas, armas, raridades, patentes
    utils.ts            # cn, formatadores
  providers/            # theme, toaster
  proxy.ts              # auth gate (Next 16 substitui middleware)
prisma/
  schema.prisma         # User, PlayerStats, Card, Season, Match, ...
  seed.ts               # Season 1 + 12 achievements + badges base
```

## Camadas e responsabilidades

- **Server Components** por padrão. Client component só quando precisa interatividade real
  (cartas com flip, gráficos, modais, command palette).
- **Mutações** → Server Actions em `features/*/actions.ts`. Sempre Zod no input,
  `requireUser`/`requireAdmin` no topo, `revalidatePath` no final.
- **Leituras** → queries em `features/*/queries.ts`. Reutilizadas por páginas.
- **Stats da carta** → 4 derivadas automaticamente (AIM/CLUTCH/ENTRY/AWP) via `lib/rating/derive.ts`,
  4 editáveis pelo admin (SUPPORT/MOVEMENT/GAME_SENSE/COMMUNICATION).
- **Overall** → média ponderada das 8 stats. Recalcula a cada partida e a cada edição.

## Proibições

- NÃO usar `any` em TypeScript
- NÃO adicionar dependências sem discutir justificativa
- NÃO gerar documentação sem instrução explícita
- NÃO fazer push sem instrução explícita
- NÃO ignorar erros de lint ou TypeScript
- NÃO commitar `.env.local` (gitignored)
- NÃO usar `SUPABASE_SERVICE_ROLE_KEY` em código com `"use client"`
- NÃO editar `pnpm-lock.yaml`, `.env*`, certificados manualmente
  (hook `protect-files.js` bloqueia)

## Pipeline QA (sob demanda)

Time de agentes em `.claude/agents/`. Pipeline core para entregas:

```
(@tester + @security) em paralelo → @reviewer → veredito
```

Extensões por tipo de entrega:

- **UI** → core + @design-qa + @copywriter
- **Landing/SEO** → core + @seo + @copywriter + @performance
- **Infra/perf** → core + @performance
- **Pre-release** → core + @performance + @seo

Detalhes em `.claude/rules/qa-pipeline.md`.

## Documentação e qualidade

- README na raiz tem o setup completo de Supabase + Vercel
- Se documentação contradiz código: PARAR e perguntar qual está correto
- Toda feature pode (não obriga) ter teste — coverage não é meta aqui, plataforma é privada
