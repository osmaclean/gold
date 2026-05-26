import type { NextConfig } from "next"

const supabaseHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
})()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Avatars do Discord OAuth
      { protocol: "https", hostname: "cdn.discordapp.com" },
      // Storage do próprio Supabase (avatars customizados, banners, etc)
      ...(supabaseHost ? [{ protocol: "https" as const, hostname: supabaseHost }] : []),
      // Fallback se o usuário trocar de provider OAuth futuramente
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
}

export default nextConfig
