"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { computeEloDelta, meanElo } from "@/lib/rating/elo"
import { computeMatchRating, deriveCardStats, computeOverall, deriveRarity } from "@/lib/rating/derive"
import { xpForMatch, evaluateAchievementsForPlayer } from "@/features/achievements/engine"

const playerLineSchema = z.object({
  userId: z.string().min(1),
  team: z.enum(["TEAM_A", "TEAM_B"]),
  kills: z.coerce.number().int().min(0).default(0),
  deaths: z.coerce.number().int().min(0).default(0),
  assists: z.coerce.number().int().min(0).default(0),
  headshots: z.coerce.number().int().min(0).default(0),
  damage: z.coerce.number().int().min(0).default(0),
  clutchesWon: z.coerce.number().int().min(0).default(0),
  openingKills: z.coerce.number().int().min(0).default(0),
  openingDeaths: z.coerce.number().int().min(0).default(0),
  awpKills: z.coerce.number().int().min(0).default(0),
  flashAssists: z.coerce.number().int().min(0).default(0),
  utilityDamage: z.coerce.number().int().min(0).default(0),
})

export const createMatchSchema = z.object({
  seasonId: z.string().nullable().optional(),
  map: z.string().min(1, "Selecione o mapa"),
  mode: z.enum(["MR12", "MR15", "WINGMAN", "AIM_MAP", "CUSTOM"]).default("MR12"),
  playedAt: z.coerce.date(),
  scoreTeamA: z.coerce.number().int().min(0),
  scoreTeamB: z.coerce.number().int().min(0),
  mvpUserId: z.string().optional().nullable(),
  highlights: z.string().optional().nullable(),
  validated: z.boolean().default(true),
  players: z.array(playerLineSchema).min(2),
})

export type CreateMatchInput = z.infer<typeof createMatchSchema>

