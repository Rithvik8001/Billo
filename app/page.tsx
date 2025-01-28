"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Hero Section */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative inline-block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-3xl" />
              <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
                <span className="block mb-2">Split Bills</span>
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Without the Stress
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Effortlessly manage shared expenses with friends, roommates, and
              groups. Track who owes what, split bills instantly, and keep
              everyone on the same page.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-gray-700 bg-white rounded-full hover:bg-gray-50 transition-all duration-200 shadow-md border border-gray-200"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          {/* Feature Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-32"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-2xl transform group-hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100" />
                <div className="relative p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-200">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mb-6">
                    <svg
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Create Groups
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Organize expenses by creating groups for roommates, trips,
                    or events. Keep everything organized in one place.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-2xl transform group-hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100" />
                <div className="relative p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-200">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mb-6">
                    <svg
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Track Expenses
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Add and manage expenses with ease. Split bills evenly or
                    with custom amounts among group members.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-2xl transform group-hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100" />
                <div className="relative p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-200">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mb-6">
                    <svg
                      className="h-7 w-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Instant Calculations
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get real-time updates on who owes what. Simplify debt
                    settlement with automatic calculations.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
