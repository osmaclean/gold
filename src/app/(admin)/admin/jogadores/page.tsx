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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SectionHeading } from "@/components/feature/section-heading"
import { EmptyState } from "@/components/feature/empty-state"
import { PlayerActions } from "./player-actions"
import { pickInitials, formatDateTimeBR } from "@/lib/utils"
import { Users } from "lucide-react"

export const metadata = { title: "Admin · Jogadores" }

export default async function AdminPlayersPage() {
  const players = await db.user.findMany({
    orderBy: { joinedAt: "desc" },
    include: { stats: true },
  })

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Jogadores" description="Gerencie roles, ativação e dados." />
      {players.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="Sem jogadores" />
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Elo</TableHead>
              <TableHead>Partidas</TableHead>
              <TableHead>Entrou em</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                      {p.avatarUrl ? <AvatarImage src={p.avatarUrl} alt={p.nickname} /> : null}
                      <AvatarFallback className="text-[9px]">{pickInitials(p.nickname)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{p.nickname}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.email}</TableCell>
                <TableCell>
                  {p.role === "ADMIN" ? <Badge>Admin</Badge> : <Badge variant="outline">Player</Badge>}
                </TableCell>
                <TableCell>{p.elo}</TableCell>
                <TableCell>{p.stats?.matchesPlayed ?? 0}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDateTimeBR(p.joinedAt)}</TableCell>
                <TableCell>
                  {p.isActive ? <Badge variant="success">Ativo</Badge> : <Badge variant="destructive">Banido</Badge>}
                </TableCell>
                <TableCell>
                  <PlayerActions userId={p.id} role={p.role} isActive={p.isActive} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
