import Link from "next/link"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/feature/section-heading"
import { EmptyState } from "@/components/feature/empty-state"
import { PlayerCard, fromPrismaCard } from "@/components/cards/player-card"
import { IdCard } from "lucide-react"

export const metadata = { title: "Cartas" }

export default async function CardsPage() {
  const cards = await db.card.findMany({
    include: { user: true },
    orderBy: { overall: "desc" },
  })

  if (cards.length === 0) {
    return (
      <Card>
        <EmptyState icon={IdCard} title="Sem cartas ainda" description="Quando os players entrarem, as cartas aparecem aqui." />
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Coleção da Tropa" description="Todas as cartas no plantel — ordenadas por overall." />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {cards.map((c) => (
          <Link key={c.id} href={`/cartas/${c.id}`}>
            <PlayerCard
              data={fromPrismaCard(c, { nickname: c.user.nickname, avatarUrl: c.user.avatarUrl })}
              size="sm"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
