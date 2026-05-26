import { cache } from "react"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Role, User } from "@prisma/client"

/**
 * Garante que existe um User no Prisma vinculado ao supabase.auth.users.
 * Roda no first login — cria perfil + carta base + stats vazias.
 */
async function ensureUserProfile(args: {
  supabaseId: string
  email: string
  metadata: Record<string, unknown> | null
}): Promise<User> {
  const existing = await db.user.findUnique({ where: { supabaseId: args.supabaseId } })
  if (existing) return existing

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  const role: Role = adminEmails.includes(args.email.toLowerCase()) ? "ADMIN" : "PLAYER"

  const meta = args.metadata ?? {}
  const baseNickname =
    (meta.user_name as string | undefined) ??
    (meta.preferred_username as string | undefined) ??
    (meta.name as string | undefined)?.split(" ")[0] ??
    args.email.split("@")[0]

  const cleanedNickname = baseNickname
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 24) || `player_${args.supabaseId.slice(0, 6)}`

  // Garante unicidade do nickname
  let nickname = cleanedNickname
  let attempt = 0
  while (await db.user.findUnique({ where: { nickname } })) {
    attempt++
    nickname = `${cleanedNickname}${attempt}`
    if (attempt > 50) break
  }

  return db.user.create({
    data: {
      supabaseId: args.supabaseId,
      email: args.email,
      nickname,
      avatarUrl: (meta.avatar_url as string | undefined) ?? null,
      discordId: (meta.provider_id as string | undefined) ?? null,
      role,
      stats: { create: {} },
      card: {
        create: {
          rarity: "BRONZE",
          overall: 60,
          aim: 60,
          clutch: 60,
          support: 60,
          movement: 60,
          gameSense: 60,
          entry: 60,
          awp: 60,
          communication: 60,
        },
      },
    },
  })
}

/**
 * Lê o user logado e devolve o registro do Prisma — ou null.
 * Memoizado por request via React `cache`.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return ensureUserProfile({
    supabaseId: user.id,
    email: user.email!,
    metadata: user.user_metadata ?? null,
  })
})

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) redirect("/entrar")
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) redirect("/entrar")
  if (user.role !== "ADMIN") redirect("/dashboard")
  return user
}

export function isAdmin(user: User | null): user is User {
  return !!user && user.role === "ADMIN"
}
