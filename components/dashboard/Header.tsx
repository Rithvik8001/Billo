"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-50 border-b border-gray-200">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-[52px]">
            <div className="flex items-center gap-4 sm:gap-8">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-gray-900">
                  Billo
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Overview
                </Link>
                <Link
                  href="/groups"
                  className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Groups
                </Link>
                <Link
                  href="/expenses"
                  className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Expenses
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <UserButton
                appearance={{
                  elements: {
                    userButtonBox: "h-8 w-8 sm:h-[32px] sm:w-[32px]",
                    userButtonTrigger: "h-8 w-8 sm:h-[32px] sm:w-[32px]",
                    userButtonAvatarBox: "h-8 w-8 sm:h-[32px] sm:w-[32px]",
                  },
                }}
              />
              <button
                className="md:hidden -mr-1 p-1.5"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-5 w-5 text-gray-900" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-900" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[52px] bg-white/80 backdrop-blur-xl border-b border-gray-200 z-40 md:hidden"
          >
            <div className="max-w-[1120px] mx-auto px-4 py-3">
              <nav className="flex flex-col">
                <Link
                  href="/dashboard"
                  className="text-[15px] font-medium text-gray-900 px-2 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Overview
                </Link>
                <Link
                  href="/groups"
                  className="text-[15px] font-medium text-gray-900 px-2 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Groups
                </Link>
                <Link
                  href="/expenses"
                  className="text-[15px] font-medium text-gray-900 px-2 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Expenses
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
