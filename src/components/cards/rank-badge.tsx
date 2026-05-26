"use client"

import { Crown, Shield, ShieldCheck, ShieldHalf, ShieldPlus, Trophy } from "lucide-react"
import { patentForElo } from "@/lib/constants"
import { cn } from "@/lib/utils"

const iconMap = {
  shield: Shield,
  "shield-check": ShieldCheck,
  "shield-half": ShieldHalf,
  "shield-plus": ShieldPlus,
  crown: Crown,
  trophy: Trophy,
} as const

interface RankBadgeProps {
  elo: number
  size?: "sm" | "md" | "lg"
  className?: string
  showElo?: boolean
}

export function RankBadge({ elo, size = "md", className, showElo = true }: RankBadgeProps) {
  const patent = patentForElo(elo)
  const Icon = iconMap[patent.icon as keyof typeof iconMap] ?? Shield

  const sizes = {
    sm: { box: "h-6 px-2 text-[10px]", icon: "size-3" },
    md: { box: "h-8 px-3 text-xs", icon: "size-4" },
    lg: { box: "h-10 px-4 text-sm", icon: "size-5" },
  }[size]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-200 font-display tracking-widest uppercase",
        sizes.box,
        className
      )}
    >
      <Icon className={cn(sizes.icon, "text-gold-300")} />
      <span>{patent.label}</span>
      {showElo && (
        <>
          <span className="opacity-40">·</span>
          <span className="numeric text-gold-100">{elo}</span>
        </>
      )}
    </div>
  )
}
