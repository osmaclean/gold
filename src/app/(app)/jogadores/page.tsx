import Link from "next/link"
import { Users } from "lucide-react"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/feature/section-heading"
import { EmptyState } from "@/components/feature/empty-state"
import { RankBadge } from "@/components/cards/rank-badge"
import { RARITY_LABELS } from "@/lib/constants"
import { pickInitials, safeDivide, formatPercent } from "@/lib/utils"

export const metadata = { title: "Jogadores" }

export default async function PlayersPage() {
  const players = await db.user.findMany({
    where: { isActive: true },
    include: { stats: true, card: true },
    orderBy: { elo: "desc" },
  })

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Tropa" description="Todos os jogadores ativos." />
      {players.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="Ninguém ainda" description="Convide a tropa pra entrar." />
        </Card>
      ) : (
        <div className="grid gap-3">
          {players.map((p, idx) => {
            const winrate = safeDivide(p.stats?.wins ?? 0, Math.max(p.stats?.matchesPlayed ?? 0, 1))
            return (
              <Link
                key={p.id}
                href={`/jogadores/${p.nickname}`}
                className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/[0.05] hover:border-gold-500/20 border border-transparent transition-colors"
              >
                <span className="w-8 font-display text-2xl text-gold-300 numeric text-center">
                  {idx + 1}
                </span>
                <Avatar className="size-12 ring-2 ring-gold-500/30">
                  {p.avatarUrl ? <AvatarImage src={p.avatarUrl} alt={p.nickname} /> : null}
                  <AvatarFallback>{pickInitials(p.nickname)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg tracking-wider truncate">
                      {p.nickname.toUpperCase()}
                    </h3>
                    {p.role === "ADMIN" && <Badge variant="default">Admin</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {p.bio ?? `${RARITY_LABELS[p.card?.rarity ?? "BRONZE"]} · Overall ${p.card?.overall ?? 60}`}
                  </p>
                </div>
                <div className="hidden md:flex flex-col items-end gap-1">
                  <RankBadge elo={p.elo} size="sm" />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {p.stats?.matchesPlayed ?? 0} partidas · {formatPercent(winrate, 0)} WR
                  </span>
                </div>
                <div className="hidden lg:block font-display text-3xl text-gold-200 numeric w-12 text-right">
                  {p.card?.overall ?? "—"}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
