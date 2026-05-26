import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionHeading } from "@/components/feature/section-heading"
import { NewSeasonForm } from "./new-season-form"
import { SeasonActions } from "./season-actions"
import { formatRelativeDateBR } from "@/lib/utils"

export const metadata = { title: "Admin · Seasons" }

export default async function AdminSeasonsPage() {
  const seasons = await db.season.findMany({ orderBy: { number: "desc" } })

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading title="Seasons" description="Crie, ative e encerre temporadas." />

      <Card className="p-6">
        <h3 className="font-display tracking-widest text-lg mb-4">CRIAR NOVA SEASON</h3>
        <NewSeasonForm />
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seasons.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-display text-lg">{s.number}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{formatRelativeDateBR(s.startsAt)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {s.endsAt ? formatRelativeDateBR(s.endsAt) : "—"}
              </TableCell>
              <TableCell>
                <Badge variant={s.status === "ACTIVE" ? "success" : "outline"}>{s.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <SeasonActions seasonId={s.id} status={s.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
