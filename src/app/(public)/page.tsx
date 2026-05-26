import Link from "next/link"
import { ArrowRight, Award, Crown, IdCard, Sparkles, Swords, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayerCard } from "@/components/cards/player-card"

export const metadata = {
  title: "Tropa da Gold",
}

const demoCard = {
  nickname: "TROPADAGOLD",
  avatarUrl: null,
  position: "AWPER" as const,
  overall: 92,
  rarity: "TOTY" as const,
  edition: "toty",
  isHolographic: true,
  stats: {
    aim: 94,
    clutch: 91,
    support: 82,
    movement: 88,
    gameSense: 95,
    entry: 86,
    awp: 99,
    communication: 89,
  },
}

export default function LandingPage() {
  return (
    <div className="px-6 md:px-12">
      {/* HERO */}
      <section className="relative grid lg:grid-cols-[1.2fr,1fr] gap-10 lg:gap-20 items-center pt-12 lg:pt-20">
        <div className="flex flex-col gap-6 max-w-2xl">
          <Badge className="self-start" variant="default">
            <Sparkles className="size-3" /> Plataforma privada · Tropa da Gold
          </Badge>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-widest leading-[0.9] text-shine">
            JOGUE COMO<br />UM PRO.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl">
            Ranking competitivo, partidas com scoreboard estilo HLTV, cartas estilo Ultimate Team e
            temporadas com troféu. A liga privada da galera, com cara de produto AAA.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="xl">
              <Link href="/entrar">
                Entrar na tropa <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="glass">
              <Link href="/regras">Como funciona</Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" /> Acesso por convite
            </span>
            <span className="opacity-30">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="size-3.5" /> Seasons com prêmio
            </span>
          </div>
        </div>

        <div className="justify-self-center lg:justify-self-end">
          <div className="float-slow">
            <PlayerCard data={demoCard} size="lg" interactive />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Feature
          icon={IdCard}
          title="Cartas FUT-style"
          description="Cada player tem uma carta com 8 stats. Evolui a cada partida, ganha raridades e edições especiais."
        />
        <Feature
          icon={Crown}
          title="Ranking competitivo"
          description="Sistema de Elo dinâmico. Patentes vão de Recruta até Lenda da Tropa."
        />
        <Feature
          icon={Swords}
          title="Scoreboards HLTV"
          description="Stats individuais, MVP, timeline de rodadas, destaques e ratings calculados."
        />
        <Feature
          icon={Award}
          title="Conquistas viciantes"
          description="Clutch King, Ace Master, HS Machine, MVP em série e mais. Desbloqueiam XP."
        />
      </section>

      <section className="mt-24 glass-strong rounded-2xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl tracking-widest text-shine">PRONTO PRA SUBIR DE PATENTE?</h2>
          <p className="text-muted-foreground mt-4">
            Faça login para ver sua carta, sua patente e o quanto falta pra encostar no topo do leaderboard da tropa.
          </p>
          <Button asChild size="xl" className="mt-6">
            <Link href="/entrar">
              Entrar agora <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function Feature({ icon: Icon, title, description }: { icon: typeof Crown; title: string; description: string }) {
  return (
    <div className="glass rounded-xl p-6 hover:border-gold-500/30 border border-white/5 transition-colors">
      <div className="size-10 grid place-items-center rounded-md bg-gold-500/15 text-gold-300 mb-4">
        <Icon className="size-5" />
      </div>
      <h3 className="font-display text-xl tracking-wider mb-1">{title.toUpperCase()}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
