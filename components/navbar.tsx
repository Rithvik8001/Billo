"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { UserNav } from "./dashboard/user-nav";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-primary">Billo</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
              <UserNav />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-accent rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button className="w-full justify-start">Go to Dashboard</Button>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserNav />
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="w-full justify-start">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full justify-start">Get Started</Button>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
