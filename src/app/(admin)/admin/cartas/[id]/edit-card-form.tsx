"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { editCardAction } from "@/features/cards/actions"
import { CS_MAPS, CS_WEAPONS, POSITION_LABELS } from "@/lib/constants"
import type { Position } from "@prisma/client"

interface EditCardFormProps {
  cardId: string
  initial: {
    support: number
    movement: number
    gameSense: number
    communication: number
    edition: string
    position: Position
    isHolographic: boolean
    favoriteMap: string | null
    favoriteWeapon: string | null
  }
}

const editions = [
  { value: "base", label: "Base" },
  { value: "toty", label: "TOTY" },
  { value: "icon", label: "Icon" },
  { value: "halloween", label: "Halloween" },
  { value: "anniversary", label: "Aniversário" },
  { value: "legendary", label: "Lendária" },
]

export function EditCardForm({ cardId, initial }: EditCardFormProps) {
  const router = useRouter()
  const [state, setState] = useState(initial)
  const [isPending, startTransition] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await editCardAction({ cardId, ...state })
        toast.success("Carta atualizada!")
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falhou")
      }
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatField label="Support" value={state.support} onChange={(v) => setState((s) => ({ ...s, support: v }))} />
        <StatField label="Movement" value={state.movement} onChange={(v) => setState((s) => ({ ...s, movement: v }))} />
        <StatField label="Game Sense" value={state.gameSense} onChange={(v) => setState((s) => ({ ...s, gameSense: v }))} />
        <StatField label="Comms" value={state.communication} onChange={(v) => setState((s) => ({ ...s, communication: v }))} />
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Posição</Label>
          <Select value={state.position} onValueChange={(v) => setState((s) => ({ ...s, position: v as Position }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(POSITION_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Edição especial</Label>
          <Select value={state.edition} onValueChange={(v) => setState((s) => ({ ...s, edition: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {editions.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Holográfica</Label>
          <div className="flex items-center gap-3 h-10 px-3 rounded-md bg-input border border-border">
            <Switch
              checked={state.isHolographic}
              onCheckedChange={(c) => setState((s) => ({ ...s, isHolographic: c }))}
              id="holo"
            />
            <Label htmlFor="holo" className="cursor-pointer text-xs">
              Ativar efeito holo
            </Label>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Mapa favorito</Label>
          <Select
            value={state.favoriteMap ?? ""}
            onValueChange={(v) => setState((s) => ({ ...s, favoriteMap: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {CS_MAPS.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Arma favorita</Label>
          <Select
            value={state.favoriteWeapon ?? ""}
            onValueChange={(v) => setState((s) => ({ ...s, favoriteWeapon: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {CS_WEAPONS.map((w) => (
                <SelectItem key={w} value={w}>{w}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Salvar alterações
        </Button>
      </div>
    </form>
  )
}

function StatField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input
        type="number"
        min={50}
        max={99}
        value={value}
        onChange={(e) => onChange(Math.max(50, Math.min(99, +e.target.value || 50)))}
      />
    </div>
  )
}
