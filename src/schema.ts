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

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createDraft', {
      type: 'Post',
      args: {
        data: nonNull(
          arg({
            type: 'PostCreateInput',
          }),
        ),
        authorEmail: nonNull(stringArg()),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.post.create({
          data: {
            title: args.data.title,
            content: args.data.content,
            author: {
              connect: { email: args.authorEmail },
            },
          },
        })
      },
    })

    t.field('togglePublishPost', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, context: Context) => {
        try {
          const post = await context.prisma.post.findUnique({
            where: { id: args.id || undefined },
            select: {
              published: true,
            },
          })
          return context.prisma.post.update({
            where: { id: args.id || undefined },
            data: { published: !post?.published },
          })
        } catch (e) {
          throw new Error(
            `Post with ID ${args.id} does not exist in the database.`,
          )
        }
      },
    })

    t.field('incrementPostViewCount', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.post.update({
          where: { id: args.id || undefined },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        })
      },
    })

    t.field('deletePost', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.post.delete({
          where: { id: args.id },
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

// const User = objectType({
//   name: 'User',
//   definition(t) {
//     t.nonNull.int('id')
//     t.string('name')
//     t.nonNull.string('email')
//     t.nonNull.list.nonNull.field('posts', {
//       type: 'Post',
//       resolve: (parent, _, context: Context) => {
//         return context.prisma.user
//           .findUnique({
//             where: { id: parent.id || undefined },
//           })
//           .posts()
//       },
//     })
//   },
// })

// const Post = objectType({
//   name: 'Post',
//   definition(t) {
//     t.nonNull.int('id')
//     t.nonNull.field('createdAt', { type: 'DateTime' })
//     t.nonNull.field('updatedAt', { type: 'DateTime' })
//     t.nonNull.string('title')
//     t.string('content')
//     t.nonNull.boolean('published')
//     t.nonNull.int('viewCount')
//     t.field('author', {
//       type: 'User',
//       resolve: (parent, _, context: Context) => {
//         return context.prisma.post
//           .findUnique({
//             where: { id: parent.id || undefined },
//           })
//           .author()
//       },
//     })
//   },
// })

// const UserUniqueInput = inputObjectType({
//   name: 'UserUniqueInput',
//   definition(t) {
//     t.int('id')
//     t.string('email')
//   },
// })

// const PostCreateInput = inputObjectType({
//   name: 'PostCreateInput',
//   definition(t) {
//     t.nonNull.string('title')
//     t.string('content')
//   },
// })

// const UserCreateInput = inputObjectType({
//   name: 'UserCreateInput',
//   definition(t) {
//     t.nonNull.string('email')
//     t.string('name')
//     t.list.nonNull.field('posts', { type: 'PostCreateInput' })
//   },
// })

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