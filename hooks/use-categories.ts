import { useQuery } from "@tanstack/react-query";
import { api, type Category } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";

export function useCategories() {
  const { user } = useAuth();

  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.categories.list(),
    enabled: !!user,
  });
}
