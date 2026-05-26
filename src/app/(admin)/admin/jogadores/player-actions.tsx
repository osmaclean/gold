"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { MoreHorizontal, Shield, UserCheck, UserX } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { setPlayerRoleAction, setPlayerActiveAction } from "@/features/players/actions"
import type { Role } from "@prisma/client"

interface PlayerActionsProps {
  userId: string
  role: Role
  isActive: boolean
}

export function PlayerActions({ userId, role, isActive }: PlayerActionsProps) {
  const [isPending, startTransition] = useTransition()

  function toggleRole() {
    startTransition(async () => {
      try {
        await setPlayerRoleAction(userId, role === "ADMIN" ? "PLAYER" : "ADMIN")
        toast.success("Role atualizada.")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Falhou")
      }
    })
  }
  function toggleActive() {
    startTransition(async () => {
      try {
        await setPlayerActiveAction(userId, !isActive)
        toast.success(isActive ? "Jogador banido." : "Jogador reativado.")
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
        <DropdownMenuItem onClick={toggleRole}>
          <Shield className="size-4" />
          {role === "ADMIN" ? "Remover admin" : "Promover a admin"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleActive} className={isActive ? "text-destructive" : ""}>
          {isActive ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
          {isActive ? "Banir" : "Reativar"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
