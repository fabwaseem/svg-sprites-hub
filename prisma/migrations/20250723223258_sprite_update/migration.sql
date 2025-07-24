/*
  Warnings:

  - You are about to drop the column `author` on the `Sprite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sprite" DROP COLUMN "author",
ALTER COLUMN "description" DROP NOT NULL;
