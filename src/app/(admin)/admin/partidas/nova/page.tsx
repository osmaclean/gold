import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/feature/section-heading"
import { NewMatchForm } from "./new-match-form"

export const metadata = { title: "Admin · Nova partida" }

export default async function NewMatchPage() {
  const [players, seasons] = await Promise.all([
    db.user.findMany({ where: { isActive: true }, orderBy: { nickname: "asc" }, select: { id: true, nickname: true, elo: true, avatarUrl: true } }),
    db.season.findMany({ where: { status: { in: ["ACTIVE", "UPCOMING"] } }, orderBy: { number: "desc" } }),
  ])

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Registrar partida"
        description="Preencha os dados completos da partida. As stats agregadas, elo e cartas são atualizados automaticamente."
      />
      <Card className="p-6">
        <NewMatchForm players={players} seasons={seasons} />
      </Card>
    </div>
  )
}
