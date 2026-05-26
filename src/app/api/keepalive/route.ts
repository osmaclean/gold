import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * Rota pública de keepalive — mantém o Supabase ativo via tráfego.
 * Pode ser pingada por Vercel Cron, UptimeRobot, GitHub Action, etc.
 *
 * GET /api/keepalive  →  { ok: true, now }
 */

export const dynamic = "force-dynamic"

export async function GET() {
  const rows = await db.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`
  return NextResponse.json({ ok: true, now: rows[0]?.now ?? null })
}
