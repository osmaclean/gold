"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { levelFromTotalXp } from "@/lib/rating/xp"
import { cn } from "@/lib/utils"

interface LevelBarProps {
  totalXp: number
  className?: string
}

export function LevelBar({ totalXp, className }: LevelBarProps) {
  const { level, remaining, next } = levelFromTotalXp(totalXp)
  const pct = (remaining / next) * 100

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-display tracking-widest text-gold-300">
          <Sparkles className="size-3.5" />
          Nível {level}
        </span>
        <span className="text-muted-foreground numeric">
          {remaining}/{next} XP
        </span>
      </div>
      <div className="relative h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-100"
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      </div>
    </div>
  )
}
