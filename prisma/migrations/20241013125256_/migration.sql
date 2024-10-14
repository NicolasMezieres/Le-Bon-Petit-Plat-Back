/*
  Warnings:

  - You are about to drop the column `ingredient` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "ingredient";

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "ingredient" TEXT NOT NULL,
    "idRecipe" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_idRecipe_fkey" FOREIGN KEY ("idRecipe") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
