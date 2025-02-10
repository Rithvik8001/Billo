"use client";

import { useAuth } from "@/contexts/auth-context";
import { ExpensesList } from "@/components/expenses/expenses-list";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExpenses } from "@/hooks/use-expenses";
import { useCategories } from "@/hooks/use-categories";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type Category } from "@/lib/api-client";

export default function ExpensesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { expenses, isLoading: expensesLoading } = useExpenses();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Calculate total expenses for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthExpenses =
    expenses?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    }) || [];

  const totalThisMonth = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Group expenses by category for current month
  const expensesByCategory = currentMonthExpenses.reduce((acc, expense) => {
    const categoryId = expense.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }
    acc[categoryId] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const isLoading = expensesLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground">
          Manage and track your expenses here
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Total This Month</h3>
            <p className="text-2xl font-bold">${totalThisMonth.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(), "MMMM yyyy")}
            </p>
          </div>
        </Card>

        {categories?.map((category: Category) => {
          const amount = expensesByCategory[category.id] || 0;
          const percentage =
            totalThisMonth > 0
              ? ((amount / totalThisMonth) * 100).toFixed(1)
              : "0";

          return (
            <Card key={category.id} className="p-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-medium">{category.name}</h3>
                </div>
                <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{percentage}%</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card className="p-6">
            <ExpensesList />
          </Card>
        </TabsContent>
        <TabsContent value="month" className="space-y-4">
          <Card className="p-6">
            <ExpensesList
              expenses={currentMonthExpenses}
              showAddButton={false}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
