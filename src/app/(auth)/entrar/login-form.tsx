"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a14.71 14.71 0 0 0-.673 1.388 18.27 18.27 0 0 0-5.487 0A14.6 14.6 0 0 0 9.724 3 19.79 19.79 0 0 0 5.97 4.369C2.55 9.49 1.62 14.486 2.085 19.41a19.91 19.91 0 0 0 6.073 3.07c.49-.668.926-1.379 1.301-2.13a12.95 12.95 0 0 1-2.046-.984c.172-.124.34-.255.502-.39a14.26 14.26 0 0 0 12.456 0c.163.135.33.266.502.39-.654.391-1.344.72-2.05.984.375.751.81 1.462 1.301 2.13a19.93 19.93 0 0 0 6.077-3.07c.59-5.692-.92-10.643-3.884-15.041ZM9.345 16.43c-1.179 0-2.149-1.088-2.149-2.426 0-1.339.95-2.426 2.149-2.426 1.21 0 2.179 1.087 2.149 2.426 0 1.338-.94 2.426-2.149 2.426Zm5.31 0c-1.179 0-2.149-1.088-2.149-2.426 0-1.339.95-2.426 2.149-2.426 1.21 0 2.179 1.087 2.149 2.426 0 1.338-.94 2.426-2.149 2.426Z" />
    </svg>
  )
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard"

  const [email, setEmail] = useState("")
  const [magicSent, setMagicSent] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isDiscordPending, setDiscordPending] = useState(false)

  function handleMagicLink(formData: FormData) {
    const emailValue = String(formData.get("email") ?? "").trim()
    if (!emailValue) {
      toast.error("Informe seu e-mail.")
      return
    }

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: emailValue,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            redirectTo
          )}`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setMagicSent(true)
      toast.success("Link mágico enviado! Confira seu e-mail.")
    })
  }

  async function handleDiscord() {
    setDiscordPending(true)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    })
    if (error) {
      toast.error(error.message)
      setDiscordPending(false)
    } else {
      router.refresh()
    }
  }

  if (magicSent) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-4">
        <div className="size-12 grid place-items-center rounded-full bg-gold-500/15 text-gold-300">
          <Mail className="size-6" />
        </div>
        <div>
          <h2 className="font-display text-xl">Verifique seu e-mail</h2>
          <p className="text-sm text-muted-foreground">
            Enviamos um link mágico para <span className="text-foreground">{email}</span>.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMagicSent(false)}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <Button
        type="button"
        variant="glass"
        size="lg"
        onClick={handleDiscord}
        disabled={isDiscordPending}
        className="justify-center"
      >
        {isDiscordPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <DiscordIcon className="size-5 text-[#5865F2]" />
        )}
        Entrar com Discord
      </Button>

      <div className="flex items-center gap-3">
        <div className="divider-gold flex-1" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          ou pelo e-mail
        </span>
        <div className="divider-gold flex-1" />
      </div>

      <form
        action={handleMagicLink}
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          handleMagicLink(new FormData(e.currentTarget))
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@tropa.gold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
          Enviar link mágico
        </Button>
      </form>
    </div>
  )
}
