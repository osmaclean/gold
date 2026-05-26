"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createSeasonAction } from "@/features/seasons/actions"

export function NewSeasonForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startsAt, setStartsAt] = useState(() => new Date().toISOString().slice(0, 16))
  const [isPending, startTransition] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name) return toast.error("Dê um nome à season.")
    startTransition(async () => {
      try {
        await createSeasonAction({ name, description, startsAt: new Date(startsAt) })
        toast.success("Season criada!")
        setName("")
        setDescription("")
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falhou")
      }
    })
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <Label>Nome</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Season 2 — Ascensão" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Início</Label>
        <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
      </div>
      <div className="sm:col-span-2 flex flex-col gap-2">
        <Label>Descrição</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>
      <div className="sm:col-span-2 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Criar season
        </Button>
      </div>
    </form>
  )
}
