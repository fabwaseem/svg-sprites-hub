import { useQuery } from "@tanstack/react-query";

export type PopularTag = string;

export function usePopularTags() {
  return useQuery<PopularTag[]>({
    queryKey: ["popular-tags"],
    queryFn: async () => {
      const res = await fetch("/api/popular-tags");
      if (!res.ok) throw new Error("Failed to fetch popular tags");
      const data = await res.json();
      return data.tags;
    },
  });
}
