import Link from "next/link"
import { ArrowRight, Crown } from "lucide-react"
import { formatDateTimeBR } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface MatchRowProps {
  matchId: string
  map: string
  scoreA: number
  scoreB: number
  playedAt: Date
  mvpNickname?: string | null
  winningTeam: "TEAM_A" | "TEAM_B" | null
  userTeam?: "TEAM_A" | "TEAM_B"
}

export function MatchRow({ matchId, map, scoreA, scoreB, playedAt, mvpNickname, winningTeam, userTeam }: MatchRowProps) {
  const userWon = userTeam && winningTeam === userTeam
  const userLost = userTeam && winningTeam && winningTeam !== userTeam
  return (
    <Link
      href={`/partidas/${matchId}`}
      className="flex items-center gap-4 px-4 py-3 rounded-lg glass hover:bg-white/[0.04] transition-colors group border border-transparent hover:border-gold-500/20"
    >
      <div className="flex flex-col items-center justify-center w-14">
        <span
          className={cn(
            "size-2 rounded-full",
            userWon ? "bg-emerald-400" : userLost ? "bg-rose-400" : "bg-muted-foreground/60"
          )}
        />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1.5">
          {userWon ? "V" : userLost ? "D" : "—"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{map.replace("de_", "").toUpperCase()}</p>
        <p className="text-[10px] text-muted-foreground">{formatDateTimeBR(playedAt)}</p>
      </div>
      <div className="flex items-center gap-2 font-display text-xl numeric">
        <span className={winningTeam === "TEAM_A" ? "text-gold-200" : "text-muted-foreground"}>
          {scoreA}
        </span>
        <span className="text-muted-foreground/60">×</span>
        <span className={winningTeam === "TEAM_B" ? "text-gold-200" : "text-muted-foreground"}>
          {scoreB}
        </span>
      </div>
      {mvpNickname && (
        <div className="hidden sm:flex items-center gap-1 text-[10px] uppercase tracking-widest text-gold-300">
          <Crown className="size-3" />
          {mvpNickname}
        </div>
      )}
      <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  )
}
