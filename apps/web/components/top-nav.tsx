"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, ScanLine, Edit3, Users, Wallet, Settings, Menu, X, Receipt } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { slideDown, staggerContainerFast } from "@/lib/motion";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/receipts", label: "Receipts", icon: Receipt },
  { href: "/dashboard/scan-receipt", label: "Scan Receipt", icon: ScanLine },
  { href: "/dashboard/manual", label: "Manual Entry", icon: Edit3 },
  { href: "/dashboard/groups", label: "Groups", icon: Users },
  { href: "/dashboard/settle", label: "Settle Up", icon: Wallet },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function TopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center justify-center shrink-0 h-full mt-2"
        >
          <Image
            src="/web-logo.png"
            alt="Billo"
            width={32}
            height={32}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Button & Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <UserButton />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-border shadow-lg overflow-hidden"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideDown}
          >
            <motion.div
              className="px-6 py-4 space-y-1"
              variants={staggerContainerFast}
              initial="initial"
              animate="animate"
            >
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="size-5" />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                className="pt-4 border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navItems.length * 0.05 + 0.1 }}
              >
                <div className="px-4">
                  <UserButton />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
