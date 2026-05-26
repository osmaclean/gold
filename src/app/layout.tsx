import type { Metadata } from "next"
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/providers/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { APP_NAME } from "@/lib/constants"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Plataforma de CS2`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Plataforma competitiva privada da Tropa da Gold. Rankings, partidas, cartas estilo FUT e temporadas em CS2.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-cinematic min-h-full font-sans text-foreground">
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  )
}
