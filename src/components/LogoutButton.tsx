"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-2"
      title="Αποσύνδεση"
    >
      <LogOut size={20} />
      <span className="hidden sm:inline text-sm font-medium">Αποσύνδεση</span>
    </button>
  );
}
