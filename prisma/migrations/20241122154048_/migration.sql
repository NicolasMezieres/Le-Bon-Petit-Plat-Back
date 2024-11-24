/*
  Warnings:

  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_idRecipe_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "ingredient" JSONB[];

-- DropTable
DROP TABLE "Ingredient";
