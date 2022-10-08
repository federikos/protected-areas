-- CreateTable
CREATE TABLE "ProtectedArea" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "region" VARCHAR(255) NOT NULL,
    "district" VARCHAR(255) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "reserveTypeId" INTEGER,
    "significanceId" INTEGER,
    "naturalMonumentTypeId" INTEGER,
    "internationalStatusId" INTEGER,

    CONSTRAINT "ProtectedArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryColor" VARCHAR(7) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReserveType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" VARCHAR(7) NOT NULL,

    CONSTRAINT "ReserveType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Significance" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" VARCHAR(7) NOT NULL,

    CONSTRAINT "Significance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NaturalMonumentType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" VARCHAR(7) NOT NULL,

    CONSTRAINT "NaturalMonumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternationalStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" VARCHAR(7) NOT NULL,

    CONSTRAINT "InternationalStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProtectedArea_name_key" ON "ProtectedArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ReserveType_name_key" ON "ReserveType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Significance_name_key" ON "Significance"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NaturalMonumentType_name_key" ON "NaturalMonumentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InternationalStatus_name_key" ON "InternationalStatus"("name");

-- AddForeignKey
ALTER TABLE "ProtectedArea" ADD CONSTRAINT "ProtectedArea_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectedArea" ADD CONSTRAINT "ProtectedArea_reserveTypeId_fkey" FOREIGN KEY ("reserveTypeId") REFERENCES "ReserveType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectedArea" ADD CONSTRAINT "ProtectedArea_significanceId_fkey" FOREIGN KEY ("significanceId") REFERENCES "Significance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectedArea" ADD CONSTRAINT "ProtectedArea_naturalMonumentTypeId_fkey" FOREIGN KEY ("naturalMonumentTypeId") REFERENCES "NaturalMonumentType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectedArea" ADD CONSTRAINT "ProtectedArea_internationalStatusId_fkey" FOREIGN KEY ("internationalStatusId") REFERENCES "InternationalStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
