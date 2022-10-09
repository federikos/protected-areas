/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `InternationalStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InternationalStatus_name_key" ON "InternationalStatus"("name");
