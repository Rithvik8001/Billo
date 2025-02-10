import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type Expense } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export function useExpenses() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: () => api.expenses.list(),
    enabled: !!user,
  });

  const addExpense = useMutation({
    mutationFn: api.expenses.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense added successfully");
    },
    onError: () => {
      toast.error("Failed to add expense");
    },
  });

  const updateExpense = useMutation({
    mutationFn: api.expenses.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense updated successfully");
    },
    onError: () => {
      toast.error("Failed to update expense");
    },
  });

  const deleteExpense = useMutation({
    mutationFn: api.expenses.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete expense");
    },
  });

  return {
    expenses,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => api.expenses.get(id),
    enabled: !!id,
  });
}
