"use client"

import * as Icons from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { RARITY_GRADIENTS, RARITY_LABELS } from "@/lib/constants"
import type { Achievement, Rarity } from "@prisma/client"

interface AchievementCardProps {
  achievement: Pick<Achievement, "name" | "description" | "icon" | "rarity" | "xpReward">
  unlocked: boolean
  unlockedAt?: Date | null
}

function iconForName(name: string) {
  const key = name
    .split("-")
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join("") as keyof typeof Icons
  return (Icons[key] as React.ComponentType<{ className?: string }>) ?? Icons.Star
}

export function AchievementCard({ achievement, unlocked, unlockedAt }: AchievementCardProps) {
  const Icon = iconForName(achievement.icon)
  const gradient = RARITY_GRADIENTS[achievement.rarity as Rarity] ?? RARITY_GRADIENTS.BRONZE

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={cn(
        "relative rounded-xl p-4 overflow-hidden border transition-all",
        unlocked
          ? "border-gold-500/30 bg-gradient-to-br from-white/[0.04] to-white/[0.01]"
          : "border-white/5 bg-white/[0.02] opacity-60 grayscale"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "size-12 grid place-items-center rounded-lg bg-gradient-to-br",
            unlocked ? gradient : "from-graphite-700 to-graphite-900"
          )}
        >
          <Icon className="size-6 text-white drop-shadow" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-display text-base tracking-wide">{achievement.name}</h4>
            <span className="text-[10px] uppercase tracking-widest text-gold-300/80">
              {RARITY_LABELS[achievement.rarity]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{achievement.description}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="text-gold-300">+{achievement.xpReward} XP</span>
            {unlockedAt && <span>desbloqueada em {new Date(unlockedAt).toLocaleDateString("pt-BR")}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
