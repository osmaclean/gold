import { db } from "@/lib/db"

export async function getAllAchievementsWithStatus(userId: string) {
  const [all, unlocked] = await Promise.all([
    db.achievement.findMany({ orderBy: { xpReward: "asc" } }),
    db.playerAchievement.findMany({ where: { userId } }),
  ])
  const unlockedMap = new Map(unlocked.map((u) => [u.achievementId, u.unlockedAt]))
  return all.map((a) => ({
    ...a,
    unlocked: unlockedMap.has(a.id),
    unlockedAt: unlockedMap.get(a.id) ?? null,
  }))
}
