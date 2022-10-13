-- CreateEnum
CREATE TYPE "Significance" AS ENUM ('REPUBLICAN', 'LOCAL');

-- CreateEnum
CREATE TYPE "ReserveType" AS ENUM ('LANDSCAPE', 'BIOLOGICAL', 'GIDROLOGICAL', 'WATERLAND');

-- CreateEnum
CREATE TYPE "NaturalMonumentType" AS ENUM ('BOTANICAL', 'GEOLOGICAL', 'GIDROLOGICAL');

-- CreateEnum
CREATE TYPE "InternationalStatus" AS ENUM ('WORLD_HERITAGE_SITE', 'UNESCO_BIOSPHERE_RESERVE', 'EUROPEAN_DIPLOMA_OF_PROTECTED_AREAS', 'RAMSAR_SITE', 'IMPORTANT_BIRD_AREA', 'IMPORTANT_PLANT_AREA');

-- CreateTable
CREATE TABLE "MapObject" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "region" VARCHAR(255) NOT NULL,
    "district" VARCHAR(255) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "MapObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" VARCHAR(7),
    "categoryTypeId" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reserveSignificance" "Significance",
    "reserveType" "ReserveType",
    "naturalMonumentSignificance" "Significance",
    "naturalMonumentType" "NaturalMonumentType",
    "internationalStatusList" "InternationalStatus"[],

    CONSTRAINT "CategoryType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryTypeId_key" ON "Category"("categoryTypeId");

-- AddForeignKey
ALTER TABLE "MapObject" ADD CONSTRAINT "MapObject_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_categoryTypeId_fkey" FOREIGN KEY ("categoryTypeId") REFERENCES "CategoryType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
