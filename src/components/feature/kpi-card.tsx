"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface KpiCardProps {
  label: string
  value: string | number
  delta?: { value: number; positive?: boolean }
  icon?: LucideIcon
  accent?: "gold" | "cyan" | "green" | "red"
  className?: string
}

const accentMap = {
  gold: "from-gold-500/30 to-transparent text-gold-300",
  cyan: "from-cyan-500/30 to-transparent text-cyan-300",
  green: "from-emerald-500/30 to-transparent text-emerald-300",
  red: "from-rose-500/30 to-transparent text-rose-300",
}

export function KpiCard({ label, value, delta, icon: Icon, accent = "gold", className }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative glass rounded-xl p-5 overflow-hidden", className)}
    >
      <div className={cn("absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br blur-2xl opacity-50", accentMap[accent])} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="font-display text-3xl mt-1 numeric">{value}</p>
          {delta && (
            <p className={cn("text-xs mt-1", delta.positive ? "text-emerald-300" : "text-rose-300")}>
              {delta.positive ? "▲" : "▼"} {Math.abs(delta.value)}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("size-9 grid place-items-center rounded-md bg-white/5", accentMap[accent].split(" ").pop())}>
            <Icon className="size-4" />
          </div>
        )}
      </div>
    </motion.div>
  )
}
