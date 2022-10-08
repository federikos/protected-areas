/*
  Warnings:

  - You are about to drop the column `categoryColor` on the `Category` table. All the data in the column will be lost.
  - Added the required column `color` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "categoryColor",
ADD COLUMN     "color" VARCHAR(7) NOT NULL;
