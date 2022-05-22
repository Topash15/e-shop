const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Product {
    _id: ID
    name: String
    description: String
    inventory: Int
  }

  type Query {
    products: [Product]
    product(_id: ID!): Product
  }

  type Mutation {
    addProduct(
        name: String!, 
        description: String!, 
        inventory: Int
        ): Product

    editProduct(
      _id: ID!,
      name: String,
      description: String,
      Inventory: Int,
    ): Product

    deleteProduct(
        _id: ID!
    ): Product
  }
`;

module.exports = typeDefs;
