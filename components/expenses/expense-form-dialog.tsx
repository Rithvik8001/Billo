"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { expenseSchema, type ExpenseInput } from "@/lib/validations/expense";
import { useExpenses } from "@/hooks/use-expenses";
import { type Expense, type Category } from "@/lib/api-client";
import { useCategories } from "@/hooks/use-categories";

interface ExpenseFormDialogProps {
  expense?: Expense;
  trigger?: React.ReactNode;
}

export function ExpenseFormDialog({
  expense,
  trigger,
}: ExpenseFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { addExpense, updateExpense } = useExpenses();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const form = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          amount: expense.amount,
          description: expense.description,
          date: expense.date,
          categoryId: expense.categoryId,
        }
      : {
          amount: 0,
          description: "",
          date: new Date().toISOString(),
          categoryId: "",
        },
  });

  const isLoading =
    form.formState.isSubmitting ||
    addExpense.isPending ||
    updateExpense.isPending;

  async function onSubmit(data: ExpenseInput) {
    try {
      if (expense) {
        await updateExpense.mutateAsync({
          id: expense.id,
          expense: data,
        });
      } else {
        await addExpense.mutateAsync(data);
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error is handled by the mutation
      console.error("Failed to save expense:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Edit" : "Add"} Expense</DialogTitle>
          <DialogDescription>
            {expense
              ? "Make changes to your expense here."
              : "Add a new expense to track your spending."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Groceries, Rent, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(date?.toISOString() ?? "")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category: Category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading
                  ? "Saving..."
                  : expense
                  ? "Save Changes"
                  : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
