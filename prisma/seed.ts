import { PrismaClient, Rarity } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  console.log("Iniciando seed…")

  // ─── Season 1 ───────────────────────────────────────
  const season1 = await db.season.upsert({
    where: { number: 1 },
    update: {},
    create: {
      number: 1,
      name: "Season 1 — Origens",
      description: "A primeira temporada da Tropa da Gold. Quem inaugura, leva o troféu.",
      status: "ACTIVE",
      startsAt: new Date(),
    },
  })
  console.log(`Season criada: ${season1.name}`)

  // ─── Achievements base ──────────────────────────────
  const achievements = [
    {
      slug: "first-blood",
      name: "First Blood",
      description: "Conseguiu seu primeiro opening kill.",
      icon: "swords",
      rarity: Rarity.BRONZE,
      xpReward: 30,
      criteria: { type: "opening_kills", threshold: 1 },
    },
    {
      slug: "clutch-king",
      name: "Clutch King",
      description: "Venceu 10 rounds de clutch.",
      icon: "crown",
      rarity: Rarity.GOLD,
      xpReward: 200,
      criteria: { type: "clutches_won", threshold: 10 },
    },
    {
      slug: "ace-master",
      name: "Ace Master",
      description: "Fez 3 aces (5 kills em um round).",
      icon: "flame",
      rarity: Rarity.GOLD,
      xpReward: 250,
      criteria: { type: "aces", threshold: 3 },
    },
    {
      slug: "hs-machine",
      name: "HS Machine",
      description: "Headshot rate superior a 60% em 5 partidas.",
      icon: "target",
      rarity: Rarity.GOLD,
      xpReward: 200,
      criteria: { type: "hs_rate", threshold: 0.6, minMatches: 5 },
    },
    {
      slug: "flashbang-terrorist",
      name: "Flashbang Terrorist",
      description: "Conseguiu 25 flash assists.",
      icon: "zap",
      rarity: Rarity.SILVER,
      xpReward: 120,
      criteria: { type: "flash_assists", threshold: 25 },
    },
    {
      slug: "smoke-criminal",
      name: "Smoke Criminal",
      description: "Causou 1000 de utility damage.",
      icon: "cloud",
      rarity: Rarity.SILVER,
      xpReward: 120,
      criteria: { type: "utility_damage", threshold: 1000 },
    },
    {
      slug: "support-god",
      name: "Support God",
      description: "Alcançou 100 assists.",
      icon: "hand-helping",
      rarity: Rarity.GOLD,
      xpReward: 200,
      criteria: { type: "assists", threshold: 100 },
    },
    {
      slug: "mvp-streak",
      name: "MVP em Série",
      description: "Foi MVP em 3 partidas seguidas.",
      icon: "trophy",
      rarity: Rarity.GOLD_RARE,
      xpReward: 350,
      criteria: { type: "mvp_streak", threshold: 3 },
    },
    {
      slug: "win-streak-5",
      name: "Embalado",
      description: "Venceu 5 partidas seguidas.",
      icon: "trending-up",
      rarity: Rarity.GOLD,
      xpReward: 180,
      criteria: { type: "win_streak", threshold: 5 },
    },
    {
      slug: "awp-king",
      name: "Rei da AWP",
      description: "100 kills com AWP.",
      icon: "crosshair",
      rarity: Rarity.GOLD,
      xpReward: 200,
      criteria: { type: "awp_kills", threshold: 100 },
    },
    {
      slug: "tropa-veteran",
      name: "Veterano da Tropa",
      description: "Jogou 50 partidas pela Tropa da Gold.",
      icon: "shield",
      rarity: Rarity.GOLD,
      xpReward: 200,
      criteria: { type: "matches_played", threshold: 50 },
    },
    {
      slug: "tropa-legend",
      name: "Lenda da Tropa",
      description: "Alcançou patente Lenda (2200+ elo).",
      icon: "star",
      rarity: Rarity.LEGENDARY,
      xpReward: 1000,
      criteria: { type: "elo", threshold: 2200 },
    },
  ]

  for (const a of achievements) {
    await db.achievement.upsert({
      where: { slug: a.slug },
      update: {
        name: a.name,
        description: a.description,
        icon: a.icon,
        rarity: a.rarity,
        xpReward: a.xpReward,
        criteria: a.criteria,
      },
      create: a,
    })
  }
  console.log(`${achievements.length} achievements seedadas`)

  // ─── Badges base ────────────────────────────────────
  const badges = [
    { slug: "founder", name: "Fundador", description: "Membro fundador da Tropa da Gold.", icon: "crown", color: "#D4AF37" },
    { slug: "champion-s1", name: "Campeão Season 1", description: "Venceu a primeira temporada.", icon: "trophy", color: "#FFC857" },
    { slug: "gold-elite", name: "Elite Ouro", description: "Atingiu carta Ouro Raro.", icon: "shield-check", color: "#E0B526" },
    { slug: "iceman", name: "Iceman", description: "Sangue frio em clutches.", icon: "snowflake", color: "#61F1FF" },
  ]
  for (const b of badges) {
    await db.badge.upsert({ where: { slug: b.slug }, update: b, create: b })
  }
  console.log(`${badges.length} badges seedadas`)

  // ─── Admins fixos (placeholder) ─────────────────────
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (adminEmails.length > 0) {
    console.log(`Admins definidos por env: ${adminEmails.join(", ")} (serão promovidos no primeiro login)`)
  } else {
    console.log("Nenhum ADMIN_EMAILS definido — promoção será manual via DB.")
  }

  console.log("Seed finalizado.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
