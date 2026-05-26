import Link from "next/link"
import { Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-cinematic">
      <div className="bg-grid absolute inset-0 pointer-events-none" />
      <header className="relative z-10 px-6 md:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 font-display tracking-widest text-xl text-shine">
          <Crown className="size-5 text-gold-300" />
          {APP_NAME.toUpperCase()}
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/regras" className="hover:text-foreground transition-colors">Regras</Link>
          <Link href="/sobre" className="hover:text-foreground transition-colors">Sobre</Link>
        </nav>
        <Button asChild>
          <Link href="/entrar">Entrar</Link>
        </Button>
      </header>
      <main className="relative z-10">{children}</main>
      <footer className="relative z-10 mt-24 border-t border-white/5 px-6 md:px-12 py-6 text-xs text-muted-foreground flex items-center justify-between">
        <span>© {new Date().getFullYear()} Tropa da Gold. Privado pra galera.</span>
        <span className="font-display tracking-widest text-gold-300/60">CS2 LEAGUE</span>
      </footer>
    </div>
  )
}
