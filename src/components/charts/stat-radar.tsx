"use client"

import { motion } from "framer-motion"
import { STAT_LABELS, STAT_KEYS, type StatKey } from "@/lib/constants"

type Stats = Record<StatKey, number>

interface StatRadarProps {
  stats: Stats
  size?: number
  fill?: string
  stroke?: string
  showLabels?: boolean
  className?: string
}

export function StatRadar({
  stats,
  size = 240,
  fill = "rgba(212, 160, 23, 0.25)",
  stroke = "rgba(212, 160, 23, 0.9)",
  showLabels = true,
  className,
}: StatRadarProps) {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.38
  const sides = STAT_KEYS.length
  const angleStep = (Math.PI * 2) / sides
  const startAngle = -Math.PI / 2

  const point = (i: number, value: number) => {
    const a = startAngle + i * angleStep
    const r = (radius * value) / 100
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
  }
  const axisPoint = (i: number, r = radius) => {
    const a = startAngle + i * angleStep
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
  }

  const values = STAT_KEYS.map((k, i) => point(i, stats[k]))
  const path = values.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"

  const rings = [25, 50, 75, 100].map((pct) => {
    const r = (radius * pct) / 100
    const pts = Array.from({ length: sides }, (_, i) => axisPoint(i, r))
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="Radar das stats do jogador"
    >
      <defs>
        <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(212, 160, 23, 0.4)" />
          <stop offset="100%" stopColor="rgba(212, 160, 23, 0.05)" />
        </radialGradient>
      </defs>

      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}

      {STAT_KEYS.map((_, i) => {
        const p = axisPoint(i)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
        )
      })}

      <motion.path
        d={path}
        fill="url(#radar-fill)"
        stroke={stroke}
        strokeWidth={1.5}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {values.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#fde68a" />
      ))}

      {showLabels &&
        STAT_KEYS.map((key, i) => {
          const p = axisPoint(i, radius + 18)
          return (
            <text
              key={key}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {STAT_LABELS[key]}
            </text>
          )
        })}
    </svg>
  )
}
