import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import type { Sprite, Pagination } from "@/types";

export interface UseSpritesOptions {
  category?: string;
  tags?: string[];
  userId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "downloadCount";
  sortOrder?: "asc" | "desc";
}

type UseSpritesData = {
  sprites: Sprite[];
  meta: Pagination;
};

export function useSprites(options: UseSpritesOptions = {}) {
  return useInfiniteQuery<UseSpritesData, Error, InfiniteData<UseSpritesData>>({
    queryKey: ["sprites", options],
    queryFn: async ({ pageParam = options.page || 1 }) => {
      const params = new URLSearchParams();
      if (options.category) params.append("category", options.category);
      if (options.userId) params.append("userId", options.userId);
      if (options.search) params.append("search", options.search);
      if (options.tags && options.tags.length)
        options.tags.forEach((tag) => params.append("tags", tag));
      params.append("page", String(pageParam));
      if (options.pageSize) params.append("pageSize", String(options.pageSize));
      if (options.sortBy) params.append("sortBy", options.sortBy);
      if (options.sortOrder) params.append("sortOrder", options.sortOrder);

      const res = await fetch(`/api/sprites?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch sprites");
      return res.json();
    },
    getNextPageParam: (lastPage: UseSpritesData, allPages) => {
      if (lastPage.meta?.hasMore) {
        return (allPages.length || 1) + 1;
      }
      return undefined;
    },
    initialPageParam: options.page || 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
