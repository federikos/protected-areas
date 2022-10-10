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
import { Prisma } from '@prisma/client'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allProtectedAreas', {
      type: ProtectedArea,
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.protectedArea.findMany()
      },
    })

    t.nullable.field('protectedAreaById', {
      type: ProtectedArea,
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.protectedArea.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    t.nonNull.list.nonNull.field('feed', {
      type: ProtectedArea,
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

        return context.prisma.protectedArea.findMany({
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

const ProtectedArea = objectType({
  name: 'ProtectedArea',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.boolean('published')
    t.string('region')
    t.string('district')
    t.float('latitude')
    t.float('longitude')
    t.field('category', {
      type: Category,
      resolve: (parent, _, context: Context) => {
        return context.prisma.protectedArea.findUnique({
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
    t.list.field('protectedAreas', {
      type: ProtectedArea,
      resolve: (parent, _, context: Context) => {
        return context.prisma.protectedArea.findMany({
          where: { id: parent.id || undefined}
        })
      }
    })
  },
})

export const schema = makeSchema({
  types: [
    Query,
    ProtectedArea,
    Category,
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