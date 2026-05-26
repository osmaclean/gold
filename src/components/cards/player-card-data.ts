import type { Card as PrismaCard, Position, Rarity } from "@prisma/client"

export interface PlayerCardData {
  nickname: string
  avatarUrl?: string | null
  position: Position
  overall: number
  rarity: Rarity
  edition?: string
  isHolographic?: boolean
  stats: {
    aim: number
    clutch: number
    support: number
    movement: number
    gameSense: number
    entry: number
    awp: number
    communication: number
  }
}

/**
 * Conversor neutro (sem "use client") — pode ser chamado em Server Components.
 */
export function fromPrismaCard(
  card: Pick<
    PrismaCard,
    | "rarity"
    | "edition"
    | "overall"
    | "aim"
    | "clutch"
    | "support"
    | "movement"
    | "gameSense"
    | "entry"
    | "awp"
    | "communication"
    | "position"
    | "isHolographic"
  >,
  user: { nickname: string; avatarUrl: string | null },
): PlayerCardData {
  return {
    nickname: user.nickname,
    avatarUrl: user.avatarUrl,
    position: card.position,
    overall: card.overall,
    rarity: card.rarity,
    edition: card.edition,
    isHolographic: card.isHolographic,
    stats: {
      aim: card.aim,
      clutch: card.clutch,
      support: card.support,
      movement: card.movement,
      gameSense: card.gameSense,
      entry: card.entry,
      awp: card.awp,
      communication: card.communication,
    },
  }
}
