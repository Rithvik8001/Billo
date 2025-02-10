"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useExpenses } from "@/hooks/use-expenses";
import { ExpenseFormDialog } from "./expense-form-dialog";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Expense } from "@/lib/api-client";

interface ExpensesListProps {
  expenses?: Expense[];
  showAddButton?: boolean;
}

export function ExpensesList({
  expenses: filteredExpenses,
  showAddButton = true,
}: ExpensesListProps) {
  const { expenses, isLoading, deleteExpense } = useExpenses();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const displayExpenses = filteredExpenses || expenses;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (displayExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 gap-4">
        <p className="text-muted-foreground">No expenses found</p>
        {showAddButton && <ExpenseFormDialog />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Expenses</h2>
        {showAddButton && <ExpenseFormDialog />}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {format(new Date(expense.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: expense.category.color }}
                    />
                    {expense.category.name}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  ${expense.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <ExpenseFormDialog
                          expense={expense}
                          trigger={
                            <button className="w-full flex items-center">
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </button>
                          }
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() => setDeleteId(expense.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={async () => {
                if (deleteId) {
                  await deleteExpense.mutateAsync(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              {deleteExpense.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
