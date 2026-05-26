import { notFound } from "next/navigation"
import Link from "next/link"
import { Crosshair, MapPin, MessageSquare, Trophy } from "lucide-react"
import { getPlayerByNickname } from "@/features/players/queries"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlayerCard, fromPrismaCard } from "@/components/cards/player-card"
import { LevelBar } from "@/components/cards/level-bar"
import { RankBadge } from "@/components/cards/rank-badge"
import { AchievementCard } from "@/components/cards/achievement-card"
import { SectionHeading } from "@/components/feature/section-heading"
import { EmptyState } from "@/components/feature/empty-state"
import { MatchRow } from "@/components/feature/match-row"
import { StatBar } from "@/components/ui/stat-bar"
import { formatPercent, safeDivide } from "@/lib/utils"
import { STAT_KEYS, STAT_LABELS } from "@/lib/constants"

type Params = Promise<{ nick: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { nick } = await params
  return { title: nick }
}

export default async function PlayerProfilePage({ params }: { params: Params }) {
  const { nick } = await params
  const player = await getPlayerByNickname(nick)
  if (!player) notFound()

  const stats = player.stats
  const card = player.card
  const winrate = stats ? safeDivide(stats.wins, Math.max(stats.matchesPlayed, 1)) : 0
  const hsRate = stats ? safeDivide(stats.headshots, Math.max(stats.kills, 1)) : 0
  const clutchRate = stats ? safeDivide(stats.clutchesWon, Math.max(stats.clutchesAttempted, 1)) : 0
  const kd = stats ? safeDivide(stats.kills, Math.max(stats.deaths, 1)) : 0

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section className="grid lg:grid-cols-[auto,1fr] gap-8 items-start">
        {card && (
          <div className="mx-auto lg:mx-0">
            <PlayerCard
              data={fromPrismaCard(card, { nickname: player.nickname, avatarUrl: player.avatarUrl })}
              size="lg"
            />
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Perfil</p>
            <h1 className="font-display text-4xl md:text-6xl tracking-widest text-shine mt-1">
              {player.nickname.toUpperCase()}
            </h1>
            {player.bio && <p className="text-muted-foreground mt-2 max-w-2xl">{player.bio}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <RankBadge elo={player.elo} size="md" />
            {player.role === "ADMIN" && <Badge>Admin</Badge>}
            {card?.favoriteMap && (
              <Badge variant="secondary">
                <MapPin className="size-3" /> {card.favoriteMap.replace("de_", "").toUpperCase()}
              </Badge>
            )}
            {card?.favoriteWeapon && (
              <Badge variant="secondary">
                <Crosshair className="size-3" /> {card.favoriteWeapon}
              </Badge>
            )}
          </div>

          <div className="max-w-md">
            <LevelBar totalXp={player.xp} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="K/D" value={kd.toFixed(2)} />
            <Stat label="HS%" value={formatPercent(hsRate, 0)} />
            <Stat label="Winrate" value={formatPercent(winrate, 0)} />
            <Stat label="Clutch %" value={formatPercent(clutchRate, 0)} />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="history">Partidas</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <Card className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <SectionHeading title="Atributos" description="Stats visuais da carta." />
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {card &&
                  STAT_KEYS.map((k) => (
                    <StatBar key={k} label={STAT_LABELS[k]} value={card[k]} variant="gold" />
                  ))}
              </div>
            </div>
            <div>
              <SectionHeading title="Lifetime" description="Acumulado em todas as partidas." />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <NumberCell label="Partidas" value={stats?.matchesPlayed ?? 0} />
                <NumberCell label="Vitórias" value={stats?.wins ?? 0} />
                <NumberCell label="Derrotas" value={stats?.losses ?? 0} />
                <NumberCell label="Kills" value={stats?.kills ?? 0} />
                <NumberCell label="Deaths" value={stats?.deaths ?? 0} />
                <NumberCell label="Headshots" value={stats?.headshots ?? 0} />
                <NumberCell label="Clutches" value={`${stats?.clutchesWon ?? 0}/${stats?.clutchesAttempted ?? 0}`} />
                <NumberCell label="MVPs" value={stats?.mvps ?? 0} />
                <NumberCell label="Win streak" value={stats?.longestWinStreak ?? 0} />
                <NumberCell label="AWP kills" value={stats?.awpKills ?? 0} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-4">
            <SectionHeading title="Últimas partidas" />
            {player.matchEntries.length === 0 ? (
              <EmptyState icon={MessageSquare} title="Sem partidas" description="Esse jogador ainda não disputou." />
            ) : (
              <div className="flex flex-col gap-2">
                {player.matchEntries.map((e) => (
                  <MatchRow
                    key={e.id}
                    matchId={e.matchId}
                    map={e.match.map}
                    scoreA={e.match.scoreTeamA}
                    scoreB={e.match.scoreTeamB}
                    playedAt={e.match.playedAt}
                    mvpNickname={e.match.mvp?.nickname ?? null}
                    winningTeam={e.match.winningTeam}
                    userTeam={e.team}
                  />
                ))}
                <div className="pt-3 text-center">
                  <Link href="/partidas" className="text-xs text-gold-300 hover:underline">
                    Ver histórico completo →
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="p-6">
            <SectionHeading title="Conquistas desbloqueadas" />
            {player.achievements.length === 0 ? (
              <EmptyState icon={Trophy} title="Nenhuma conquista ainda" description="Continue jogando!" />
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {player.achievements.map((a) => (
                  <AchievementCard
                    key={a.id}
                    achievement={a.achievement}
                    unlocked
                    unlockedAt={a.unlockedAt}
                  />
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass p-3 rounded-lg">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-display text-2xl numeric mt-1">{value}</p>
    </div>
  )
}

function NumberCell({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-white/[0.03]">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-display text-lg numeric">{value}</span>
    </div>
  )
}
