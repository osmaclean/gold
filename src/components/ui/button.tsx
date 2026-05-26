import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-gold-400 to-gold-600 text-primary-foreground shadow-[0_8px_24px_-6px_rgba(212,160,23,0.5)] hover:from-gold-300 hover:to-gold-500 hover:shadow-[0_10px_30px_-8px_rgba(212,160,23,0.65)] active:translate-y-[1px]",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-white/5 hover:border-gold-500/40",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 border border-white/5",
        ghost: "text-muted-foreground hover:bg-white/5 hover:text-foreground",
        link: "text-gold-300 underline-offset-4 hover:underline hover:text-gold-200",
        destructive:
          "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25",
        glass:
          "glass text-foreground hover:bg-white/10 hover:border-gold-500/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-12 px-6 text-base rounded-lg",
        xl: "h-14 px-8 text-base rounded-xl tracking-wide uppercase",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
