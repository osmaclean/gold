import { Card } from "@/components/ui/card"

export const metadata = { title: "Regras" }

export default function RulesPage() {
  return (
    <div className="px-6 md:px-12 max-w-3xl mx-auto py-10">
      <h1 className="font-display text-4xl md:text-5xl tracking-widest text-shine">
        REGRAS DA TROPA
      </h1>
      <Card className="p-8 mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl tracking-wider text-foreground mb-2">1. Convite</h2>
          <p>Plataforma privada da Tropa da Gold. Acesso só por convite — admins controlam quem entra.</p>
        </section>
        <section>
          <h2 className="font-display text-xl tracking-wider text-foreground mb-2">2. Partidas</h2>
          <p>Toda partida é registrada por um admin com o lineup, scoreboard, MVP e destaque. Stats agregadas, elo e cartas atualizam em seguida.</p>
        </section>
        <section>
          <h2 className="font-django text-xl tracking-wider text-foreground mb-2">3. Cartas</h2>
          <p>Cada player tem uma carta única estilo FUT. AIM, CLUTCH, ENTRY e AWP são derivadas das partidas. SUPPORT, MOVEMENT, GAME SENSE e COMMS são ajustadas por admins.</p>
        </section>
        <section>
          <h2 className="font-display text-xl tracking-wider text-foreground mb-2">4. Seasons</h2>
          <p>Cada temporada tem leaderboard próprio. No fim, o top 3 ganha troféus e o ranking pode ser parcialmente resetado.</p>
        </section>
        <section>
          <h2 className="font-display text-xl tracking-wider text-foreground mb-2">5. Fair play</h2>
          <p>Toxicidade, smurf, cheats ou qualquer coisa que estrague a vibe → ban. Admins decidem.</p>
        </section>
      </Card>
    </div>
  )
}
