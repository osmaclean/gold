import { Card } from "@/components/ui/card"

export const metadata = { title: "Sobre" }

export default function AboutPage() {
  return (
    <div className="px-6 md:px-12 max-w-3xl mx-auto py-10">
      <h1 className="font-display text-4xl md:text-5xl tracking-widest text-shine">
        SOBRE A TROPA
      </h1>
      <Card className="p-8 mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Tropa da Gold é uma plataforma competitiva privada criada por amigos que jogam CS2 juntos.
          A ideia é simples: transformar nossos racha de fim de semana em algo que dê vontade de jogar
          a próxima — com leaderboard, cartas, conquistas e a sensação de evolução de um produto profissional de esports.
        </p>
        <p>
          Não tem fins comerciais. É <strong className="text-foreground">só pra galera</strong>.
        </p>
      </Card>
    </div>
  )
}
