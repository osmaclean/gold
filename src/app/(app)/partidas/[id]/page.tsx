import { notFound } from "next/navigation"
import { Crown, MapPin } from "lucide-react"
import { getMatchById } from "@/features/matches/queries"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MatchScoreboard, type ScoreboardRow } from "@/components/feature/match-scoreboard"
import { SectionHeading } from "@/components/feature/section-heading"
import { formatDateTimeBR } from "@/lib/utils"
import { cn } from "@/lib/utils"

type Params = Promise<{ id: string }>

export default async function MatchDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const match = await getMatchById(id)
  if (!match) notFound()

  const teamA = match.players
    .filter((p) => p.team === "TEAM_A")
    .map<ScoreboardRow>((p) => ({
      userId: p.userId,
      nickname: p.user.nickname,
      avatarUrl: p.user.avatarUrl,
      kills: p.kills,
      deaths: p.deaths,
      assists: p.assists,
      headshots: p.headshots,
      damage: p.damage,
      adr: p.adr,
      rating: p.rating,
      clutchesWon: p.clutchesWon,
      isMVP: p.isMVP,
      eloDelta: p.eloDelta,
    }))
  const teamB = match.players
    .filter((p) => p.team === "TEAM_B")
    .map<ScoreboardRow>((p) => ({
      userId: p.userId,
      nickname: p.user.nickname,
      avatarUrl: p.user.avatarUrl,
      kills: p.kills,
      deaths: p.deaths,
      assists: p.assists,
      headshots: p.headshots,
      damage: p.damage,
      adr: p.adr,
      rating: p.rating,
      clutchesWon: p.clutchesWon,
      isMVP: p.isMVP,
      eloDelta: p.eloDelta,
    }))

  return (
    <div className="flex flex-col gap-8">
      <section className="glass-strong rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            <MapPin className="size-3.5 text-gold-300" />
            {match.map.replace("de_", "").toUpperCase()}
            <span className="opacity-50">·</span>
            <span>{formatDateTimeBR(match.playedAt)}</span>
            {match.season && (
              <>
                <span className="opacity-50">·</span>
                <span>{match.season.name}</span>
              </>
            )}
            {match.mode && (
              <>
                <span className="opacity-50">·</span>
                <Badge variant="secondary">{match.mode}</Badge>
              </>
            )}
          </div>

          <div className="mt-4 grid grid-cols-[1fr,auto,1fr] gap-6 items-center">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest text-cyan-300">Team A</p>
              <p className={cn(
                "font-display text-7xl numeric",
                match.winningTeam === "TEAM_A" ? "text-shine" : "text-muted-foreground/70"
              )}>
                {match.scoreTeamA}
              </p>
            </div>
            <div className="font-display text-3xl text-muted-foreground">×</div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-rose-300">Team B</p>
              <p className={cn(
                "font-display text-7xl numeric",
                match.winningTeam === "TEAM_B" ? "text-shine" : "text-muted-foreground/70"
              )}>
                {match.scoreTeamB}
              </p>
            </div>
          </div>

          {match.mvp && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-gold-300">
              <Crown className="size-4" />
              MVP: {match.mvp.nickname}
            </div>
          )}
        </div>
      </section>

      {/* Scoreboards */}
      <section className="grid lg:grid-cols-2 gap-4">
        <MatchScoreboard
          teamLabel="Team A"
          side="TEAM_A"
          rows={teamA}
          isWinner={match.winningTeam === "TEAM_A"}
          score={match.scoreTeamA}
        />
        <MatchScoreboard
          teamLabel="Team B"
          side="TEAM_B"
          rows={teamB}
          isWinner={match.winningTeam === "TEAM_B"}
          score={match.scoreTeamB}
        />
      </section>

      {match.highlights && (
        <Card className="p-6">
          <SectionHeading title="Destaque" />
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{match.highlights}</p>
        </Card>
      )}

      {match.rounds.length > 0 && (
        <Card className="p-6">
          <SectionHeading title="Timeline" description="Resultado rodada a rodada." />
          <div className="flex flex-wrap gap-1.5">
            {match.rounds.map((r) => (
              <div
                key={r.id}
                className={cn(
                  "size-7 rounded text-[9px] font-semibold grid place-items-center border",
                  r.winner === "TEAM_A"
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-200"
                    : "bg-rose-500/20 border-rose-500/40 text-rose-200"
                )}
                title={`Round ${r.number} · ${r.type}`}
              >
                {r.number}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
