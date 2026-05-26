import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/feature/section-heading"
import { PlayerCard } from "@/components/cards/player-card"
import { fromPrismaCard } from "@/components/cards/player-card-data"
import { EditCardForm } from "./edit-card-form"

type Params = Promise<{ id: string }>

export default async function AdminEditCardPage({ params }: { params: Params }) {
  const { id } = await params
  const card = await db.card.findUnique({ where: { id }, include: { user: true } })
  if (!card) notFound()

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title={`Editar carta — ${card.user.nickname}`}
        description="Stats AIM, CLUTCH, ENTRY e AWP são derivadas automaticamente. Aqui você ajusta o resto, edição e raridade especial."
      />
      <section className="grid items-start gap-8 lg:grid-cols-[auto,1fr]">
        <div className="mx-auto lg:mx-0">
          <PlayerCard
            data={fromPrismaCard(card, {
              nickname: card.user.nickname,
              avatarUrl: card.user.avatarUrl,
            })}
            size="md"
          />
        </div>
        <Card className="w-full p-6">
          <EditCardForm
            cardId={card.id}
            initial={{
              support: card.support,
              movement: card.movement,
              gameSense: card.gameSense,
              communication: card.communication,
              edition: card.edition,
              position: card.position,
              isHolographic: card.isHolographic,
              favoriteMap: card.favoriteMap,
              favoriteWeapon: card.favoriteWeapon,
            }}
          />
        </Card>
      </section>
    </div>
  )
}
