import { notFound } from "next/navigation"
import Link from "next/link"
import { Trophy } from "lucide-react"
import { getSeasonByNumber } from "@/features/seasons/queries"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SectionHeading } from "@/components/feature/section-heading"
import { EmptyState } from "@/components/feature/empty-state"
import { formatRelativeDateBR, pickInitials, formatNumber } from "@/lib/utils"

type Params = Promise<{ number: string }>

export default async function SeasonDetailPage({ params }: { params: Params }) {
  const { number } = await params
  const num = Number(number)
  if (isNaN(num)) notFound()

  const season = await getSeasonByNumber(num)
  if (!season) notFound()

  return (
    <div className="flex flex-col gap-8">
      <section className="glass-strong rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Season #{season.number}
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-widest text-shine mt-1">
            {season.name.toUpperCase()}
          </h1>
          {season.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl">{season.description}</p>
          )}
          <div className="flex items-center gap-3 mt-4">
            <Badge>{season.status}</Badge>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Início: {formatRelativeDateBR(season.startsAt)}
            </span>
            {season.endsAt && (
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Fim: {formatRelativeDateBR(season.endsAt)}
              </span>
            )}
          </div>
        </div>
      </section>

      <Card className="p-6">
        <SectionHeading title="Leaderboard" description="Top players da temporada." />
        {season.ranks.length === 0 ? (
          <EmptyState icon={Trophy} title="Sem participantes ainda" />
        ) : (
          <ol className="flex flex-col gap-2">
            {season.ranks.map((r, idx) => (
              <li key={r.id}>
                <Link
                  href={`/jogadores/${r.user.nickname}`}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-white/[0.04] transition"
                >
                  <span className="w-8 font-display text-2xl text-gold-300 numeric text-center">
                    {r.rank || idx + 1}
                  </span>
                  <Avatar className="size-10">
                    {r.user.avatarUrl ? <AvatarImage src={r.user.avatarUrl} alt={r.user.nickname} /> : null}
                    <AvatarFallback>{pickInitials(r.user.nickname)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-display tracking-wide truncate">{r.user.nickname}</p>
                    {r.trophy && (
                      <span className="text-[10px] uppercase tracking-widest text-gold-300">{r.trophy}</span>
                    )}
                  </div>
                  <span className="font-display text-xl numeric">{formatNumber(r.elo)}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  )
}
