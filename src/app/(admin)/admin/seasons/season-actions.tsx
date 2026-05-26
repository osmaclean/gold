"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Play, Square, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { activateSeasonAction, finishSeasonAction } from "@/features/seasons/actions"
import type { SeasonStatus } from "@prisma/client"

interface SeasonActionsProps {
  seasonId: string
  status: SeasonStatus
}

export function SeasonActions({ seasonId, status }: SeasonActionsProps) {
  const [isPending, startTransition] = useTransition()

  function activate() {
    startTransition(async () => {
      try {
        await activateSeasonAction(seasonId)
        toast.success("Season ativada.")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Falhou")
      }
    })
  }

  function finish() {
    if (!confirm("Encerrar season? Os ranks finais serão consolidados.")) return
    startTransition(async () => {
      try {
        await finishSeasonAction(seasonId)
        toast.success("Season encerrada.")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Falhou")
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status !== "ACTIVE" && status !== "FINISHED" && (
          <DropdownMenuItem onClick={activate}>
            <Play className="size-4" />
            Ativar
          </DropdownMenuItem>
        )}
        {status === "ACTIVE" && (
          <DropdownMenuItem onClick={finish}>
            <Square className="size-4" />
            Encerrar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
