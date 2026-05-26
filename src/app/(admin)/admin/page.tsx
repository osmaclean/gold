import Link from "next/link"
import { Award, Calendar, Flame, IdCard, Shield, Trophy, Users } from "lucide-react"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { KpiCard } from "@/components/feature/kpi-card"
import { SectionHeading } from "@/components/feature/section-heading"
import { formatDateTimeBR } from "@/lib/utils"

export const metadata = { title: "Admin · Resumo" }

export default async function AdminDashboardPage() {
  const [playerCount, matchCount, seasonActive, recentMatches, lastSnapshot] = await Promise.all([
    db.user.count({ where: { isActive: true } }),
    db.match.count(),
    db.season.findFirst({ where: { status: "ACTIVE" } }),
    db.match.findMany({ take: 5, orderBy: { playedAt: "desc" }, include: { mvp: true } }),
    db.cardSnapshot.findFirst({
      orderBy: { createdAt: "desc" },
      include: { card: { include: { user: true } } },
    }),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-2 text-[11px] tracking-widest text-gold-300 uppercase">
          <Shield className="size-3.5" /> Painel Admin
        </div>
        <h1 className="text-shine mt-2 font-display text-4xl tracking-widest md:text-5xl">
          CONTROLE DA TROPA
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie partidas, jogadores, cartas e temporadas.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Players ativos" value={playerCount} icon={<Users />} accent="gold" />
        <KpiCard label="Partidas" value={matchCount} icon={<Flame />} accent="cyan" />
        <KpiCard
          label="Season ativa"
          value={seasonActive ? `#${seasonActive.number}` : "—"}
          icon={<Trophy />}
          accent="green"
        />
        <KpiCard
          label="Último update"
          value={lastSnapshot ? lastSnapshot.card.user.nickname : "—"}
          icon={<IdCard />}
          accent="gold"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <SectionHeading
            title="Atalhos"
            action={
              <Button asChild>
                <Link href="/admin/partidas/nova">
                  <Flame className="size-4" /> Nova partida
                </Link>
              </Button>
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <AdminQuickLink href="/admin/jogadores" icon={Users} label="Jogadores" />
            <AdminQuickLink href="/admin/cartas" icon={IdCard} label="Cartas" />
            <AdminQuickLink href="/admin/seasons" icon={Calendar} label="Seasons" />
            <AdminQuickLink href="/admin/conquistas" icon={Award} label="Conquistas" />
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeading
            title="Últimas partidas registradas"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/partidas">Ver todas</Link>
              </Button>
            }
          />
          {recentMatches.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma partida ainda.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {recentMatches.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-md bg-white/[0.03] p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{m.map.replace("de_", "").toUpperCase()}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDateTimeBR(m.playedAt)}
                    </p>
                  </div>
                  <div className="numeric font-display text-xl">
                    {m.scoreTeamA} × {m.scoreTeamB}
                  </div>
                  {m.validated ? (
                    <Badge variant="success">Validada</Badge>
                  ) : (
                    <Badge variant="outline">Pendente</Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  )
}

function AdminQuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: typeof Users
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-4 transition-colors hover:border-gold-500/30 hover:bg-white/[0.06]"
    >
      <span className="grid size-9 place-items-center rounded-md bg-gold-500/10 text-gold-300">
        <Icon className="size-4" />
      </span>
      <span className="font-display tracking-widest">{label.toUpperCase()}</span>
    </Link>
  )
}
