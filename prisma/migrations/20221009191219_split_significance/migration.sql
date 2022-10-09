/*
  Warnings:

  - You are about to drop the column `significanceId` on the `ProtectedArea` table. All the data in the column will be lost.
  - You are about to drop the `Significance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProtectedArea" DROP CONSTRAINT "ProtectedArea_significanceId_fkey";

-- AlterTable
ALTER TABLE "ProtectedArea" DROP COLUMN "significanceId",
ADD COLUMN     "naturalMonumentSignificanceId" INTEGER,
ADD COLUMN     "reserveSignificanceId" INTEGER;

-- DropTable
DROP TABLE "Significance";

-- CreateTable
CREATE TABLE "ReserveSignificance" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" VARCHAR(7),

    CONSTRAINT "ReserveSignificance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NaturalMonumentSignificance" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" VARCHAR(7) NOT NULL,

    CONSTRAINT "NaturalMonumentSignificance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReserveSignificance_name_key" ON "ReserveSignificance"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NaturalMonumentSignificance_name_key" ON "NaturalMonumentSignificance"("name");

-- AddForeignKey
ALTER TABLE "ProtectedArea" ADD CONSTRAINT "ProtectedArea_reserveSignificanceId_fkey" FOREIGN KEY ("reserveSignificanceId") REFERENCES "ReserveSignificance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectedArea" ADD CONSTRAINT "ProtectedArea_naturalMonumentSignificanceId_fkey" FOREIGN KEY ("naturalMonumentSignificanceId") REFERENCES "NaturalMonumentSignificance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
