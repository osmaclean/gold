import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/feature/section-heading"
import { EmptyState } from "@/components/feature/empty-state"
import { Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatRelativeDateBR } from "@/lib/utils"

export const metadata = { title: "Admin · Eventos" }

export default async function AdminEventsPage() {
  const events = await db.event.findMany({ orderBy: { startsAt: "desc" } })

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Eventos" description="Torneios e copas — em breve." />
      {events.length === 0 ? (
        <Card>
          <EmptyState
            icon={Trophy}
            title="Sem eventos ainda"
            description="A criação de torneios é parte da próxima versão."
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((e) => (
            <Card key={e.id} className="p-6">
              <Badge>{e.status}</Badge>
              <h3 className="font-display text-2xl mt-2">{e.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{formatRelativeDateBR(e.startsAt)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
