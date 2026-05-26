import { clampInt, safeDivide } from "@/lib/utils"

export interface DerivableStats {
  matchesPlayed: number
  kills: number
  deaths: number
  assists: number
  headshots: number
  clutchesWon: number
  clutchesAttempted: number
  openingKills: number
  openingDeaths: number
  awpKills: number
}

export interface DerivedCardSlice {
  aim: number
  clutch: number
  entry: number
  awp: number
}

/**
 * Stats derivadas a partir do agregado lifetime do player.
 * Range alvo: 50–99 (estilo FUT).
 *
 * • aim   — combina K/D e HS%
 * • clutch — winrate em rounds clutch
 * • entry  — opening-duel winrate + volume
 * • awp    — share de kills com AWP escalado
 */
export function deriveCardStats(stats: DerivableStats): DerivedCardSlice {
  const kd = safeDivide(stats.kills, Math.max(stats.deaths, 1))
  const hsPct = safeDivide(stats.headshots, Math.max(stats.kills, 1))
  const clutchWinrate = safeDivide(stats.clutchesWon, Math.max(stats.clutchesAttempted, 1))
  const openingWinrate = safeDivide(
    stats.openingKills,
    Math.max(stats.openingKills + stats.openingDeaths, 1)
  )
  const awpShare = safeDivide(stats.awpKills, Math.max(stats.kills, 1))

  // Curva: cresce mais rápido até ~85, depois desacelera.
  const curve = (x: number) => 60 + 35 * Math.tanh(x)

  const aim = curve((kd - 1) * 0.9 + (hsPct - 0.4) * 1.2)
  const clutch = curve((clutchWinrate - 0.45) * 2.2 + Math.log1p(stats.clutchesWon) * 0.1)
  const entry = curve(
    (openingWinrate - 0.5) * 2 + Math.log1p(stats.openingKills) * 0.15
  )
  const awp = curve(awpShare * 3 + Math.log1p(stats.awpKills) * 0.2 - 0.2)

  // Players sem partidas suficientes ficam mais conservadores
  const confidence = Math.min(1, stats.matchesPlayed / 6)
  const blend = (raw: number) => 60 + (raw - 60) * confidence

  return {
    aim: clampInt(blend(aim), 50, 99),
    clutch: clampInt(blend(clutch), 50, 99),
    entry: clampInt(blend(entry), 50, 99),
    awp: clampInt(blend(awp), 50, 99),
  }
}

/**
 * Pesos do overall — equilibrados pra raridades.
 */
const OVERALL_WEIGHTS = {
  aim: 0.18,
  clutch: 0.15,
  support: 0.1,
  movement: 0.1,
  gameSense: 0.14,
  entry: 0.12,
  awp: 0.1,
  communication: 0.11,
}

export function computeOverall(stats: {
  aim: number
  clutch: number
  support: number
  movement: number
  gameSense: number
  entry: number
  awp: number
  communication: number
}) {
  const sum =
    stats.aim * OVERALL_WEIGHTS.aim +
    stats.clutch * OVERALL_WEIGHTS.clutch +
    stats.support * OVERALL_WEIGHTS.support +
    stats.movement * OVERALL_WEIGHTS.movement +
    stats.gameSense * OVERALL_WEIGHTS.gameSense +
    stats.entry * OVERALL_WEIGHTS.entry +
    stats.awp * OVERALL_WEIGHTS.awp +
    stats.communication * OVERALL_WEIGHTS.communication

  return clampInt(sum, 50, 99)
}

/**
 * Rarity escala com o overall e marca cartas especiais por edição.
 */
export function deriveRarity(overall: number, edition: string) {
  if (edition === "toty") return "TOTY" as const
  if (edition === "icon") return "ICON" as const
  if (edition === "legendary") return "LEGENDARY" as const
  if (overall >= 90) return "GOLD_RARE" as const
  if (overall >= 80) return "GOLD" as const
  if (overall >= 70) return "SILVER" as const
  return "BRONZE" as const
}

/**
 * Rating HLTV 2.0 simplificado pra uma partida.
 * Baseado em KDR, ADR, KAST aproximado.
 */
export function computeMatchRating(args: {
  kills: number
  deaths: number
  assists: number
  damage: number
  rounds: number
}) {
  const rounds = Math.max(args.rounds, 1)
  const kpr = args.kills / rounds
  const apr = args.assists / rounds
  const dpr = args.deaths / rounds
  const adr = args.damage / rounds

  // Pesos: kills > damage > assists > -deaths
  const rating = 0.0073 * 100 + 0.3591 * kpr - 0.5329 * dpr + 0.2372 * apr + 0.0032 * adr + 0.65
  return Math.max(0, Number(rating.toFixed(2)))
}
