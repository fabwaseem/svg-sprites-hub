-- CreateTable
CREATE TABLE "Sprite" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Sprite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Icon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "svg" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spriteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Icon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sprite" ADD CONSTRAINT "Sprite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Icon" ADD CONSTRAINT "Icon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Icon" ADD CONSTRAINT "Icon_spriteId_fkey" FOREIGN KEY ("spriteId") REFERENCES "Sprite"("id") ON DELETE SET NULL ON UPDATE CASCADE;
