"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Λάθος email ή κωδικός πρόσβασης.");
      setLoading(false);
    } else {
      toast.success("Επιτυχής σύνδεση!");
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0B0B] p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all">
        <div className="p-8">
          <div className="text-center mb-8">
            <img 
              src="https://i.imgur.com/bYie3uV.png" 
              alt="Pro Parking Valet" 
              className="h-20 mx-auto object-contain mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Καλώς ήρθατε</h2>
            <p className="text-sm text-gray-500 mt-1">Συνδεθείτε για να δείτε το πρόγραμμα</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#262626] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="toemail@sas.gr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Κωδικός 
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#262626] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-black font-semibold py-3 rounded-xl shadow-lg glow disabled:opacity-70 disabled:cursor-not-allowed hover-glow mt-4"
            >
              {loading ? "Σύνδεση..." : "Είσοδος"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
