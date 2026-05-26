import { db } from "@/lib/db"

export async function getPlayerByNickname(nickname: string) {
  return db.user.findUnique({
    where: { nickname },
    include: {
      stats: true,
      card: true,
      achievements: { include: { achievement: true }, orderBy: { unlockedAt: "desc" } },
      badges: { include: { badge: true } },
      matchEntries: {
        take: 10,
        orderBy: { match: { playedAt: "desc" } },
        include: { match: { include: { mvp: true } } },
      },
    },
  })
}

export async function getAllPlayers() {
  return db.user.findMany({
    where: { isActive: true },
    orderBy: { elo: "desc" },
    include: { stats: true, card: true },
  })
}

export async function getGlobalRanking(seasonId?: string | null) {
  if (seasonId) {
    return db.seasonRank.findMany({
      where: { seasonId },
      orderBy: { elo: "desc" },
      take: 20,
      include: { user: { include: { card: true } } },
    })
  }
  const users = await db.user.findMany({
    where: { isActive: true },
    orderBy: { elo: "desc" },
    take: 20,
    include: { card: true, stats: true },
  })
  return users
}

export async function getMvpOfTheWeek() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const mvpCount = await db.matchPlayer.groupBy({
    by: ["userId"],
    where: { isMVP: true, match: { playedAt: { gte: sevenDaysAgo } } },
    _count: { userId: true },
    orderBy: { _count: { userId: "desc" } },
    take: 1,
  })

  if (mvpCount.length === 0) return null
  return db.user.findUnique({
    where: { id: mvpCount[0].userId },
    include: { card: true, stats: true },
  })
}
