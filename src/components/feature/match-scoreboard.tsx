import Link from "next/link"
import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { pickInitials } from "@/lib/utils"

export interface ScoreboardRow {
  userId: string
  nickname: string
  avatarUrl?: string | null
  kills: number
  deaths: number
  assists: number
  headshots: number
  damage: number
  adr: number
  rating: number
  clutchesWon: number
  isMVP: boolean
  eloDelta: number
}

interface MatchScoreboardProps {
  teamLabel: string
  side: "TEAM_A" | "TEAM_B"
  rows: ScoreboardRow[]
  isWinner?: boolean
  score: number
}

export function MatchScoreboard({ teamLabel, rows, isWinner, score, side }: MatchScoreboardProps) {
  return (
    <div className={cn("rounded-xl glass overflow-hidden border", isWinner ? "border-gold-500/30" : "border-white/5")}>
      <header
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b border-white/5",
          isWinner ? "bg-gold-500/10" : ""
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("size-2.5 rounded-full", side === "TEAM_A" ? "bg-cyan-300" : "bg-rose-300")} />
          <span className="font-display tracking-widest text-base">{teamLabel}</span>
          {isWinner && (
            <span className="ml-2 text-[10px] uppercase tracking-widest text-gold-300 inline-flex items-center gap-1">
              <Crown className="size-3" /> Vencedor
            </span>
          )}
        </div>
        <span className="font-display text-3xl numeric">{score}</span>
      </header>

      <table className="w-full text-sm">
        <thead className="border-b border-white/5">
          <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
            <th className="text-left px-4 py-2 w-1/3">Player</th>
            <th className="px-2 py-2">K</th>
            <th className="px-2 py-2">D</th>
            <th className="px-2 py-2">A</th>
            <th className="px-2 py-2">HS</th>
            <th className="px-2 py-2">ADR</th>
            <th className="px-2 py-2">RTG</th>
            <th className="px-2 py-2 text-right">±</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.userId} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
              <td className="px-4 py-2.5">
                <Link href={`/jogadores/${r.nickname}`} className="flex items-center gap-2">
                  <Avatar className="size-7">
                    {r.avatarUrl ? <AvatarImage src={r.avatarUrl} alt={r.nickname} /> : null}
                    <AvatarFallback className="text-[9px]">{pickInitials(r.nickname)}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-medium truncate">{r.nickname}</span>
                    {r.isMVP && (
                      <span className="text-[9px] uppercase tracking-widest text-gold-300">MVP</span>
                    )}
                  </div>
                </Link>
              </td>
              <td className="px-2 py-2.5 text-center numeric">{r.kills}</td>
              <td className="px-2 py-2.5 text-center numeric text-muted-foreground">{r.deaths}</td>
              <td className="px-2 py-2.5 text-center numeric">{r.assists}</td>
              <td className="px-2 py-2.5 text-center numeric">{r.headshots}</td>
              <td className="px-2 py-2.5 text-center numeric">{Math.round(r.adr)}</td>
              <td className={cn("px-2 py-2.5 text-center numeric font-semibold", r.rating >= 1 ? "text-gold-200" : "text-rose-300")}>
                {r.rating.toFixed(2)}
              </td>
              <td className={cn("px-2 py-2.5 text-right numeric", r.eloDelta >= 0 ? "text-emerald-300" : "text-rose-300")}>
                {r.eloDelta >= 0 ? "+" : ""}
                {r.eloDelta}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
