import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoryData: Prisma.CategoryCreateInput[] = [
  {
    name: "Заповедник",
    color: "#b1709a",
    protectedAreas: {
      create: [
        {
          name: "Березинский биосферный заповедник",
          region: "Витебская область",
          district: "Лепельский район",
          latitude: 54.747805,
          longitude: 28.312741,
          internationalStatusList: {
            create: [
              {
                name: "Биосферный резерват ЮНЕСКО",
              },
              {
                name: "Диплом Совета Европы",
              },
              {
                name: "Рамсарская территория",
                description:
                  "(водно-болотные угодья международного значения) - особо ценные водно-болотные угодья, внесенные в Список водно-болотных угодий международного значения в соответствии с конвенцией о водно-болотных угодьях, имеющих международное значение главным образом в качестве местообитания водоплавающих птиц (Рамсар, 2 февраля 1971 г.)",
              },
              {
                name: "Территория, важная для птиц",
                description:
                  "территории, которые являются местом концентрации птиц в период гнездования, зимовок или миграции и имеют важное значение для сохранения диких птиц Европы",
              },
              {
                name: "Ключевая ботаническая территория",
                description:
                  "природные территории, отражающие исключительное ботаническое богатство и/или поддерживающие особо ценные популяции редких, исчезающих  и/или эндемичных видов растений, а также растительность, имеющую большую ботаническую ценность",
              },
            ],
          },
        },
      ],
    },
  },
  {
    name: "Национальный парк",
    color: "#ee8683",
    protectedAreas: {
      create: [
        {
          name: "Национальный парк Нарочанский",
          region: "Минская область",
          district: "Мядельский район",
          latitude: 54.90962679990144,
          longitude: 26.706631619274614,
        },
      ],
    },
  },
  {
    name: "Заказник",
    protectedAreas: {
      create: [
        {
          name: "Селява",
          region: "Минская область",
          district: "Крупский район",
          latitude: 54.483043,
          longitude: 29.147851,
          reserveSignificance: {
            connectOrCreate: {
              where: {
                name: "республиканского значения",
              },
              create: {
                name: "республиканского значения",
              }
            },
          },
          reserveType: {
            connectOrCreate: {
              where: {
                name: "ландшафтный"
              },
              create: {
                name: "ландшафтный",
                color: "#fff7a6",
              }
            },
          },
        },
        {
          name: "Голубые озёра",
          region: "Минская область",
          district: "Сморгонский район",
          latitude: 54.483043,
          longitude: 29.147851,
          reserveSignificance: {
            connectOrCreate: {
              where: {
                name: "местного значения"
              },
              create: {
                name: "местного значения",
                color: "#fcc990",
              }
            }
          },
          reserveType: {
            connectOrCreate: {
              where: {
                name: "ландшафтный"
              },
              create: {
                name: "ландшафтный",
                color: "#fff7a6",
              }
            },
          },
        },
      ],
    },
  },
  {
    name: "Памятник природы",
    protectedAreas: {
      create: [
        {
          name: "Родник Ивьевский",
          region: "Минская область",
          district: "Ивьевский район",
          latitude: 53.9258489281512,
          longitude: 25.77733019635172,
          naturalMonumentSignificance: {
            connectOrCreate: {
              where: {
                name: "республиканского значения",
              },
              create: {
                name: "республиканского значения",
                color: "#7a8ed3"
              }
            },
          },
          naturalMonumentType: {
            connectOrCreate: {
              where: {
                name: "гидрологический"
              },
              create: {
                name: "гидрологический",
                color: "#aadbf9",
              }
            },
          },
        },
        {
          name: "Парк г. Пружаны",
          region: "Брестская область",
          district: "Пружанский район",
          latitude: 52.56552228954748,
          longitude: 24.45695629249543,
          naturalMonumentSignificance: {
            connectOrCreate: {
              where: {
                name: "местного значения",
              },
              create: {
                name: "местного значения",
                color: "#ffcd00"
              }
            },
          },
          naturalMonumentType: {
            connectOrCreate: {
              where: {
                name: "биологический"
              },
              create: {
                name: "биологический",
                color: "#a4ccaa",
              }
            },
          },
        }
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const c of categoryData) {
    const category = await prisma.category.create({
      data: c,
    });
    console.log(`Created category with id: ${category.id}`);
  }

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
