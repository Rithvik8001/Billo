"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  CreditCard,
  PieChart,
  ArrowUpRight,
  Coffee,
  ShoppingCart,
  Utensils,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  // Placeholder data for recent activities
  const recentActivities = [
    {
      id: 1,
      type: "expense",
      category: "Food",
      amount: 25.5,
      description: "Lunch at Cafe",
      date: "Today, 2:15 PM",
      icon: Coffee,
    },
    {
      id: 2,
      type: "expense",
      category: "Shopping",
      amount: 120.0,
      description: "Grocery shopping",
      date: "Today, 11:30 AM",
      icon: ShoppingCart,
    },
    {
      id: 3,
      type: "expense",
      category: "Food",
      amount: 45.0,
      description: "Dinner with friends",
      date: "Yesterday, 8:20 PM",
      icon: Utensils,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.email?.split("@")[0]}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Budget
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,000</div>
            <p className="text-xs text-muted-foreground">38.2% remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Food</div>
            <p className="text-xs text-muted-foreground">32% of expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 on track</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {activity.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          ${activity.amount.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {activity.date}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
