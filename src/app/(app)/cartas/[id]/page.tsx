import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayerCard } from "@/components/cards/player-card"
import { fromPrismaCard } from "@/components/cards/player-card-data"
import { SectionHeading } from "@/components/feature/section-heading"
import { StatBar } from "@/components/ui/stat-bar"
import { RARITY_LABELS, STAT_KEYS, STAT_LABELS } from "@/lib/constants"

type Params = Promise<{ id: string }>

export default async function CardDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const card = await db.card.findUnique({
    where: { id },
    include: { user: true, snapshots: { orderBy: { createdAt: "desc" }, take: 8 } },
  })
  if (!card) notFound()

  return (
    <div className="flex flex-col gap-8">
      <section className="grid items-start gap-10 lg:grid-cols-[auto,1fr]">
        <PlayerCard
          data={fromPrismaCard(card, {
            nickname: card.user.nickname,
            avatarUrl: card.user.avatarUrl,
          })}
          size="lg"
        />
        <div className="flex flex-col gap-5">
          <Link
            href={`/jogadores/${card.user.nickname}`}
            className="text-xs tracking-widest text-gold-300 uppercase hover:underline"
          >
            ← perfil de {card.user.nickname}
          </Link>
          <h1 className="text-shine font-display text-5xl tracking-widest">
            {card.user.nickname.toUpperCase()}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{RARITY_LABELS[card.rarity]}</Badge>
            {card.edition !== "base" && (
              <Badge variant="secondary">{card.edition.toUpperCase()}</Badge>
            )}
            {card.isHolographic && <Badge variant="success">Holográfica</Badge>}
            <Badge variant="outline">v{card.version}</Badge>
          </div>
          <Card className="grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 p-6">
            {STAT_KEYS.map((k) => (
              <StatBar key={k} label={STAT_LABELS[k]} value={card[k]} variant="gold" />
            ))}
          </Card>
        </div>
      </section>

      {card.snapshots.length > 0 && (
        <section>
          <SectionHeading title="Evolução" description="Snapshots da carta ao longo do tempo." />
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {card.snapshots.map((s) => (
              <div key={s.id} className="glass flex flex-col gap-1 rounded-lg p-4">
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                  {s.reason}
                </span>
                <span className="numeric font-display text-2xl">{s.overall}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(s.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
