"use client";

import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 border-b border-white/10 bg-black/80 backdrop-blur-sm z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <Link
            href="/dashboard"
            className="text-2xl font-extrabold tracking-tighter text-white"
          >
            Billo
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
