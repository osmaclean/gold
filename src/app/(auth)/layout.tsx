import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cinematic">
      <div className="bg-grid absolute inset-0 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold-500/20 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        {children}
      </div>
    </main>
  )
}
