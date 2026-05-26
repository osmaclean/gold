import { requireUser } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/feature/section-heading"
import { AchievementCard } from "@/components/cards/achievement-card"
import { getAllAchievementsWithStatus } from "@/features/achievements/queries"

export const metadata = { title: "Conquistas" }

export default async function AchievementsPage() {
  const user = await requireUser()
  const achievements = await getAllAchievementsWithStatus(user.id)

  const unlocked = achievements.filter((a) => a.unlocked).length

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Conquistas"
        description={`${unlocked}/${achievements.length} desbloqueadas`}
      />
      <Card className="p-6">
        <div className="grid sm:grid-cols-2 gap-3">
          {achievements.map((a) => (
            <AchievementCard
              key={a.id}
              achievement={a}
              unlocked={a.unlocked}
              unlockedAt={a.unlockedAt}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}
