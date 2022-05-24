const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Product {
    _id: ID
    name: String
    description: String
    inventory: Inventory
  }

  type Inventory {
    _id: ID
    product: Product
    inventory: Int
  }

  type Shipment {
    _id: ID
    shipmentItems: [ShipmentItem]
  }

  type ShipmentItem {
    _id: ID
    product: Product
    quantity: Int
  }

  type Query {
    products: [Product]
    product(_id: ID!): Product
    inventories: [Inventory]
    inventory(_id: ID!): Inventory
    shipments: [Shipment]
    shipment(_id: ID!): Shipment
    shipmentItems: [ShipmentItem]
    shipmentItem(_id: ID!): ShipmentItem
  }

  type Mutation {
    addProduct(name: String!, description: String!, inventory: ID): Product

    editProduct(
      _id: ID!
      name: String
      description: String
      inventory: ID
    ): Product

    deleteProduct(_id: ID!): Product

    addInventory(product: ID, inventory: Int): Inventory

    addShipment(shipmentItems: [ID]): Shipment

    editShipment(_id: ID, shipmentItems: [ID]): Shipment

    addItemToShipment(_id: ID, shipmentItems: ID): Shipment

    removeItemFromShipment(_id: ID, shipmentItems: ID): Shipment

    addShipmentItem(product: ID, quantity: Int): ShipmentItem

    editShipmentItem(_id: ID, product: ID, quantity: Int): ShipmentItem

    deleteShipmentItem(_id: ID!): ShipmentItem
  }
`;

module.exports = typeDefs;
