/**
 * Sistema de Elo simples adaptado pra 5v5.
 * - K-factor base = 32
 * - Esperado calculado pelo Elo médio do time
 * - Bônus de performance (KAST-ish via rating HLTV)
 */

const K_FACTOR = 32
const PERF_WEIGHT = 0.5

export function expectedScore(ratingA: number, ratingB: number) {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400))
}

export function computeEloDelta(args: {
  selfElo: number
  teamMeanElo: number
  enemyMeanElo: number
  won: boolean
  isDraw?: boolean
  performanceRating?: number // hltv-rating-ish, 1.0 média
}) {
  const expected = expectedScore(args.teamMeanElo, args.enemyMeanElo)
  const actual = args.isDraw ? 0.5 : args.won ? 1 : 0
  const base = K_FACTOR * (actual - expected)

  const perfBoost = args.performanceRating
    ? K_FACTOR * PERF_WEIGHT * (args.performanceRating - 1)
    : 0

  return Math.round(base + perfBoost)
}

export function meanElo(values: number[]) {
  if (values.length === 0) return 1000
  return values.reduce((a, b) => a + b, 0) / values.length
}
