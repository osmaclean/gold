import type { PlayerStats, Achievement, User } from "@prisma/client"
import { db } from "@/lib/db"
import { xpForMatch } from "@/lib/rating/xp"

interface AchievementCriteria {
  type: string
  threshold: number
  minMatches?: number
}

interface EvaluateContext {
  user: User & { stats: PlayerStats | null }
  matchPerformance: {
    isMVP: boolean
    rating: number
    won: boolean
    mvpStreak: number
    winStreak: number
  }
}

function meetsCriteria(criteria: AchievementCriteria, ctx: EvaluateContext): boolean {
  const s = ctx.user.stats
  if (!s) return false
  switch (criteria.type) {
    case "matches_played":
      return s.matchesPlayed >= criteria.threshold
    case "opening_kills":
      return s.openingKills >= criteria.threshold
    case "clutches_won":
      return s.clutchesWon >= criteria.threshold
    case "aces":
      return s.aces >= criteria.threshold
    case "hs_rate": {
      if ((criteria.minMatches ?? 0) > s.matchesPlayed) return false
      return s.kills > 0 && s.headshots / s.kills >= criteria.threshold
    }
    case "flash_assists":
      return s.flashAssists >= criteria.threshold
    case "utility_damage":
      return s.utilityDamage >= criteria.threshold
    case "assists":
      return s.assists >= criteria.threshold
    case "awp_kills":
      return s.awpKills >= criteria.threshold
    case "mvp_streak":
      return ctx.matchPerformance.mvpStreak >= criteria.threshold
    case "win_streak":
      return ctx.matchPerformance.winStreak >= criteria.threshold
    case "elo":
      return ctx.user.elo >= criteria.threshold
    default:
      return false
  }
}

/**
 * Roda após cada partida. Devolve as conquistas recém-desbloqueadas.
 */
export async function evaluateAchievementsForPlayer(ctx: EvaluateContext): Promise<Achievement[]> {
  const userId = ctx.user.id
  const [allAchievements, alreadyUnlocked] = await Promise.all([
    db.achievement.findMany(),
    db.playerAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
  ])
  const unlockedIds = new Set(alreadyUnlocked.map((a) => a.achievementId))

  const newlyUnlocked: Achievement[] = []
  for (const a of allAchievements) {
    if (unlockedIds.has(a.id)) continue
    const criteria = a.criteria as unknown as AchievementCriteria
    if (meetsCriteria(criteria, ctx)) newlyUnlocked.push(a)
  }

  if (newlyUnlocked.length === 0) return []

  const xpFromAchievements = newlyUnlocked.reduce((sum, a) => sum + a.xpReward, 0)
  await db.$transaction([
    db.playerAchievement.createMany({
      data: newlyUnlocked.map((a) => ({ userId, achievementId: a.id })),
      skipDuplicates: true,
    }),
    db.user.update({
      where: { id: userId },
      data: { xp: { increment: xpFromAchievements } },
    }),
  ])

  return newlyUnlocked
}

export { xpForMatch }
