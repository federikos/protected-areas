/*
  Warnings:

  - You are about to drop the column `internationalStatusId` on the `ProtectedArea` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProtectedArea" DROP CONSTRAINT "ProtectedArea_internationalStatusId_fkey";

-- AlterTable
ALTER TABLE "InternationalStatus" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "ProtectedArea" DROP COLUMN "internationalStatusId";

-- CreateTable
CREATE TABLE "_InternationalStatusToProtectedArea" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InternationalStatusToProtectedArea_AB_unique" ON "_InternationalStatusToProtectedArea"("A", "B");

-- CreateIndex
CREATE INDEX "_InternationalStatusToProtectedArea_B_index" ON "_InternationalStatusToProtectedArea"("B");

-- AddForeignKey
ALTER TABLE "_InternationalStatusToProtectedArea" ADD CONSTRAINT "_InternationalStatusToProtectedArea_A_fkey" FOREIGN KEY ("A") REFERENCES "InternationalStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InternationalStatusToProtectedArea" ADD CONSTRAINT "_InternationalStatusToProtectedArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ProtectedArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
