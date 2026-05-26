import Link from "next/link"
import { Crown, Flame, Sparkles, Swords, TrendingUp, Trophy } from "lucide-react"
import { requireUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { KpiCard } from "@/components/feature/kpi-card"
import { SectionHeading } from "@/components/feature/section-heading"
import { EmptyState } from "@/components/feature/empty-state"
import { MatchRow } from "@/components/feature/match-row"
import { PlayerCard, fromPrismaCard } from "@/components/cards/player-card"
import { LevelBar } from "@/components/cards/level-bar"
import { RankBadge } from "@/components/cards/rank-badge"
import { EloLineChart } from "@/components/charts/elo-line-chart"
import { getRecentMatches } from "@/features/matches/queries"
import { getGlobalRanking, getMvpOfTheWeek } from "@/features/players/queries"
import { formatPercent, formatNumber, pickInitials, safeDivide } from "@/lib/utils"

export const metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const user = await requireUser()

  const [stats, card, ranking, recentMatches, mvpWeek, userSnapshots] = await Promise.all([
    db.playerStats.findUnique({ where: { userId: user.id } }),
    db.card.findUnique({ where: { userId: user.id } }),
    getGlobalRanking(),
    getRecentMatches(6),
    getMvpOfTheWeek(),
    db.matchPlayer.findMany({
      where: { userId: user.id },
      take: 20,
      orderBy: { match: { playedAt: "asc" } },
      include: { match: { select: { playedAt: true } } },
    }),
  ])

  const kd = stats ? safeDivide(stats.kills, Math.max(stats.deaths, 1)) : 0
  const hsRate = stats ? safeDivide(stats.headshots, Math.max(stats.kills, 1)) : 0
  const winrate = stats ? safeDivide(stats.wins, Math.max(stats.matchesPlayed, 1)) : 0
  const clutchRate = stats ? safeDivide(stats.clutchesWon, Math.max(stats.clutchesAttempted, 1)) : 0

  let runningElo = 1000
  const eloPoints = userSnapshots.map((s) => {
    runningElo += s.eloDelta
    return {
      date: new Date(s.match.playedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
      elo: Math.max(0, runningElo),
    }
  })

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section className="grid lg:grid-cols-[1fr,auto] gap-6 items-stretch">
        <Card className="p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 size-64 rounded-full bg-gold-500/20 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Sparkles className="size-3.5 text-gold-300" />
            Bem-vindo de volta, soldado
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-widest mt-2 text-shine">
            {user.nickname.toUpperCase()}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            {user.bio ??
              "Acompanhe ranking, partidas, conquistas e a evolução da sua carta na Tropa da Gold."}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <RankBadge elo={user.elo} />
            <Badge variant="outline">{stats?.matchesPlayed ?? 0} partidas</Badge>
            <Badge variant="success">{stats?.wins ?? 0} vitórias</Badge>
          </div>
          <div className="mt-6 max-w-md">
            <LevelBar totalXp={user.xp} />
          </div>
        </Card>

        {card && (
          <div className="hidden lg:block">
            <PlayerCard
              data={fromPrismaCard(card, { nickname: user.nickname, avatarUrl: user.avatarUrl })}
              size="md"
            />
          </div>
        )}
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="K/D" value={kd.toFixed(2)} icon={Swords} accent="gold" />
        <KpiCard label="HS%" value={formatPercent(hsRate, 0)} icon={Crown} accent="cyan" />
        <KpiCard label="Winrate" value={formatPercent(winrate, 0)} icon={TrendingUp} accent="green" />
        <KpiCard
          label="Clutch %"
          value={formatPercent(clutchRate, 0)}
          icon={Flame}
          accent={clutchRate >= 0.5 ? "gold" : "red"}
        />
      </section>

      {/* Charts + MVP */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <SectionHeading title="Evolução do Elo" description="Sua jornada de ranking." />
          <EloLineChart data={eloPoints} />
        </Card>

        <Card className="p-6">
          <SectionHeading title="MVP da Semana" />
          {mvpWeek ? (
            <Link href={`/jogadores/${mvpWeek.nickname}`} className="flex items-center gap-4 group">
              <Avatar className="size-14 ring-2 ring-gold-500/40 group-hover:ring-gold-300">
                {mvpWeek.avatarUrl ? <AvatarImage src={mvpWeek.avatarUrl} alt={mvpWeek.nickname} /> : null}
                <AvatarFallback>{pickInitials(mvpWeek.nickname)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-display text-xl tracking-wide">{mvpWeek.nickname.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground">{mvpWeek.card?.overall ?? "—"} OVERALL</p>
                <Badge variant="default" className="mt-2">
                  <Crown className="size-3" /> Em chamas
                </Badge>
              </div>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">Sem MVP da semana ainda.</p>
          )}
        </Card>
      </section>

      {/* Ranking + Últimas partidas */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <SectionHeading
            title="Top 10"
            description="Ranking global"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/jogadores">Ver todos</Link>
              </Button>
            }
          />
          {ranking.length === 0 ? (
            <EmptyState icon={Trophy} title="Ranking vazio" description="Joguem a primeira partida pra abrir o placar." />
          ) : (
            <ol className="flex flex-col gap-2">
              {ranking.slice(0, 10).map((r, idx) => {
                const player = "user" in r ? r.user : r
                const elo = "user" in r ? r.elo : player.elo
                return (
                  <li key={player.id}>
                    <Link
                      href={`/jogadores/${player.nickname}`}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="w-6 font-display text-lg text-gold-300 text-center numeric">
                        {idx + 1}
                      </span>
                      <Avatar className="size-8">
                        {player.avatarUrl ? <AvatarImage src={player.avatarUrl} alt={player.nickname} /> : null}
                        <AvatarFallback className="text-[9px]">{pickInitials(player.nickname)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{player.nickname}</p>
                      </div>
                      <span className="text-xs numeric text-muted-foreground">{formatNumber(elo)}</span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          )}
        </Card>

        <Card className="p-6 lg:col-span-2">
          <SectionHeading
            title="Últimas partidas"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/partidas">Histórico completo</Link>
              </Button>
            }
          />
          {recentMatches.length === 0 ? (
            <EmptyState
              icon={Swords}
              title="Sem partidas registradas"
              description="Quando um admin registrar a primeira partida, ela aparece aqui."
              action={
                user.role === "ADMIN" ? (
                  <Button asChild>
                    <Link href="/admin/partidas/nova">Registrar partida</Link>
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="flex flex-col gap-2">
              {recentMatches.map((m) => {
                const userEntry = m.players.find((p) => p.userId === user.id)
                return (
                  <MatchRow
                    key={m.id}
                    matchId={m.id}
                    map={m.map}
                    scoreA={m.scoreTeamA}
                    scoreB={m.scoreTeamB}
                    playedAt={m.playedAt}
                    mvpNickname={m.mvp?.nickname ?? null}
                    winningTeam={m.winningTeam}
                    userTeam={userEntry?.team}
                  />
                )
              })}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}
