"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatBarProps {
  label: string
  value: number
  max?: number
  variant?: "default" | "gold" | "cyan" | "green"
  className?: string
}

const variants = {
  default: "from-graphite-400 to-graphite-200",
  gold: "from-gold-500 to-gold-300",
  cyan: "from-cyan-500 to-cyan-300",
  green: "from-emerald-500 to-emerald-300",
} as const

export function StatBar({ label, value, max = 100, variant = "gold", className }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-display text-xs text-foreground numeric">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className={cn("h-full rounded-full bg-gradient-to-r", variants[variant])}
        />
      </div>
    </div>
  )
}
