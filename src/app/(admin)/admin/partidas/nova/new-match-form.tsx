"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Trash2, Crown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { createMatchAction } from "@/features/matches/actions"
import { CS_MAPS } from "@/lib/constants"
import { cn, pickInitials } from "@/lib/utils"

interface NewMatchFormProps {
  players: { id: string; nickname: string; elo: number; avatarUrl: string | null }[]
  seasons: { id: string; number: number; name: string }[]
}

type Team = "TEAM_A" | "TEAM_B"

interface PlayerLine {
  userId: string
  team: Team
  kills: number
  deaths: number
  assists: number
  headshots: number
  damage: number
  clutchesWon: number
  openingKills: number
  openingDeaths: number
  awpKills: number
  flashAssists: number
  utilityDamage: number
}

function emptyLine(team: Team): PlayerLine {
  return {
    userId: "",
    team,
    kills: 0,
    deaths: 0,
    assists: 0,
    headshots: 0,
    damage: 0,
    clutchesWon: 0,
    openingKills: 0,
    openingDeaths: 0,
    awpKills: 0,
    flashAssists: 0,
    utilityDamage: 0,
  }
}

export function NewMatchForm({ players, seasons }: NewMatchFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [map, setMap] = useState<string>(CS_MAPS[0].value)
  const [mode, setMode] = useState<"MR12" | "MR15" | "WINGMAN" | "AIM_MAP" | "CUSTOM">("MR12")
  const [seasonId, setSeasonId] = useState<string>(seasons[0]?.id ?? "")
  const [playedAt, setPlayedAt] = useState<string>(() => new Date().toISOString().slice(0, 16))
  const [scoreA, setScoreA] = useState(13)
  const [scoreB, setScoreB] = useState(7)
  const [mvpUserId, setMvpUserId] = useState<string>("")
  const [highlights, setHighlights] = useState("")
  const [validated, setValidated] = useState(true)

  const [linesA, setLinesA] = useState<PlayerLine[]>([emptyLine("TEAM_A")])
  const [linesB, setLinesB] = useState<PlayerLine[]>([emptyLine("TEAM_B")])

  function addLine(team: Team) {
    if (team === "TEAM_A") setLinesA((l) => [...l, emptyLine("TEAM_A")])
    else setLinesB((l) => [...l, emptyLine("TEAM_B")])
  }
  function removeLine(team: Team, idx: number) {
    if (team === "TEAM_A") setLinesA((l) => l.filter((_, i) => i !== idx))
    else setLinesB((l) => l.filter((_, i) => i !== idx))
  }

  function updateLine(team: Team, idx: number, patch: Partial<PlayerLine>) {
    if (team === "TEAM_A")
      setLinesA((l) => l.map((line, i) => (i === idx ? { ...line, ...patch } : line)))
    else setLinesB((l) => l.map((line, i) => (i === idx ? { ...line, ...patch } : line)))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const all = [...linesA, ...linesB]
    const valid = all.filter((p) => p.userId)
    if (valid.length < 2) {
      toast.error("Selecione pelo menos 2 jogadores.")
      return
    }
    const dupes = new Set<string>()
    for (const p of valid) {
      if (dupes.has(p.userId)) {
        toast.error("Um jogador foi adicionado em ambos os times.")
        return
      }
      dupes.add(p.userId)
    }

    startTransition(async () => {
      try {
        const result = await createMatchAction({
          seasonId: seasonId || null,
          map,
          mode,
          playedAt: new Date(playedAt),
          scoreTeamA: scoreA,
          scoreTeamB: scoreB,
          mvpUserId: mvpUserId || null,
          highlights: highlights || null,
          validated,
          players: valid,
        })
        toast.success("Partida registrada!")
        router.push(`/partidas/${result.id}`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar a partida")
      }
    })
  }

  const allSelected = [...linesA, ...linesB].filter((l) => l.userId)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Cabeçalho */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="map">Mapa</Label>
          <Select value={map} onValueChange={setMap}>
            <SelectTrigger id="map">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CS_MAPS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="mode">Modo</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
            <SelectTrigger id="mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MR12">MR12</SelectItem>
              <SelectItem value="MR15">MR15</SelectItem>
              <SelectItem value="WINGMAN">Wingman</SelectItem>
              <SelectItem value="AIM_MAP">Aim Map</SelectItem>
              <SelectItem value="CUSTOM">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="season">Season</Label>
          <Select value={seasonId} onValueChange={setSeasonId}>
            <SelectTrigger id="season">
              <SelectValue placeholder="Sem season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  #{s.number} · {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="playedAt">Data e hora</Label>
          <Input
            id="playedAt"
            type="datetime-local"
            value={playedAt}
            onChange={(e) => setPlayedAt(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Placar Team A</Label>
          <Input type="number" min={0} value={scoreA} onChange={(e) => setScoreA(+e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Placar Team B</Label>
          <Input type="number" min={0} value={scoreB} onChange={(e) => setScoreB(+e.target.value)} required />
        </div>
      </section>

      <Separator />

      {/* Lineups */}
      <TeamSection
        team="TEAM_A"
        label="Team A"
        accent="cyan"
        lines={linesA}
        players={players}
        usedUserIds={new Set(allSelected.map((l) => l.userId))}
        onChange={(idx, patch) => updateLine("TEAM_A", idx, patch)}
        onAdd={() => addLine("TEAM_A")}
        onRemove={(idx) => removeLine("TEAM_A", idx)}
      />
      <TeamSection
        team="TEAM_B"
        label="Team B"
        accent="rose"
        lines={linesB}
        players={players}
        usedUserIds={new Set(allSelected.map((l) => l.userId))}
        onChange={(idx, patch) => updateLine("TEAM_B", idx, patch)}
        onAdd={() => addLine("TEAM_B")}
        onRemove={(idx) => removeLine("TEAM_B", idx)}
      />

      <Separator />

      <section className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>MVP</Label>
          <Select value={mvpUserId} onValueChange={setMvpUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o MVP (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {allSelected.map((line) => {
                const p = players.find((pl) => pl.id === line.userId)
                if (!p) return null
                return (
                  <SelectItem key={p.id} value={p.id}>
                    <span className="inline-flex items-center gap-2">
                      <Crown className="size-3 text-gold-300" /> {p.nickname}
                    </span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <div className="flex items-center gap-3 h-10 px-3 rounded-md bg-input border border-border">
            <Switch checked={validated} onCheckedChange={setValidated} id="validated" />
            <Label htmlFor="validated" className="cursor-pointer text-xs">
              {validated ? "Validada (aparece no histórico)" : "Pendente"}
            </Label>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-2">
        <Label htmlFor="highlights">Destaque / Notas</Label>
        <Textarea
          id="highlights"
          rows={3}
          placeholder="Comente lance da partida, clutches, ace, etc."
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Salvar partida
        </Button>
      </div>
    </form>
  )
}

interface TeamSectionProps {
  team: Team
  label: string
  accent: "cyan" | "rose"
  lines: PlayerLine[]
  players: NewMatchFormProps["players"]
  usedUserIds: Set<string>
  onChange: (idx: number, patch: Partial<PlayerLine>) => void
  onAdd: () => void
  onRemove: (idx: number) => void
}

function TeamSection({
  team,
  label,
  accent,
  lines,
  players,
  usedUserIds,
  onChange,
  onAdd,
  onRemove,
}: TeamSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className={cn("font-display text-xl tracking-widest", accent === "cyan" ? "text-cyan-300" : "text-rose-300")}>
          {label.toUpperCase()}
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="size-4" /> Adicionar jogador
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {lines.map((line, idx) => (
          <PlayerLineRow
            key={idx}
            line={line}
            players={players.filter((p) => p.id === line.userId || !usedUserIds.has(p.id))}
            onChange={(patch) => onChange(idx, patch)}
            onRemove={() => onRemove(idx)}
            canRemove={lines.length > 1}
          />
        ))}
      </div>
    </section>
  )
}

interface PlayerLineRowProps {
  line: PlayerLine
  players: NewMatchFormProps["players"]
  onChange: (patch: Partial<PlayerLine>) => void
  onRemove: () => void
  canRemove: boolean
}

function PlayerLineRow({ line, players, onChange, onRemove, canRemove }: PlayerLineRowProps) {
  const selected = players.find((p) => p.id === line.userId)
  return (
    <div className="glass rounded-lg p-3 grid grid-cols-12 gap-2 items-center">
      <div className="col-span-12 md:col-span-3 flex items-center gap-2">
        <Select value={line.userId} onValueChange={(v) => onChange({ userId: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar player" />
          </SelectTrigger>
          <SelectContent>
            {players.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex items-center gap-2">
                  <Avatar className="size-5">
                    {p.avatarUrl ? <AvatarImage src={p.avatarUrl} alt={p.nickname} /> : null}
                    <AvatarFallback className="text-[8px]">{pickInitials(p.nickname)}</AvatarFallback>
                  </Avatar>
                  {p.nickname}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <NumberField label="K" value={line.kills} onChange={(v) => onChange({ kills: v })} />
      <NumberField label="D" value={line.deaths} onChange={(v) => onChange({ deaths: v })} />
      <NumberField label="A" value={line.assists} onChange={(v) => onChange({ assists: v })} />
      <NumberField label="HS" value={line.headshots} onChange={(v) => onChange({ headshots: v })} />
      <NumberField label="DMG" value={line.damage} onChange={(v) => onChange({ damage: v })} step={10} />
      <NumberField label="CLU" value={line.clutchesWon} onChange={(v) => onChange({ clutchesWon: v })} />
      <NumberField label="ENT" value={line.openingKills} onChange={(v) => onChange({ openingKills: v })} />
      <NumberField label="AWP" value={line.awpKills} onChange={(v) => onChange({ awpKills: v })} />
      <NumberField label="FLS" value={line.flashAssists} onChange={(v) => onChange({ flashAssists: v })} />
      <div className="col-span-12 md:col-span-1 flex justify-end">
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} disabled={!canRemove}>
          <Trash2 className="size-4 text-rose-300" />
        </Button>
      </div>
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
}) {
  return (
    <div className="col-span-4 sm:col-span-2 md:col-span-1 flex flex-col gap-1">
      <Label className="text-[9px]">{label}</Label>
      <Input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="h-9 text-xs"
      />
    </div>
  )
}
