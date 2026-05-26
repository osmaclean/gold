"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Swords,
  IdCard,
  Trophy,
  Award,
  Shield,
  Settings2,
  Calendar,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jogadores", label: "Jogadores", icon: Users },
  { href: "/partidas", label: "Partidas", icon: Swords },
  { href: "/cartas", label: "Cartas", icon: IdCard },
  { href: "/seasons", label: "Seasons", icon: Trophy },
  { href: "/conquistas", label: "Conquistas", icon: Award },
]

const adminItems: NavItem[] = [
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/admin/partidas/nova", label: "Nova partida", icon: Flame },
  { href: "/admin/seasons", label: "Seasons", icon: Calendar },
  { href: "/admin/cartas", label: "Cartas", icon: IdCard },
  { href: "/admin/jogadores", label: "Jogadores", icon: Users },
  { href: "/admin/conquistas", label: "Conquistas", icon: Award },
  { href: "/admin/eventos", label: "Eventos", icon: Trophy },
]

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col gap-6 px-4 py-6 border-r border-white/5 glass min-h-screen sticky top-0">
      <Link href="/dashboard" className="flex items-center gap-2 px-2">
        <span className="size-9 grid place-items-center rounded-md bg-gradient-to-br from-gold-400 to-gold-700 shadow-[0_0_20px_-4px_rgba(212,160,23,0.6)]">
          <Settings2 className="size-5 text-primary-foreground" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-lg tracking-widest text-shine">TROPA DA GOLD</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">CS2 League</span>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        <NavSectionLabel>Geral</NavSectionLabel>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}

        {isAdmin && (
          <>
            <NavSectionLabel className="mt-4">Admin</NavSectionLabel>
            {adminItems.map((item) => (
              <NavLink key={item.href} item={item} active={isActive(pathname, item.href, true)} />
            ))}
          </>
        )}
      </nav>

      <div className="mt-auto px-2">
        <div className="rounded-lg p-3 glass-strong text-xs text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">Atalho</p>
          <kbd className="inline-flex h-5 items-center rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px]">⌘K</kbd>{" "}
          para abrir o command palette.
        </div>
      </div>
    </aside>
  )
}

function NavSectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("px-3 mt-2 mb-1 text-[10px] uppercase tracking-widest text-muted-foreground/70", className)}>
      {children}
    </span>
  )
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      )}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-md bg-gold-500/10 border border-gold-500/30"
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        />
      )}
      <Icon className={cn("size-4 relative", active && "text-gold-300")} />
      <span className="relative">{item.label}</span>
    </Link>
  )
}

function isActive(pathname: string, href: string, exactForRoot = false) {
  if (href === "/admin") return pathname === "/admin"
  if (exactForRoot && href === "/admin") return pathname === "/admin"
  return pathname === href || pathname.startsWith(href + "/")
}
