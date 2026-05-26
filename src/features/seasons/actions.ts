"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

const createSeasonSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional().nullable(),
})

export async function createSeasonAction(input: z.infer<typeof createSeasonSchema>) {
  await requireAdmin()
  const parsed = createSeasonSchema.parse(input)
  const last = await db.season.findFirst({ orderBy: { number: "desc" } })
  const number = (last?.number ?? 0) + 1
  const created = await db.season.create({
    data: {
      number,
      name: parsed.name,
      description: parsed.description ?? null,
      startsAt: parsed.startsAt,
      endsAt: parsed.endsAt ?? null,
      status: "UPCOMING",
    },
  })
  revalidatePath("/seasons")
  revalidatePath("/admin/seasons")
  return created
}

export async function activateSeasonAction(seasonId: string) {
  await requireAdmin()
  await db.season.updateMany({ where: { status: "ACTIVE" }, data: { status: "FINISHED" } })
  await db.season.update({ where: { id: seasonId }, data: { status: "ACTIVE" } })
  revalidatePath("/seasons")
}

export async function finishSeasonAction(seasonId: string) {
  await requireAdmin()
  const ranks = await db.seasonRank.findMany({ where: { seasonId }, orderBy: { elo: "desc" } })
  for (let i = 0; i < ranks.length; i++) {
    const trophy = i === 0 ? "champion" : i === 1 ? "runner-up" : i === 2 ? "top-3" : null
    await db.seasonRank.update({
      where: { id: ranks[i].id },
      data: { rank: i + 1, trophy },
    })
  }
  await db.season.update({
    where: { id: seasonId },
    data: { status: "FINISHED", endsAt: new Date() },
  })
  revalidatePath("/seasons")
}
