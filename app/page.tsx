"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 border-b border-white/10 bg-black/80 backdrop-blur-sm z-[100] h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl lg:text-4xl font-extrabold tracking-tighter">
                Billo
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 transition-all duration-200"
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
              {!isOpen && (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
          <div className="min-h-screen px-6 pt-24 pb-12">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Top Navigation Links */}
            <div className="space-y-6 mb-20">
              <Link
                href="/login"
                className="block text-[32px] text-white/50 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="block text-[32px] text-white/50 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Get started
              </Link>
            </div>

            {/* Hero Content */}
            <div className="space-y-6">
              <h1 className="text-[56px] font-bold leading-none tracking-tight">
                Split Bills
                <div className="mt-4">
                  <span className="text-[#4F46E5]">Without</span>
                </div>
                <div className="mt-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#EC4899]">
                    the Drama
                  </span>
                </div>
              </h1>

              <p className="text-[20px] leading-relaxed text-white/60 max-w-[600px]">
                The easiest way to track shared expenses and settle up with
                friends. No more awkward money conversations.
              </p>

              <div className="space-y-4 pt-4">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center rounded-md bg-white px-6 py-3 text-[16px] font-medium text-black hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Get started for free →
                </Link>
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center text-[16px] font-medium text-white/60 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in →
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="mt-24 space-y-12">
              <div className="rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-3">Create Groups</h3>
                <p className="text-white/60">
                  Create groups for roommates, trips, or events. Keep everything
                  organized in one place.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-3">Track Expenses</h3>
                <p className="text-white/60">
                  Add expenses and split them evenly or with custom amounts.
                  Attach receipts and notes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl [text-wrap:balance]">
                Split Bills{" "}
                <span className="bg-gradient-to-r from-[#4F46E5] via-[#9333EA] to-[#EC4899] bg-clip-text text-transparent">
                  Without the Drama
                </span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-400 max-w-2xl mx-auto">
                The easiest way to track shared expenses and settle up with
                friends. No more awkward money conversations.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/signup"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 transition-all group"
                >
                  Get started for free
                  <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">
                    →
                  </span>
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-semibold leading-6 text-gray-400 hover:text-white transition-colors"
                >
                  Sign in <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                className="group relative rounded-lg border border-white/10 p-8 hover:border-white/20 transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
