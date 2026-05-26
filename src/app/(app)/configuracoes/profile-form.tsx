"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { editOwnProfileAction } from "@/features/players/actions"

interface ProfileFormProps {
  userId: string
  initial: { nickname: string; bio: string | null }
}

export function ProfileForm({ userId, initial }: ProfileFormProps) {
  const router = useRouter()
  const [nickname, setNickname] = useState(initial.nickname)
  const [bio, setBio] = useState(initial.bio ?? "")
  const [isPending, startTransition] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await editOwnProfileAction(userId, { nickname, bio })
        toast.success("Perfil atualizado.")
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falhou")
      }
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Nickname</Label>
        <Input value={nickname} onChange={(e) => setNickname(e.target.value)} required pattern="^[a-zA-Z0-9_]+$" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Bio</Label>
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} rows={3} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Salvar
        </Button>
      </div>
    </form>
  )
}
