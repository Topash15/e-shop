const { Product, Shipment, ShipmentItem, Inventory } = require("../models");

const resolvers = {
  Query: {
    /** PRODUCT QUERIES **/
    // get all products
    products: async (parent, args, context) => {
      return Product.find().populate("inventory");
    },
    // get single product by id
    product: async (parent, args, context) => {
      const product = await Product.findById(args._id).populate("inventory");
      return product;
    },

    /** INVENTORY QUERIES */
    // get all inventories
    inventories: async (parent, args, context) => {
      return Inventory.find().populate("product");
    },
    // get single inventory
    inventory: async (parent, args, context) => {
      const inventory = await Inventory.findById(args._id).populate("product");
      return inventory;
    },

    /** SHIPMENT QUERIES **/
    // get all shipments
    shipments: async (parent, args, context) => {
      return Shipment.find().populate("shipmentItems");
    },
    // get shipment by id
    shipment: async (parent, args, context) => {
      const shipment = await Shipment.findById(args._id).populate("shipmentItems");
      return shipment;
    },

    /** SHIPMENT ITEM QUERIES **/
    shipmentItems: async (parent, args, context) => {
      return ShipmentItem.find().populate("product");
    },
    // get shipment by id
    shipmentItem: async (parent, args, context) => {
      const shipmentItem = await ShipmentItem.findById(args._id).populate("product");
      return shipmentItem;
    },
  },
  Mutation: {
    /** PRODUCT MUTATIONS **/
    // add product
    addProduct: async (parent, args, context) => {
      const product = await Product.create(args).populate("inventory");
      return product;
    },
    // edit product
    editProduct: async (parent, args, context) => {
      const product = await Product.findByIdAndUpdate(
        args._id,
        {
          name: args.name,
          description: args.description,
          inventory: args.inventory,
        },
        { new: true }
      ).populate("inventory");
      return product;
    },

    /** INVENTORY MUTATIONS **/
    // creates new inventory
    addInventory: async (parent, args, context) => {
      const inventory = await Inventory.create(args);
      return inventory;
    },
    // delete product
    deleteProduct: async (parent, args, context) => {
      const product = await Product.findByIdAndDelete(args._id);
      return product;
    },

    /** SHIPMENT MUTATIONS **/
    // create new shipment
    addShipment: async (parent, args, context) => {
      const shipment = await Shipment.create(args);
      return shipment;
    },
    // add item to shipment
    addItemToShipment: async (parent, args, context) => {
      const shipment = await Shipment.findByIdAndUpdate(args._id,{
        $push: { shipmentItems: args.shipmentItems}
      }, {new: true}).populate('shipmentItems')
      return shipment;
    },
    // remove item from shipment
    removeItemFromShipment: async (parent, args, context) => {
      const shipment = await Shipment.findByIdAndUpdate(args._id,{
        $pull: { shipmentItems: args.shipmentItems}
      }, {new: true}).populate('shipmentItems')
      return shipment;
    },

    /** SHIPMENT ITEM MUTATIONS **/
    // create new shipment item
    addShipmentItem: async (parent, args, context) => {
      const item = await ShipmentItem.create(args);
      return item;
    },
    // edit shipment item
    editShipmentItem: async (parent, args, context) => {
      const item = await ShipmentItem.findByIdAndUpdate(args._id,{
        product: args.product,
        quantity: args.quantity
      },
      { new: true}).populate('product')
      return item;
    }
  },
};

module.exports = resolvers;
