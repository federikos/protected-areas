import { Prisma, PrismaClient, InternationalStatus, ReserveType, NaturalMonumentType, Significance, CategoryType } from "@prisma/client";
import { createReadStream } from "fs";
import { parse } from "csv-parse";

function formatRow(row: string[]): Prisma.MapObjectCreateInput {
  const [
    name,
    categoryName,
    categoryTypeName,
    coordinates,
    region,
    district,
    significance,
    reserveType,
    naturalMonumentType,
    ...internationalStatusList
  ] = row;
  const [latitude, longitude] = coordinates
    .split(", ")
    .map((string: string) => {
      if (!string?.length) return null;
      return parseFloat(string);
    });

  return {
    name,
    description: "",
    region,
    district,
    latitude,
    longitude,
    category: {
      create: {
        name: categoryName,
        categoryType: {
          create: {
            name: categoryTypeName,
            reserveType: (reserveType.length ? reserveType : null) as ReserveType,
            naturalMonumentType: (naturalMonumentType.length ? naturalMonumentType : null) as NaturalMonumentType,
            reserveSignificance: (reserveType.length ? significance : null) as Significance,
            naturalMonumentSignificance: (naturalMonumentType.length ? significance : null) as Significance,
            internationalStatusList: internationalStatusList
              .map((nextStatusBoolean, i) =>
                nextStatusBoolean
                  ? InternationalStatus[Object.values(InternationalStatus)[i]]
                  : null
              )
              .filter((status) => !!status) as InternationalStatus[],
          },
        },
      },
    },
  };
}

const prisma = new PrismaClient();


async function main() {
  console.log(`Start seeding ...`);

  createReadStream("./prisma/data.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", async function (row) {
    const mapObject = await prisma.mapObject.create({
      data: formatRow(row)
    })
    console.log(`Created mapObject with id: ${mapObject.id}`);
  })
  .on("end", function () {
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
