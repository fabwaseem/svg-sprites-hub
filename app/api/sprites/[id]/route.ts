import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "30");
    const iconsOnly = searchParams.get("iconsOnly") === "true";

    if (!id) {
      return NextResponse.json(
        { error: "Sprite ID is required" },
        { status: 400 }
      );
    }

    // If requesting icons only (for infinite loading)
    if (iconsOnly) {
      const skip = (page - 1) * pageSize;

      const [icons, totalIcons] = await Promise.all([
        prisma.icon.findMany({
          where: { spriteId: id },
          orderBy: { createdAt: "asc" },
          skip,
          take: pageSize,
        }),
        prisma.icon.count({
          where: { spriteId: id },
        }),
      ]);

      const totalPages = Math.ceil(totalIcons / pageSize);
      const hasMore = page < totalPages;

      return NextResponse.json({
        icons,
        pagination: {
          page,
          pageSize,
          total: totalIcons,
          totalPages,
          hasMore,
        },
      });
    }

    // Fetch sprite with limited icons (first 30)
    const sprite = await prisma.sprite.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        icons: {
          orderBy: {
            createdAt: "asc",
          },
          take: pageSize, // Only get first 30 icons
        },
        _count: {
          select: {
            favourites: true,
            icons: true, // Get total icon count
          },
        },
      },
    });

    if (!sprite) {
      return NextResponse.json({ error: "Sprite not found" }, { status: 404 });
    }

    // Add isFavourite field and pagination info
    const spriteWithFavorite = {
      ...sprite,
      isFavourite: false, // TODO: Implement based on user session
      totalIcons: sprite._count.icons,
      hasMoreIcons: sprite._count.icons > pageSize,
    };

    return NextResponse.json(spriteWithFavorite);
  } catch (error) {
    console.error("Error fetching sprite details:", error);
    return NextResponse.json(
      { error: "Failed to fetch sprite details" },
      { status: 500 }
    );
  }
}

// Update sprite (for future use)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedSprite = await prisma.sprite.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        icons: true,
      },
    });

    return NextResponse.json(updatedSprite);
  } catch (error) {
    console.error("Error updating sprite:", error);
    return NextResponse.json(
      { error: "Failed to update sprite" },
      { status: 500 }
    );
  }
}

// Delete sprite (for future use)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.sprite.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sprite:", error);
    return NextResponse.json(
      { error: "Failed to delete sprite" },
      { status: 500 }
    );
  }
}
