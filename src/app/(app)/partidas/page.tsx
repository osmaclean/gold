import Link from "next/link"
import { Flame, Swords } from "lucide-react"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/feature/section-heading"
import { EmptyState } from "@/components/feature/empty-state"
import { MatchRow } from "@/components/feature/match-row"
import { requireUser } from "@/lib/auth"

export const metadata = { title: "Partidas" }

export default async function MatchesPage() {
  const user = await requireUser()
  const matches = await db.match.findMany({
    take: 50,
    orderBy: { playedAt: "desc" },
    include: { mvp: true, players: true },
  })

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Partidas"
        description="Histórico completo de jogos disputados."
        action={
          user.role === "ADMIN" ? (
            <Button asChild>
              <Link href="/admin/partidas/nova">
                <Flame className="size-4" /> Registrar partida
              </Link>
            </Button>
          ) : undefined
        }
      />
      {matches.length === 0 ? (
        <Card>
          <EmptyState
            icon={Swords}
            title="Sem partidas ainda"
            description="Quando um admin registrar a primeira, ela aparece aqui."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {matches.map((m) => {
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
    </div>
  )
}
