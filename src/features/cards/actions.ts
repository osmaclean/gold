"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { computeOverall, deriveRarity } from "@/lib/rating/derive"

const editCardSchema = z.object({
  cardId: z.string().min(1),
  support: z.coerce.number().int().min(50).max(99),
  movement: z.coerce.number().int().min(50).max(99),
  gameSense: z.coerce.number().int().min(50).max(99),
  communication: z.coerce.number().int().min(50).max(99),
  edition: z.string().min(1).default("base"),
  position: z.enum(["ENTRY", "RIFLER", "AWPER", "SUPPORT", "IGL", "LURKER"]),
  isHolographic: z.boolean().default(false),
  favoriteMap: z.string().nullable().optional(),
  favoriteWeapon: z.string().nullable().optional(),
})

export type EditCardInput = z.infer<typeof editCardSchema>

export async function editCardAction(input: EditCardInput) {
  await requireAdmin()
  const parsed = editCardSchema.parse(input)

  const card = await db.card.findUnique({ where: { id: parsed.cardId } })
  if (!card) throw new Error("Carta não encontrada.")

  const merged = {
    aim: card.aim,
    clutch: card.clutch,
    entry: card.entry,
    awp: card.awp,
    support: parsed.support,
    movement: parsed.movement,
    gameSense: parsed.gameSense,
    communication: parsed.communication,
  }
  const overall = computeOverall(merged)
  const rarity = deriveRarity(overall, parsed.edition)

  await db.card.update({
    where: { id: parsed.cardId },
    data: {
      support: parsed.support,
      movement: parsed.movement,
      gameSense: parsed.gameSense,
      communication: parsed.communication,
      edition: parsed.edition,
      position: parsed.position,
      isHolographic: parsed.isHolographic,
      favoriteMap: parsed.favoriteMap || null,
      favoriteWeapon: parsed.favoriteWeapon || null,
      overall,
      rarity,
      version: { increment: 1 },
    },
  })

  await db.cardSnapshot.create({
    data: {
      cardId: parsed.cardId,
      overall,
      rarity,
      payload: { ...merged, edition: parsed.edition, position: parsed.position },
      reason: "admin_edit",
    },
  })

  revalidatePath("/admin/cartas")
  revalidatePath("/cartas")
  return { ok: true }
}
