import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // Get all tags from all sprites
  const sprites = await prisma.sprite.findMany({ select: { tags: true } });
  const tagCounts: Record<string, number> = {};
  for (const sprite of sprites) {
    for (const tag of sprite.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  // Sort tags by frequency and return top 20
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag]) => tag);
  return NextResponse.json({ tags: popularTags });
}
