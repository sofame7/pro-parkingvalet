import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  // If Admin, root div gets "dark bg-background text-foreground"
  // If Employee, it stays light mode.
  const themeClass = isAdmin ? "dark" : "";

  return (
    <div className={`${themeClass} min-h-screen bg-background text-foreground flex flex-col`}>
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <img src="https://i.imgur.com/bYie3uV.png" alt="Logo" className="h-8" />
              </Link>
              
              <div className="flex items-center gap-4 sm:gap-4 md:gap-4 flex-wrap">
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                   Πρόγραμμα
                </Link>
                {isAdmin && (
                  <>
                    <Link href="/dashboard/users" className="text-sm font-medium hover:text-primary transition-colors">
                      Υπάλληλοι
                    </Link>
                    <Link href="/dashboard/history" className="text-sm font-medium hover:text-primary transition-colors">
                      Ιστορικό
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm hidden sm:block">
                <p className="font-semibold">{session.user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{isAdmin ? 'Διαχειριστής' : 'Υπάλληλος'}</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
