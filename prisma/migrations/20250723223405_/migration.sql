/*
  Warnings:

  - Added the required column `updatedAt` to the `Sprite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Icon" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Sprite" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
