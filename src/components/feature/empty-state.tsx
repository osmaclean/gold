import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 p-12 text-center", className)}>
      {Icon && (
        <div className="size-14 grid place-items-center rounded-full bg-white/[0.04] text-muted-foreground">
          <Icon className="size-6" />
        </div>
      )}
      <h3 className="font-display text-lg tracking-widest">{title.toUpperCase()}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
      {action}
    </div>
  )
}
