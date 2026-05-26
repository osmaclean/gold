"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Swords,
  IdCard,
  Trophy,
  Award,
  Shield,
  Flame,
  LogOut,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"

export function useCommandPalette() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  return { open, setOpen }
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdmin: boolean
}

export function CommandPalette({ open, onOpenChange, isAdmin }: CommandPaletteProps) {
  const router = useRouter()

  function go(path: string) {
    onOpenChange(false)
    router.push(path)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar página, jogador, partida..." />
      <CommandList>
        <CommandEmpty>Nada encontrado.</CommandEmpty>

        <CommandGroup heading="Navegar">
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard className="size-4" />
            Dashboard
            <CommandShortcut>D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/jogadores")}>
            <Users className="size-4" />
            Jogadores
          </CommandItem>
          <CommandItem onSelect={() => go("/partidas")}>
            <Swords className="size-4" />
            Partidas
          </CommandItem>
          <CommandItem onSelect={() => go("/cartas")}>
            <IdCard className="size-4" />
            Cartas
          </CommandItem>
          <CommandItem onSelect={() => go("/seasons")}>
            <Trophy className="size-4" />
            Seasons
          </CommandItem>
          <CommandItem onSelect={() => go("/conquistas")}>
            <Award className="size-4" />
            Conquistas
          </CommandItem>
        </CommandGroup>

        {isAdmin && (
          <CommandGroup heading="Admin">
            <CommandItem onSelect={() => go("/admin")}>
              <Shield className="size-4" />
              Painel admin
            </CommandItem>
            <CommandItem onSelect={() => go("/admin/partidas/nova")}>
              <Flame className="size-4" />
              Registrar partida
            </CommandItem>
          </CommandGroup>
        )}

        <CommandGroup heading="Sessão">
          <CommandItem onSelect={() => go("/auth/sair")}>
            <LogOut className="size-4" />
            Sair
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
