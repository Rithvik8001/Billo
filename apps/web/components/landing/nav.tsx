"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GitHub } from "@/components/github";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const { isSignedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="border-b h-16 flex items-center justify-between px-4 md:px-6 relative z-40 bg-[#F4EDEB]">
        <div className="flex items-center h-full">
          <Image
            src="/web-logo.png"
            alt="Billo"
            width={50}
            height={50}
            className="object-contain self-center mt-3"
          />
        </div>

        <div className="hidden sm:flex items-center h-full gap-2 md:gap-3">
          <Button variant={"destructive"} size="sm" asChild>
            <Link href="https://github.com/Rithvik8001/Billo" target="_blank">
              <GitHub className="size-4 mr-2" />
              <span className="hidden md:inline">Star on GitHub</span>
            </Link>
          </Button>

          {!isSignedIn && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">
                  <span>Login</span>
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">
                  <span>Sign Up</span>
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
      </nav>

      <div
        className={`sm:hidden fixed inset-0 bg-[#F4EDEB] z-30 transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col pt-20 px-6 gap-4">
          <Button
            variant={"destructive"}
            size="lg"
            asChild
            className="w-full h-14 text-base rounded-2xl"
            onClick={closeMenu}
          >
            <Link href="https://github.com/Rithvik8001/Billo" target="_blank">
              <GitHub className="size-5 mr-2" />
              <span>Star on GitHub</span>
            </Link>
          </Button>

          {!isSignedIn && (
            <>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full h-14 text-base rounded-2xl bg-white"
                onClick={closeMenu}
              >
                <Link href="/sign-in">
                  <span>Login</span>
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="w-full h-14 text-base rounded-2xl"
                onClick={closeMenu}
              >
                <Link href="/sign-up">
                  <span>Sign Up</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
