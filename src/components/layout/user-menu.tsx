"use client"

import Link from "next/link"
import { LogOut, User as UserIcon, Shield, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { pickInitials } from "@/lib/utils"
import { patentForElo } from "@/lib/constants"
import type { User } from "@prisma/client"

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const patent = patentForElo(user.elo)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 group">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium">{user.nickname}</span>
            <span className="text-[10px] uppercase tracking-widest text-gold-300/80">
              {patent.label} · {user.elo}
            </span>
          </div>
          <Avatar className="ring-2 ring-gold-500/30 group-hover:ring-gold-400/60 transition">
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.nickname} /> : null}
            <AvatarFallback>{pickInitials(user.nickname)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm tracking-wider text-foreground">
              {user.nickname}
            </span>
            {user.role === "ADMIN" && <Badge variant="default">Admin</Badge>}
          </div>
          <p className="text-[10px] text-muted-foreground normal-case">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/jogadores/${user.nickname}`}>
            <UserIcon className="size-4" />
            Meu perfil
          </Link>
        </DropdownMenuItem>
        {user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield className="size-4" />
              Painel admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/configuracoes">
            <Settings className="size-4" />
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
          <Link href="/auth/sair">
            <LogOut className="size-4" />
            Sair
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