export async function createMatchAction(input: CreateMatchInput) {
  const admin = await requireAdmin()
  const parsed = createMatchSchema.parse(input)

  if (parsed.players.length < 2) {
    throw new Error("Adicione ao menos 2 jogadores.")
  }

  const isDraw = parsed.scoreTeamA === parsed.scoreTeamB
  const winningTeam = isDraw ? null : parsed.scoreTeamA > parsed.scoreTeamB ? "TEAM_A" : "TEAM_B"
  const totalRounds = parsed.scoreTeamA + parsed.scoreTeamB

  const userIds = parsed.players.map((p) => p.userId)
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    include: { stats: true, card: true },
  })
  const usersById = new Map(users.map((u) => [u.id, u]))

  // Elo médio por time
  const teamAElos = parsed.players
    .filter((p) => p.team === "TEAM_A")
    .map((p) => usersById.get(p.userId)?.elo ?? 1000)
  const teamBElos = parsed.players
    .filter((p) => p.team === "TEAM_B")
    .map((p) => usersById.get(p.userId)?.elo ?? 1000)
  const meanA = meanElo(teamAElos)
  const meanB = meanElo(teamBElos)

  // Cria a partida + matchPlayers em transação
  const match = await db.$transaction(async (tx) => {
    const m = await tx.match.create({
      data: {
        seasonId: parsed.seasonId ?? null,
        map: parsed.map,
        mode: parsed.mode,
        playedAt: parsed.playedAt,
        scoreTeamA: parsed.scoreTeamA,
        scoreTeamB: parsed.scoreTeamB,
        winningTeam,
        isDraw,
        mvpUserId: parsed.mvpUserId || null,
        highlights: parsed.highlights || null,
        validated: parsed.validated,
        createdById: admin.id,
      },
    })

    for (const p of parsed.players) {
      const u = usersById.get(p.userId)
      if (!u) continue

      const rating = computeMatchRating({
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
        damage: p.damage,
        rounds: totalRounds,
      })
      const adr = totalRounds > 0 ? p.damage / totalRounds : 0
      const kast = 0
      const isMVP = parsed.mvpUserId === p.userId

      const teamMean = p.team === "TEAM_A" ? meanA : meanB
      const enemyMean = p.team === "TEAM_A" ? meanB : meanA
      const won = winningTeam === p.team

      const eloDelta = computeEloDelta({
        selfElo: u.elo,
        teamMeanElo: teamMean,
        enemyMeanElo: enemyMean,
        won,
        isDraw,
        performanceRating: rating,
      })

      await tx.matchPlayer.create({
        data: {
          matchId: m.id,
          userId: p.userId,
          team: p.team,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          headshots: p.headshots,
          damage: p.damage,
          clutchesWon: p.clutchesWon,
          openingKills: p.openingKills,
          openingDeaths: p.openingDeaths,
          awpKills: p.awpKills,
          flashAssists: p.flashAssists,
          utilityDamage: p.utilityDamage,
          rating,
          adr,
          kast,
          isMVP,
          eloDelta,
        },
      })

      // Acumula stats lifetime
      const xp = xpForMatch({ won, isMVP, rating })

      const isAce = false // placeholder — calcular ace exigiria rounds detalhados
      const newWinStreak = won ? (u.id ? (await tx.playerStats.findUnique({ where: { userId: u.id } }))?.currentWinStreak ?? 0 : 0) + 1 : 0
      const newLossStreak = !won && !isDraw ? ((await tx.playerStats.findUnique({ where: { userId: u.id } }))?.currentLossStreak ?? 0) + 1 : 0

      await tx.playerStats.upsert({
        where: { userId: u.id },
        update: {
          matchesPlayed: { increment: 1 },
          wins: won ? { increment: 1 } : undefined,
          losses: !won && !isDraw ? { increment: 1 } : undefined,
          ties: isDraw ? { increment: 1 } : undefined,
          kills: { increment: p.kills },
          deaths: { increment: p.deaths },
          assists: { increment: p.assists },
          headshots: { increment: p.headshots },
          damage: { increment: p.damage },
          clutchesWon: { increment: p.clutchesWon },
          openingKills: { increment: p.openingKills },
          openingDeaths: { increment: p.openingDeaths },
          awpKills: { increment: p.awpKills },
          flashAssists: { increment: p.flashAssists },
          utilityDamage: { increment: p.utilityDamage },
          mvps: isMVP ? { increment: 1 } : undefined,
          currentWinStreak: newWinStreak,
          currentLossStreak: newLossStreak,
          longestWinStreak: { set: Math.max(u.stats?.longestWinStreak ?? 0, newWinStreak) },
          longestLossStreak: { set: Math.max(u.stats?.longestLossStreak ?? 0, newLossStreak) },
        },
        create: {
          userId: u.id,
          matchesPlayed: 1,
          wins: won ? 1 : 0,
          losses: !won && !isDraw ? 1 : 0,
          ties: isDraw ? 1 : 0,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          headshots: p.headshots,
          damage: p.damage,
          clutchesWon: p.clutchesWon,
          openingKills: p.openingKills,
          openingDeaths: p.openingDeaths,
          awpKills: p.awpKills,
          flashAssists: p.flashAssists,
          utilityDamage: p.utilityDamage,
          mvps: isMVP ? 1 : 0,
          currentWinStreak: newWinStreak,
          currentLossStreak: newLossStreak,
          longestWinStreak: newWinStreak,
          longestLossStreak: newLossStreak,
        },
      })

      // Update User elo + xp
      const newElo = Math.max(0, u.elo + eloDelta)
      await tx.user.update({
        where: { id: u.id },
        data: { elo: newElo, xp: { increment: xp } },
      })

      // Recalc card derivadas + overall + rarity
      if (u.card) {
        const newStats = await tx.playerStats.findUnique({ where: { userId: u.id } })
        if (newStats) {
          const derived = deriveCardStats(newStats)
          const merged = {
            aim: derived.aim,
            clutch: derived.clutch,
            entry: derived.entry,
            awp: derived.awp,
            support: u.card.support,
            movement: u.card.movement,
            gameSense: u.card.gameSense,
            communication: u.card.communication,
          }
          const newOverall = computeOverall(merged)
          const newRarity = deriveRarity(newOverall, u.card.edition)
          await tx.card.update({
            where: { id: u.card.id },
            data: {
              aim: merged.aim,
              clutch: merged.clutch,
              entry: merged.entry,
              awp: merged.awp,
              overall: newOverall,
              rarity: newRarity,
              version: { increment: 1 },
            },
          })
          await tx.cardSnapshot.create({
            data: {
              cardId: u.card.id,
              overall: newOverall,
              rarity: newRarity,
              payload: merged,
              reason: "match_played",
            },
          })
        }
      }

      // SeasonRank atualizado
      if (parsed.seasonId) {
        await tx.seasonRank.upsert({
          where: { seasonId_userId: { seasonId: parsed.seasonId, userId: u.id } },
          update: { elo: newElo },
          create: { seasonId: parsed.seasonId, userId: u.id, elo: newElo, rank: 0 },
        })
      }
    }

    return m
  }, { timeout: 30000 })

  // Avalia achievements out of transaction (precisa querar dados atualizados)
  for (const p of parsed.players) {
    const updated = await db.user.findUnique({ where: { id: p.userId }, include: { stats: true } })
    if (!updated) continue
    const won = winningTeam === p.team
    const isMVP = parsed.mvpUserId === p.userId
    const rating = computeMatchRating({ kills: p.kills, deaths: p.deaths, assists: p.assists, damage: p.damage, rounds: totalRounds })

    await evaluateAchievementsForPlayer({
      user: updated,
      matchPerformance: {
        isMVP,
        rating,
        won,
        mvpStreak: 0,
        winStreak: updated.stats?.currentWinStreak ?? 0,
      },
    })
  }

  revalidatePath("/dashboard")
  revalidatePath("/partidas")
  revalidatePath("/admin/partidas")
  return { id: match.id }
}

export async function deleteMatchAction(matchId: string) {
  await requireAdmin()
  await db.match.delete({ where: { id: matchId } })
  revalidatePath("/dashboard")
  revalidatePath("/partidas")
}
