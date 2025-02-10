import axios from "axios";
import { auth } from "./auth";
import { ExpenseInput, UpdateExpenseInput } from "./validations/expense";

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

const client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
client.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  expenses: {
    list: async (): Promise<Expense[]> => {
      const { data } = await client.get("/expenses");
      return data;
    },
    get: async (id: string): Promise<Expense> => {
      const { data } = await client.get(`/expenses/${id}`);
      return data;
    },
    create: async (expense: ExpenseInput): Promise<Expense> => {
      const { data } = await client.post("/expenses", expense);
      return data;
    },
    update: async ({
      id,
      expense,
    }: {
      id: string;
      expense: UpdateExpenseInput;
    }): Promise<Expense> => {
      const { data } = await client.patch(`/expenses/${id}`, expense);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await client.delete(`/expenses/${id}`);
    },
  },
  categories: {
    list: async (): Promise<Category[]> => {
      const { data } = await client.get("/categories");
      return data;
    },
  },
};
