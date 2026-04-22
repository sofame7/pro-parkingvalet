import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ScheduleCard from "@/components/ScheduleCard";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  // Only Admin can see history
  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin) {
    redirect("/dashboard");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch past schedules
  const schedules = await prisma.schedule.findMany({
    where: {
      date: {
        lt: today,
      },
    },
    orderBy: { date: "desc" }, // Show most recent past first
    include: { users: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ιστορικό Προγράμματος</h1>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
          <p className="text-gray-500 font-medium">Δεν υπάρχουν παλιές βάρδιες στο ιστορικό</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} currentUserId={session.user.id} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
