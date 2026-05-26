import { db } from "@/lib/db"

export async function getRecentMatches(limit = 8) {
  return db.match.findMany({
    take: limit,
    orderBy: { playedAt: "desc" },
    include: {
      mvp: true,
      players: { include: { user: true } },
    },
  })
}

export async function getMatchById(id: string) {
  return db.match.findUnique({
    where: { id },
    include: {
      season: true,
      mvp: true,
      createdBy: true,
      players: { include: { user: true }, orderBy: { rating: "desc" } },
      rounds: { orderBy: { number: "asc" } },
    },
  })
}

export async function getMatchesForUser(userId: string, limit = 20) {
  return db.matchPlayer.findMany({
    where: { userId },
    take: limit,
    orderBy: { match: { playedAt: "desc" } },
    include: { match: { include: { mvp: true } } },
  })
}
