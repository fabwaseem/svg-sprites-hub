import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const tags = searchParams.getAll("tags");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.IconWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Build orderBy clause
    const orderBy: Prisma.IconOrderByWithRelationInput = {};
    if (sortBy === "name") {
      orderBy.name = sortOrder as Prisma.SortOrder | undefined;
    } else {
      orderBy.createdAt = sortOrder as Prisma.SortOrder | undefined;
    }

    // Fetch icons with pagination
    const [icons, total] = await Promise.all([
      prisma.icon.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
          sprite: {
            select: {
              id: true,
              name: true,
              category: true,
              tags: true,
            },
          },
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.icon.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const hasMore = page < totalPages;

    return NextResponse.json({
      icons,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching icons:", error);
    return NextResponse.json(
      { error: "Failed to fetch icons" },
      { status: 500 }
    );
  }
}
