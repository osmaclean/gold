"use client"

import { useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn, pickInitials } from "@/lib/utils"
import { RARITY_LABELS, POSITION_LABELS, RARITY_GRADIENTS } from "@/lib/constants"
import { StatRadar } from "@/components/charts/stat-radar"
import type { Card as PrismaCard, Rarity, Position } from "@prisma/client"

export interface PlayerCardData {
  nickname: string
  avatarUrl?: string | null
  position: Position
  overall: number
  rarity: Rarity
  edition?: string
  isHolographic?: boolean
  stats: {
    aim: number
    clutch: number
    support: number
    movement: number
    gameSense: number
    entry: number
    awp: number
    communication: number
  }
}

export function fromPrismaCard(
  card: Pick<
    PrismaCard,
    | "rarity"
    | "edition"
    | "overall"
    | "aim"
    | "clutch"
    | "support"
    | "movement"
    | "gameSense"
    | "entry"
    | "awp"
    | "communication"
    | "position"
    | "isHolographic"
  >,
  user: { nickname: string; avatarUrl: string | null }
): PlayerCardData {
  return {
    nickname: user.nickname,
    avatarUrl: user.avatarUrl,
    position: card.position,
    overall: card.overall,
    rarity: card.rarity,
    edition: card.edition,
    isHolographic: card.isHolographic,
    stats: {
      aim: card.aim,
      clutch: card.clutch,
      support: card.support,
      movement: card.movement,
      gameSense: card.gameSense,
      entry: card.entry,
      awp: card.awp,
      communication: card.communication,
    },
  }
}

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
        className="perspective-1200 w-full h-full"
        onClick={() => interactive && setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
      >
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className={cn("preserve-3d relative w-full h-full transition-3d")}
          style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
        >
          {/* FRONT */}
          <div className="backface-hidden absolute inset-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={cardStyle}
              className={cn(
                "relative w-full h-full rounded-2xl overflow-hidden shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]",
                "bg-gradient-to-br",
                gradient
              )}
            >
              {/* Borda interna */}
              <div className="absolute inset-[3px] rounded-[14px] bg-gradient-to-br from-black/40 via-black/20 to-black/60 flex flex-col">
                {/* Top stripe */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                  <div className="flex flex-col leading-none">
                    <span className="font-display text-5xl text-glow-gold numeric drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                      {data.overall}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-white/90 mt-1">
                      {POSITION_LABELS[data.position]}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/70">
                      {RARITY_LABELS[data.rarity]}
                    </p>
                    {data.edition && data.edition !== "base" && (
                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/90 mt-1">
                        {data.edition.toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex-1 flex items-center justify-center relative px-4 py-2">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-white/20 bg-black/40">
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
                  <h3 className="font-display text-2xl tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] truncate">
                    {data.nickname.toUpperCase()}
                  </h3>
                </div>

                {/* Stats grid */}
                <div className="px-4 py-3 grid grid-cols-4 gap-y-1.5 gap-x-3 text-[10px] uppercase tracking-wider text-white/85">
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
                <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-[9px] uppercase tracking-widest text-white/60">
                  <span>Tropa da Gold</span>
                  <span>CS2</span>
                </div>
              </div>

              {/* Glare */}
              {interactive && (
                <div className="absolute inset-0 pointer-events-none rounded-2xl mix-blend-overlay" style={glareStyle} />
              )}
              {showHolo && <div className="holo-overlay absolute inset-0 pointer-events-none rounded-2xl" />}
            </motion.div>
          </div>

          {/* BACK */}
          <div className="backface-hidden rotate-y-180 absolute inset-0">
            <div className={cn("relative w-full h-full rounded-2xl bg-gradient-to-br shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]", gradient)}>
              <div className="absolute inset-[3px] rounded-[14px] bg-black/70 flex flex-col p-5 gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl tracking-widest text-shine">{data.nickname.toUpperCase()}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">RADAR</span>
                </div>
                <div className="flex-1 grid place-items-center">
                  <StatRadar stats={data.stats} size={220} />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground text-center">
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
      <span className="text-white/75 font-display tracking-widest">{label}</span>
      <span className="text-white font-display text-base numeric">{value}</span>
    </div>
  )
}
