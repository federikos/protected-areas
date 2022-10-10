import { ApolloServer } from 'apollo-server'
import {
  ApolloServerPluginLandingPageLocalDefault 
} from "apollo-server-core"
import { schema } from './schema'
import { context } from './context'

const server = new ApolloServer({
  schema: schema,
  context: context,
  plugins: [
      ApolloServerPluginLandingPageLocalDefault({ footer: false, embed: true })
  ],
  //TODO: disable introspection in production!
  //introspection: process.env.NODE_ENV !== 'production'
  introspection: true,
})

server.listen(process.env.PORT || 4000).then(async ({ url }) => {
  console.log(`\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `)
})