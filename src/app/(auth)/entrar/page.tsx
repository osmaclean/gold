import Link from "next/link"
import { Suspense } from "react"
import { Crown, Loader2 } from "lucide-react"
import { LoginForm } from "./login-form"
import { APP_NAME } from "@/lib/constants"

export const metadata = {
  title: "Entrar",
}

export default function EntrarPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display tracking-widest text-2xl text-shine"
        >
          <Crown className="size-6 text-gold-300" />
          {APP_NAME.toUpperCase()}
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">
          Entre pelo seu e-mail ou Discord para jogar com a tropa.
        </p>
      </div>

      <div className="glass-strong rounded-xl p-6 ring-1 ring-white/5">
        <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-gold-300" /></div>}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Acesso restrito a membros da tropa. Admin precisa aprovar.
      </p>
    </div>
  )
}
