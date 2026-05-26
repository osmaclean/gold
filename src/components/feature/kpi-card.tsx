"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  label: string
  value: string | number
  delta?: { value: number; positive?: boolean }
  /**
   * Ícone já renderizado (ex: `<Swords />`). Não passe o componente nu (`Swords`)
   * — Server Components não podem passar funções como props para Client Components.
   */
  icon?: ReactNode
  accent?: "gold" | "cyan" | "green" | "red"
  className?: string
}

const accentMap = {
  gold: "from-gold-500/30 to-transparent text-gold-300",
  cyan: "from-cyan-500/30 to-transparent text-cyan-300",
  green: "from-emerald-500/30 to-transparent text-emerald-300",
  red: "from-rose-500/30 to-transparent text-rose-300",
}

export function KpiCard({ label, value, delta, icon, accent = "gold", className }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("glass relative overflow-hidden rounded-xl p-5", className)}
    >
      <div
        className={cn(
          "absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br opacity-50 blur-2xl",
          accentMap[accent],
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{label}</p>
          <p className="numeric mt-1 font-display text-3xl">{value}</p>
          {delta && (
            <p
              className={cn("mt-1 text-xs", delta.positive ? "text-emerald-300" : "text-rose-300")}
            >
              {delta.positive ? "▲" : "▼"} {Math.abs(delta.value)}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "grid size-9 place-items-center rounded-md bg-white/5 [&_svg]:size-4",
              accentMap[accent].split(" ").pop(),
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  )
}
