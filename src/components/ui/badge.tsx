import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "border-gold-500/40 bg-gold-500/10 text-gold-200",
        outline: "border-border bg-transparent text-muted-foreground",
        secondary: "border-white/10 bg-white/5 text-foreground",
        destructive: "border-destructive/40 bg-destructive/10 text-destructive",
        success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
