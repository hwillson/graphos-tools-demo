export const typeDefs = `#graphql
  type Staff {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type Query {
    staff: [Staff!]!
    staffMember(id: ID!): Staff
  }
`;