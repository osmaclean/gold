import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayerCard, fromPrismaCard } from "@/components/cards/player-card"
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
      <section className="grid lg:grid-cols-[auto,1fr] gap-10 items-start">
        <PlayerCard
          data={fromPrismaCard(card, { nickname: card.user.nickname, avatarUrl: card.user.avatarUrl })}
          size="lg"
        />
        <div className="flex flex-col gap-5">
          <Link href={`/jogadores/${card.user.nickname}`} className="text-xs uppercase tracking-widest text-gold-300 hover:underline">
            ← perfil de {card.user.nickname}
          </Link>
          <h1 className="font-display text-5xl tracking-widest text-shine">{card.user.nickname.toUpperCase()}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge>{RARITY_LABELS[card.rarity]}</Badge>
            {card.edition !== "base" && <Badge variant="secondary">{card.edition.toUpperCase()}</Badge>}
            {card.isHolographic && <Badge variant="success">Holográfica</Badge>}
            <Badge variant="outline">v{card.version}</Badge>
          </div>
          <Card className="p-6 grid grid-cols-2 gap-x-6 gap-y-4 max-w-xl">
            {STAT_KEYS.map((k) => (
              <StatBar key={k} label={STAT_LABELS[k]} value={card[k]} variant="gold" />
            ))}
          </Card>
        </div>
      </section>

      {card.snapshots.length > 0 && (
        <section>
          <SectionHeading title="Evolução" description="Snapshots da carta ao longo do tempo." />
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {card.snapshots.map((s) => (
              <div key={s.id} className="glass rounded-lg p-4 flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.reason}</span>
                <span className="font-display text-2xl numeric">{s.overall}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(s.createdAt).toLocaleString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
