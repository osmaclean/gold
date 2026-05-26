import Link from "next/link"
import { Flame } from "lucide-react"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { EmptyState } from "@/components/feature/empty-state"
import { formatDateTimeBR } from "@/lib/utils"

export const metadata = { title: "Admin · Partidas" }

export default async function AdminMatchesPage() {
  const matches = await db.match.findMany({
    take: 100,
    orderBy: { playedAt: "desc" },
    include: { mvp: true, season: true, players: true },
  })

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Partidas"
        description="Edite, valide ou apague registros."
        action={
          <Button asChild>
            <Link href="/admin/partidas/nova"><Flame className="size-4" /> Nova partida</Link>
          </Button>
        }
      />
      {matches.length === 0 ? (
        <Card>
          <EmptyState icon={Flame} title="Sem partidas" description="Registre a primeira." />
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Mapa</TableHead>
              <TableHead>Placar</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>MVP</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{formatDateTimeBR(m.playedAt)}</TableCell>
                <TableCell>{m.season ? `#${m.season.number}` : "—"}</TableCell>
                <TableCell>{m.map.replace("de_", "").toUpperCase()}</TableCell>
                <TableCell className="font-display text-base">{m.scoreTeamA} × {m.scoreTeamB}</TableCell>
                <TableCell>{m.players.length}</TableCell>
                <TableCell>{m.mvp?.nickname ?? "—"}</TableCell>
                <TableCell>
                  {m.validated ? <Badge variant="success">Validada</Badge> : <Badge variant="outline">Pendente</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="link" size="sm">
                    <Link href={`/partidas/${m.id}`}>Abrir</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
