export const APP_NAME = "Tropa da Gold"
export const APP_TAG = "TDG"

export const CS_MAPS = [
  { value: "de_mirage", label: "Mirage" },
  { value: "de_inferno", label: "Inferno" },
  { value: "de_nuke", label: "Nuke" },
  { value: "de_dust2", label: "Dust 2" },
  { value: "de_overpass", label: "Overpass" },
  { value: "de_ancient", label: "Ancient" },
  { value: "de_anubis", label: "Anubis" },
  { value: "de_vertigo", label: "Vertigo" },
  { value: "de_train", label: "Train" },
] as const

export const CS_WEAPONS = [
  "AK-47",
  "M4A4",
  "M4A1-S",
  "AWP",
  "Desert Eagle",
  "USP-S",
  "Glock-18",
  "FAMAS",
  "Galil AR",
  "SG 553",
  "AUG",
  "MP9",
  "MAC-10",
] as const

export const RARITY_LABELS: Record<string, string> = {
  BRONZE: "Bronze",
  SILVER: "Prata",
  GOLD: "Ouro",
  GOLD_RARE: "Ouro Raro",
  TOTY: "Time do Ano",
  ICON: "Ícone",
  LEGENDARY: "Lendário",
}

export const POSITION_LABELS: Record<string, string> = {
  ENTRY: "Entry",
  RIFLER: "Rifle",
  AWPER: "AWPer",
  SUPPORT: "Suporte",
  IGL: "IGL",
  LURKER: "Lurker",
}

export const RARITY_ORDER = [
  "BRONZE",
  "SILVER",
  "GOLD",
  "GOLD_RARE",
  "TOTY",
  "ICON",
  "LEGENDARY",
] as const

export const RARITY_GRADIENTS: Record<string, string> = {
  BRONZE: "from-[var(--rarity-bronze-from)] to-[var(--rarity-bronze-to)]",
  SILVER: "from-[var(--rarity-silver-from)] to-[var(--rarity-silver-to)]",
  GOLD: "from-[var(--rarity-gold-from)] to-[var(--rarity-gold-to)]",
  GOLD_RARE: "from-[var(--rarity-gold-rare-from)] to-[var(--rarity-gold-rare-to)]",
  TOTY: "from-[var(--rarity-toty-from)] to-[var(--rarity-toty-to)]",
  ICON: "from-[var(--rarity-icon-from)] to-[var(--rarity-icon-to)]",
  LEGENDARY: "from-[var(--rarity-legendary-from)] to-[var(--rarity-legendary-to)]",
}

export const RANK_PATENTS = [
  { min: 0, label: "Recruta", icon: "shield" },
  { min: 900, label: "Soldado", icon: "shield" },
  { min: 1100, label: "Cabo", icon: "shield-check" },
  { min: 1250, label: "Sargento", icon: "shield-check" },
  { min: 1400, label: "Tenente", icon: "shield-half" },
  { min: 1550, label: "Capitão", icon: "shield-plus" },
  { min: 1700, label: "Major", icon: "crown" },
  { min: 1850, label: "Coronel", icon: "crown" },
  { min: 2000, label: "General", icon: "crown" },
  { min: 2200, label: "Lenda da Tropa", icon: "trophy" },
] as const

export function patentForElo(elo: number): { min: number; label: string; icon: string } {
  let current: { min: number; label: string; icon: string } = RANK_PATENTS[0]
  for (const p of RANK_PATENTS) {
    if (elo >= p.min) current = p
  }
  return current
}

export const STAT_LABELS: Record<string, string> = {
  aim: "AIM",
  clutch: "CLUTCH",
  support: "SUPPORT",
  movement: "MOVEMENT",
  gameSense: "GAME SENSE",
  entry: "ENTRY",
  awp: "AWP",
  communication: "COMMS",
}

export const STAT_KEYS = [
  "aim",
  "clutch",
  "support",
  "movement",
  "gameSense",
  "entry",
  "awp",
  "communication",
] as const
export type StatKey = (typeof STAT_KEYS)[number]
