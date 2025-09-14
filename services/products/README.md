# Products GraphQL Service

A GraphQL service for managing products using Apollo Server.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

The server will start on http://localhost:4001

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## GraphQL Schema

### Types

```graphql
type Product {
  id: ID!
  name: String!
  description: String!
}
```

### Queries

- `products`: Returns all products
- `product(id: ID!)`: Returns a specific product by ID

## Example Queries

Get all products:
```graphql
query GetProducts {
  products {
    id
    name
    description
  }
}
```

Get a specific product:
```graphql
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    description
  }
}
```