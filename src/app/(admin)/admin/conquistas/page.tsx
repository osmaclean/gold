import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionHeading } from "@/components/feature/section-heading"
import { RARITY_LABELS } from "@/lib/constants"

export const metadata = { title: "Admin · Conquistas" }

export default async function AdminAchievementsPage() {
  const achievements = await db.achievement.findMany({ orderBy: { xpReward: "asc" } })
  const counts = await db.playerAchievement.groupBy({
    by: ["achievementId"],
    _count: { _all: true },
  })
  const countMap = new Map(counts.map((c) => [c.achievementId, c._count._all]))

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Conquistas"
        description="Definidas no seed. Edição direta de critérios virá em versão futura."
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Conquista</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Raridade</TableHead>
            <TableHead>XP</TableHead>
            <TableHead>Desbloqueada por</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-display text-base">{a.name}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{a.description}</TableCell>
              <TableCell>
                <Badge>{RARITY_LABELS[a.rarity]}</Badge>
              </TableCell>
              <TableCell>+{a.xpReward}</TableCell>
              <TableCell>{countMap.get(a.id) ?? 0} player(s)</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
