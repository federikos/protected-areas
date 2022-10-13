import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { context, Context } from './context'
import { InternationalStatus, Prisma, Significance } from '@prisma/client'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allMapObjects', {
      type: MapObject,
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.mapObject.findMany()
      },
    })

    t.nullable.field('mapObjectById', {
      type: MapObject,
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.mapObject.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    t.nonNull.list.nonNull.field('feed', {
      type: MapObject,
      args: {
        searchString: stringArg(),
        skip: intArg(),
        take: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        const or = args.searchString
          ? {
              OR: [
                { name: { contains: args.searchString, mode: Prisma.QueryMode.insensitive } },
                // { desccription: { contains: args.searchString } },
              ],
            }
          : {}

        return context.prisma.mapObject.findMany({
          where: {
            published: true,
            ...or,
          },
          take: args.take || undefined,
          skip: args.skip || undefined
        })
      },
    })

    t.nonNull.list.nonNull.field('allCategories', {
      type: Category,
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.category.findMany()
      },
    })

    t.nullable.field('categoryById', {
      type: Category,
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.category.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })
  },
})

const MapObject = objectType({
  name: 'MapObject',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.string('description')
    t.boolean('published')
    t.string('region')
    t.string('district')
    t.float('latitude')
    t.float('longitude')
    t.field('category', {
      type: Category,
      resolve: (parent, _, context: Context) => {
        return context.prisma.mapObject.findUnique({
          where: { id: parent.id || undefined }
        })
        .category()
      }
    })
    t.nonNull.int('categoryId')
  },
})

const Category = objectType({
  name: 'Category',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.string('color')
    t.field('categoryType', {
      type: CategoryType,
      resolve: (parent, _args, context: Context) => {
        return context.prisma.categoryType.findUnique({
          where: {id: parent.id || undefined }
        })
      }
    })
    t.list.field('mapObjects', {
      type: MapObject,
      resolve: (parent, _, context: Context) => {
        return context.prisma.mapObject.findMany({
          where: { id: parent.id || undefined}
        })
      }
    })
  },
})

const CategoryType = objectType({
  name: 'CategoryType',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.field('category', {
      type: Category
    })
    t.string('reserveSignificance')
    t.string('reserveType')
    t.string('naturalMonumentSignificance')
    t.string('naturalMonumentType')
    t.list.string('internationalStatusList')
    t.typeName
  },
})

export const schema = makeSchema({
  types: [
    Query,
    MapObject,
    Category,
    CategoryType,
    // Mutation,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})