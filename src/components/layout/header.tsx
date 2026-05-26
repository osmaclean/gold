"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/sidebar"
import { CommandPalette, useCommandPalette } from "@/components/layout/command-palette"
import { UserMenu } from "@/components/layout/user-menu"
import type { User } from "@prisma/client"

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { open, setOpen } = useCommandPalette()

  return (
    <header className="glass-strong sticky top-0 z-30 border-b border-white/5">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Navegação principal da Tropa da Gold.
            </SheetDescription>
            <div className="-mx-6 -my-6">
              <Sidebar isAdmin={user.role === "ADMIN"} />
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="text-shine font-display tracking-widest md:hidden">
          TDG
        </Link>

        <div className="max-w-xl flex-1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden w-full items-center gap-2 rounded-md border border-white/5 bg-white/[0.03] px-3 py-2 text-sm text-muted-foreground transition hover:border-gold-500/20 hover:bg-white/[0.06] md:flex"
          >
            <Search className="size-4" />
            <span>Buscar jogadores, partidas, conquistas…</span>
            <kbd className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] tracking-widest">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <UserMenu user={user} />
        </div>
      </div>

      <CommandPalette open={open} onOpenChange={setOpen} isAdmin={user.role === "ADMIN"} />
    </header>
  )
}
