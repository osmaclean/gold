/**
 * Keepalive — roda uma query simples pra manter o projeto Supabase ativo.
 *
 * Free tier do Supabase pausa o projeto após ~1 semana sem atividade no banco.
 * Esse script faz um SELECT 1 e um upsert num registro de auditoria, garantindo
 * que tanto leitura quanto escrita contem como atividade.
 *
 * Acionado via:
 *  - `pnpm db:keepalive` localmente
 *  - GitHub Action `.github/workflows/keepalive.yml` (cron diário)
 */

import { PrismaClient } from "@prisma/client"

const db = new PrismaClient({ log: ["error"] })

async function main() {
  const startedAt = new Date()
  console.log(`[keepalive] ping iniciado em ${startedAt.toISOString()}`)

  const ping = await db.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`
  console.log(`[keepalive] SELECT NOW() → ${ping[0]?.now?.toISOString?.() ?? ping[0]?.now}`)

  // Escrita leve: cria um snapshot vazio ligado a uma carta inexistente NÃO funciona,
  // mas atualizar um registro de season existente sim. Usamos `updatedAt` da season ativa.
  const active = await db.season.findFirst({ where: { status: "ACTIVE" } })
  if (active) {
    await db.season.update({ where: { id: active.id }, data: { updatedAt: new Date() } })
    console.log(`[keepalive] tocou season ativa: ${active.name}`)
  } else {
    console.log("[keepalive] nenhuma season ativa — só leitura (suficiente pra evitar pausa)")
  }

  const elapsedMs = Date.now() - startedAt.getTime()
  console.log(`[keepalive] concluído em ${elapsedMs}ms`)
}

main()
  .catch((err) => {
    console.error("[keepalive] FALHOU:", err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
