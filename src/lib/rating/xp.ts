/**
 * Sistema de XP / level — curva quadrática suave.
 * XP necessário pra subir do nível n: 50 * n^2.
 */

export function xpRequiredForLevel(level: number) {
  return Math.round(50 * level * level)
}

export function totalXpForLevel(level: number) {
  let total = 0
  for (let i = 1; i < level; i++) total += xpRequiredForLevel(i)
  return total
}

export function levelFromTotalXp(xp: number) {
  let level = 1
  while (xp >= xpRequiredForLevel(level)) {
    xp -= xpRequiredForLevel(level)
    level++
  }
  return { level, remaining: xp, next: xpRequiredForLevel(level) }
}

/**
 * XP ganho por partida — escala com rating, MVP e vitória.
 */
export function xpForMatch(args: { won: boolean; isMVP: boolean; rating: number }) {
  let xp = args.won ? 80 : 40
  if (args.isMVP) xp += 30
  xp += Math.round(args.rating * 25)
  return xp
}
