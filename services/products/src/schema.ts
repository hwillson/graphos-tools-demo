export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    description: String!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }
`;