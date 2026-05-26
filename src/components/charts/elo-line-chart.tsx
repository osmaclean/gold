"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { formatDateTimeBR } from "@/lib/utils"

interface EloPoint {
  date: string
  elo: number
}

interface EloLineChartProps {
  data: EloPoint[]
  height?: number
}

export function EloLineChart({ data, height = 200 }: EloLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
        Sem dados de evolução ainda.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="eloFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold-400)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--gold-400)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="date" stroke="var(--graphite-400)" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--graphite-400)" fontSize={10} tickLine={false} axisLine={false} width={36} />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--muted-foreground)" }}
        />
        <Area type="monotone" dataKey="elo" stroke="var(--gold-300)" strokeWidth={2} fill="url(#eloFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
