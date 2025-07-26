"use client";

import { useQuery } from "@tanstack/react-query";

export interface Stats {
  totalSprites: number;
  totalIcons: number;
  totalUsers: number;
  totalDownloads: number;
  totalFavourites: number;
}

async function fetchStats(): Promise<Stats> {
  const response = await fetch("/api/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
