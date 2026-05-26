import { db } from "@/lib/db"

export async function getActiveSeason() {
  return db.season.findFirst({ where: { status: "ACTIVE" }, orderBy: { number: "desc" } })
}

export async function getAllSeasons() {
  return db.season.findMany({ orderBy: { number: "desc" } })
}

export async function getSeasonByNumber(number: number) {
  return db.season.findUnique({
    where: { number },
    include: {
      ranks: { include: { user: true }, orderBy: { elo: "desc" } },
      matches: { take: 10, orderBy: { playedAt: "desc" } },
    },
  })
}
