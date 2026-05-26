import Link from "next/link"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { IdCard } from "lucide-react"
import { RARITY_LABELS, POSITION_LABELS } from "@/lib/constants"
import { pickInitials } from "@/lib/utils"

export const metadata = { title: "Admin · Cartas" }

export default async function AdminCardsPage() {
  const cards = await db.card.findMany({
    orderBy: { overall: "desc" },
    include: { user: true },
  })

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Cartas" description="Edite stats qualitativas, raridade e edição." />
      {cards.length === 0 ? (
        <Card>
          <EmptyState icon={IdCard} title="Sem cartas" description="Players precisam fazer login pra gerar carta." />
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Posição</TableHead>
              <TableHead>Edição</TableHead>
              <TableHead>Raridade</TableHead>
              <TableHead>Overall</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                      {c.user.avatarUrl ? <AvatarImage src={c.user.avatarUrl} alt={c.user.nickname} /> : null}
                      <AvatarFallback className="text-[9px]">{pickInitials(c.user.nickname)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{c.user.nickname}</span>
                  </div>
                </TableCell>
                <TableCell>{POSITION_LABELS[c.position]}</TableCell>
                <TableCell>{c.edition}</TableCell>
                <TableCell>
                  <Badge>{RARITY_LABELS[c.rarity]}</Badge>
                </TableCell>
                <TableCell className="font-display text-lg">{c.overall}</TableCell>
                <TableCell>v{c.version}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="link" size="sm">
                    <Link href={`/admin/cartas/${c.id}`}>Editar</Link>
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
