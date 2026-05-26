import Link from "next/link"
import { Trophy } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/feature/section-heading"
import { EmptyState } from "@/components/feature/empty-state"
import { getAllSeasons } from "@/features/seasons/queries"
import { formatRelativeDateBR } from "@/lib/utils"

export const metadata = { title: "Seasons" }

const statusVariant = {
  ACTIVE: "success",
  UPCOMING: "default",
  FINISHED: "secondary",
} as const

export default async function SeasonsPage() {
  const seasons = await getAllSeasons()

  if (seasons.length === 0) {
    return (
      <Card>
        <EmptyState icon={Trophy} title="Sem seasons" description="Aguarde o admin abrir a primeira temporada." />
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Seasons" description="Temporadas da Tropa da Gold." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {seasons.map((s) => (
          <Link
            key={s.id}
            href={`/seasons/${s.number}`}
            className="glass rounded-xl p-6 relative overflow-hidden hover:border-gold-500/30 border border-white/5 transition-colors"
          >
            <div className="absolute -top-16 -right-16 size-40 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Season #{s.number}
              </p>
              <h3 className="font-display text-3xl tracking-widest text-shine mt-1">
                {s.name.toUpperCase()}
              </h3>
              {s.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{s.description}</p>}
              <div className="flex items-center gap-2 mt-4">
                <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  desde {formatRelativeDateBR(s.startsAt)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
