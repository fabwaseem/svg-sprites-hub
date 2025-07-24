import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useToggleFavourite(spriteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (favourited: boolean) => {
      const method = favourited ? "DELETE" : "POST";
      const res = await fetch("/api/favourites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spriteId }),
      });
      if (!res.ok) throw new Error("Failed to update favourite");
      return await res.json();
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["sprites"] });
    },
  });
}
