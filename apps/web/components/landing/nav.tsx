"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { GitHub } from "@/components/github";

export default function Nav() {
  const { isSignedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 bg-background/80 backdrop-blur-md border-b border-border/60"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
      >
        <div className="flex items-center h-full">
          <Link href="/">
            <Image
              src="/web-logo.png"
              alt="Billo"
              width={32}
              height={32}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="hidden sm:flex items-center h-full gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="https://github.com/Rithvik8001/Billo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <GitHub className="size-4" />
              <span>Star on GitHub</span>
            </Link>
          </Button>
          {!isSignedIn && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>

        <button
          onClick={toggleMenu}
          className="sm:hidden w-10 h-10 flex items-center justify-center relative z-50"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </motion.nav>

      <div
        className={`sm:hidden fixed inset-0 bg-background z-30 transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col pt-20 px-6 gap-3">
          {!isSignedIn && (
            <>
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={closeMenu}
              >
                <Link href="/sign-in">
                  <span>Sign In</span>
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="w-full"
                onClick={closeMenu}
              >
                <Link href="/sign-up">
                  <span>Get Started</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
