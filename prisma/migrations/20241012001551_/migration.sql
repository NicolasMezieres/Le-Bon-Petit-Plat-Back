/*
  Warnings:

  - You are about to drop the column `notes` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "notes",
ADD COLUMN     "note" DECIMAL(65,30) NOT NULL DEFAULT 0;
