import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4001;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });

  console.log(`🚀 Products service ready at ${url}`);
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});