import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function SectionHeading({ title, description, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-5", className)}>
      <div className="flex flex-col">
        <h2 className="font-display text-2xl tracking-widest text-foreground">{title.toUpperCase()}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
