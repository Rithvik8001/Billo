"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  PieChart,
  Settings,
  Tag,
} from "lucide-react";

const links = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
  { name: "Categories", href: "/dashboard/categories", icon: Tag },
  { name: "Budget", href: "/dashboard/budget", icon: DollarSign },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2 p-4">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === link.href ? "bg-accent" : "transparent"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
