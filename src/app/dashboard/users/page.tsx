import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import UsersTable from "@/components/UsersTable";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Διαχείριση Υπαλλήλων</h1>
        <p className="text-gray-500">Προσθήκη, επεξεργασία και διαγραφή χρηστών.</p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
}
