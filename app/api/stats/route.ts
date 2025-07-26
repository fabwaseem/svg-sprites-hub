import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      totalSprites,
      totalIcons,
      totalUsers,
      totalDownloads,
      totalFavourites,
    ] = await Promise.all([
      prisma.sprite.count(),
      prisma.icon.count(),
      prisma.user.count(),
      prisma.sprite.aggregate({
        _sum: {
          downloadCount: true,
        },
      }),
      prisma.favourite.count(),
    ]);

    const stats = {
      totalSprites,
      totalIcons,
      totalUsers,
      totalDownloads: totalDownloads._sum.downloadCount || 0,
      totalFavourites,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
