import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import ScheduleCard from "@/components/ScheduleCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const isAdmin = session.user.role === "ADMIN";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch schedules
  let schedules = [];
  if (isAdmin) {
    schedules = await prisma.schedule.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: { date: "asc" },
      include: { users: true },
    });
  } else {
    schedules = await prisma.schedule.findMany({
      where: {
        date: {
          gte: today,
        },
        users: {
          some: {
            id: session.user.id,
          },
        },
      },
      orderBy: { date: "asc" },
      include: { users: true },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Πρόγραμμα Εργασίας</h1>
        {isAdmin && (
          <Link
            href="/dashboard/schedules/new"
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-xl font-semibold shadow-md glow transition-all"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Νέο Πρόγραμμα</span>
          </Link>
        )}
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
          <p className="text-gray-500 font-medium">Δεν υπάρχει διαθέσιμο πρόγραμμα</p>
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
