import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { spriteId } = await req.json();
  if (!spriteId) {
    return NextResponse.json({ error: "Missing spriteId" }, { status: 400 });
  }
  const favourite = await prisma.favourite.upsert({
    where: { userId_spriteId: { userId: session.user.id, spriteId } },
    update: {},
    create: { userId: session.user.id, spriteId },
  });
  return NextResponse.json({ favourite });
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { spriteId } = await req.json();
  if (!spriteId) {
    return NextResponse.json({ error: "Missing spriteId" }, { status: 400 });
  }
  await prisma.favourite.deleteMany({
    where: { userId: session.user.id, spriteId },
  });
  return NextResponse.json({ success: true });
}
