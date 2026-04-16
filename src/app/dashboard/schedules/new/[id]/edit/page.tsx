import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditScheduleForm from "./ClientPage";

export default async function EditSchedulePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = params;

  // Fetch the schedule to edit
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: { users: true }
  });

  if (!schedule) {
    redirect("/dashboard");
  }

  // Fetch only active employees
  const users = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    orderBy: { name: "asc" }
  });

  return <EditScheduleForm users={users} schedule={schedule} />;
}
