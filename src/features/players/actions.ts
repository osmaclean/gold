"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function setPlayerRoleAction(userId: string, role: "PLAYER" | "ADMIN") {
  await requireAdmin()
  await db.user.update({ where: { id: userId }, data: { role } })
  revalidatePath("/admin/jogadores")
}

export async function setPlayerActiveAction(userId: string, isActive: boolean) {
  await requireAdmin()
  await db.user.update({ where: { id: userId }, data: { isActive } })
  revalidatePath("/admin/jogadores")
}

const editProfileSchema = z.object({
  bio: z.string().max(280).optional().nullable(),
  nickname: z.string().min(2).max(24).regex(/^[a-zA-Z0-9_]+$/, "Use letras, números ou underline"),
})

export async function editOwnProfileAction(userId: string, input: z.infer<typeof editProfileSchema>) {
  const parsed = editProfileSchema.parse(input)
  // Garante que nickname é único (excluindo o próprio)
  const exists = await db.user.findFirst({
    where: { nickname: parsed.nickname, NOT: { id: userId } },
  })
  if (exists) throw new Error("Nickname já está em uso.")
  await db.user.update({
    where: { id: userId },
    data: { nickname: parsed.nickname, bio: parsed.bio ?? null },
  })
  revalidatePath(`/jogadores/${parsed.nickname}`)
}
