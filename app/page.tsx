"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-[#2997ff]/20 selection:text-[#2997ff] antialiased">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 border-b border-gray-100 bg-white/80 backdrop-blur-xl z-[100]">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link href="/" className="flex items-center">
              <span className="text-[28px] font-black tracking-tight">
                Billo
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-6">
              <Link
                href="/sign-in"
                className="text-[15px] font-medium text-gray-600 hover:text-[#2997ff] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-[15px] font-medium px-5 h-[36px] flex items-center justify-center rounded-full bg-[#2997ff] text-white hover:bg-[#0077ed] transition-all"
              >
                Get started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden relative z-[110] p-2 -mr-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {!isOpen ? (
                <Menu className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white">
          <div className="max-w-[980px] mx-auto px-8">
            {/* Close button at the top */}
            <div className="flex items-center justify-between h-[72px]">
              <Link href="/" className="flex items-center">
                <span className="text-[28px] font-black tracking-tight">
                  Billo
                </span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Menu items */}
            <div className="mt-8 space-y-6">
              <Link
                href="/sign-in"
                className="block text-[40px] font-semibold text-gray-900 hover:text-[#2997ff] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="block text-[40px] font-semibold text-gray-900 hover:text-[#2997ff] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main>
        <div className="relative pt-[120px] pb-16 px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[980px] mx-auto text-center"
          >
            <h1 className="text-[48px] sm:text-[72px] font-bold tracking-tighter text-gray-900">
              Split Bills {""}
              <br />
              <span className="bg-gradient-to-r from-[#E94E89] via-[#B845D4] to-[#7C4CF3] bg-clip-text text-transparent">
                Without the Drama
              </span>
            </h1>
            <p className="text-[21px] leading-[1.4] text-gray-500 max-w-[600px] mx-auto mb-4">
              The easiest way to track shared expenses and settle up with
              friends. No more awkward money conversations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto text-center text-[17px] font-medium px-8 h-[48px] flex items-center justify-center rounded-full bg-[#2997ff] text-white hover:bg-[#0077ed] transition-all"
              >
                Get started for free
              </Link>
              <Link
                href="/sign-in"
                className="w-full sm:w-auto text-center text-[17px] font-medium text-[#2997ff] hover:text-[#0077ed] transition-colors flex items-center justify-center h-[48px]"
              >
                Sign in <span className="ml-1">→</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="px-8 pb-32">
          <div className="max-w-[980px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Create Groups",
                  description:
                    "Create groups for roommates, trips, or events. Keep everything organized in one place.",
                },
                {
                  title: "Track Expenses",
                  description:
                    "Add expenses and split them evenly or with custom amounts. Attach receipts and notes.",
                },
                {
                  title: "Instant Settlements",
                  description:
                    "Get real-time updates on balances. Simplify debt settlement with automatic calculations.",
                },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group relative rounded-2xl border border-gray-200 bg-white p-8 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
