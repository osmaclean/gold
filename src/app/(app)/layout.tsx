import { requireUser } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PageTransition } from "@/components/motion/page-transition"

export const dynamic = "force-dynamic"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  return (
    <div className="flex min-h-screen w-full bg-cinematic">
      <Sidebar isAdmin={user.role === "ADMIN"} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-[1500px] w-full mx-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
