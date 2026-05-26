"use client"

import { useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn, pickInitials } from "@/lib/utils"
import { RARITY_LABELS, POSITION_LABELS, RARITY_GRADIENTS } from "@/lib/constants"
import { StatRadar } from "@/components/charts/stat-radar"
import type { PlayerCardData } from "@/components/cards/player-card-data"

interface PlayerCardProps {
  data: PlayerCardData
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  className?: string
}

const sizeMap = {
  sm: "w-[180px] h-[260px]",
  md: "w-[260px] h-[380px]",
  lg: "w-[320px] h-[460px]",
} as const

export function PlayerCard({ data, size = "md", interactive = true, className }: PlayerCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50 })
  const [flipped, setFlipped] = useState(false)

  function onMouseMove(e: React.MouseEvent) {
    if (!interactive || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    setTilt({ x: (py - 0.5) * -14, y: (px - 0.5) * 14 })
    setGlare({ x: px * 100, y: py * 100 })
  }
  function onMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setGlare({ x: 50, y: 50 })
  }

  const gradient = RARITY_GRADIENTS[data.rarity] ?? RARITY_GRADIENTS.BRONZE
  const isPremium = ["GOLD_RARE", "TOTY", "ICON", "LEGENDARY"].includes(data.rarity)
  const showHolo = data.isHolographic || isPremium

  const cardStyle: CSSProperties = {
    transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: "transform 0.2s ease-out",
  }
  const glareStyle: CSSProperties = {
    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.18), transparent 55%)`,
  }

  return (
    <div className={cn("relative", sizeMap[size], className)}>
      <div
        className="perspective-1200 h-full w-full"
        onClick={() => interactive && setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
      >
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className={cn("preserve-3d transition-3d relative h-full w-full")}
          style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={cardStyle}
              className={cn(
                "relative h-full w-full overflow-hidden rounded-2xl shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]",
                "bg-gradient-to-br",
                gradient,
              )}
            >
              {/* Borda interna */}
              <div className="absolute inset-[3px] flex flex-col rounded-[14px] bg-gradient-to-br from-black/40 via-black/20 to-black/60">
                {/* Top stripe */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex flex-col leading-none">
                    <span className="text-glow-gold numeric font-display text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                      {data.overall}
                    </span>
                    <span className="mt-1 text-[10px] tracking-widest text-white/90 uppercase">
                      {POSITION_LABELS[data.position]}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] tracking-[0.2em] text-white/70 uppercase">
                      {RARITY_LABELS[data.rarity]}
                    </p>
                    {data.edition && data.edition !== "base" && (
                      <p className="mt-1 text-[9px] tracking-[0.2em] text-white/90 uppercase">
                        {data.edition.toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Avatar */}
                <div className="relative flex flex-1 items-center justify-center px-4 py-2">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full bg-black/40 ring-2 ring-white/20">
                    {data.avatarUrl ? (
                      <Image
                        src={data.avatarUrl}
                        alt={data.nickname}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center font-display text-3xl text-white/80">
                        {pickInitials(data.nickname)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Nickname */}
                <div className="px-4 text-center">
                  <h3 className="truncate font-display text-2xl tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {data.nickname.toUpperCase()}
                  </h3>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-x-3 gap-y-1.5 px-4 py-3 text-[10px] tracking-wider text-white/85 uppercase">
                  <StatRow label="AIM" value={data.stats.aim} />
                  <StatRow label="CLU" value={data.stats.clutch} />
                  <StatRow label="ENT" value={data.stats.entry} />
                  <StatRow label="AWP" value={data.stats.awp} />
                  <StatRow label="SUP" value={data.stats.support} />
                  <StatRow label="MOV" value={data.stats.movement} />
                  <StatRow label="GS" value={data.stats.gameSense} />
                  <StatRow label="COM" value={data.stats.communication} />
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[9px] tracking-widest text-white/60 uppercase">
                  <span>Tropa da Gold</span>
                  <span>CS2</span>
                </div>
              </div>

              {/* Glare */}
              {interactive && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay"
                  style={glareStyle}
                />
              )}
              {showHolo && (
                <div className="holo-overlay pointer-events-none absolute inset-0 rounded-2xl" />
              )}
            </motion.div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 rotate-y-180 backface-hidden">
            <div
              className={cn(
                "relative h-full w-full rounded-2xl bg-gradient-to-br shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]",
                gradient,
              )}
            >
              <div className="absolute inset-[3px] flex flex-col gap-3 rounded-[14px] bg-black/70 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-shine font-display text-2xl tracking-widest">
                    {data.nickname.toUpperCase()}
                  </span>
                  <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                    RADAR
                  </span>
                </div>
                <div className="grid flex-1 place-items-center">
                  <StatRadar stats={data.stats} size={220} />
                </div>
                <p className="text-center text-[10px] tracking-widest text-muted-foreground uppercase">
                  clique para voltar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-1">
      <span className="font-display tracking-widest text-white/75">{label}</span>
      <span className="numeric font-display text-base text-white">{value}</span>
    </div>
  )
}
