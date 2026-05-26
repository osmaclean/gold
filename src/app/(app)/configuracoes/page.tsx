import { requireUser } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/feature/section-heading"
import { ProfileForm } from "./profile-form"

export const metadata = { title: "Configurações" }

export default async function SettingsPage() {
  const user = await requireUser()
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <SectionHeading title="Configurações" description="Edite seu perfil público." />
      <Card className="p-6">
        <ProfileForm userId={user.id} initial={{ nickname: user.nickname, bio: user.bio }} />
      </Card>
    </div>
  )
}
