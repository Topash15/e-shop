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
      const shipment = await Shipment.findById(args._id).populate(
        "shipmentItems"
      );
      return shipment;
    },

    /** SHIPMENT ITEM QUERIES **/
    shipmentItems: async (parent, args, context) => {
      return ShipmentItem.find().populate("product");
    },
    // get shipment by id
    shipmentItem: async (parent, args, context) => {
      const shipmentItem = await ShipmentItem.findById(args._id).populate(
        "product"
      );
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
      /** Request used to check if inventory is available */
      // returns shipment item with product and product's inventory information
      const inventory = await ShipmentItem.findById(args.shipmentItems)
        .populate("product")
        .populate({
          path: "product",
          populate: "inventory",
        });
      const totalAvailable = inventory.product.inventory.inventory;
      const inventory_id = inventory.product.inventory._id.toString();
      const requestedQuantity = inventory.quantity;

      /** If available inventory is less than the requested quantity,
       * delete the shipmentItem from the database
       * and return an error message indicating Not enough inventory
       */
      if (totalAvailable < requestedQuantity) {
        // removing invalid shipment items should keep the database clean of unused shipment items
        const invalidShipmentItem = await ShipmentItem.findByIdAndDelete(
          args.shipmentItems
        );
        return new Error("Not enough inventory available.");
      }

      // saves product id to string. used for comparison purposes
      const product = inventory.product._id.toString();

      /** Checks if product is already on shipment
       * if it is already on shipment, add quantities
       * else add to shipment
       */
      const currentShipmentItems = await Shipment.findById(args._id).populate(
        "shipmentItems"
      );
      // loops through each existing shipment item in the shipment
      // adds quantities if the product being added already exists
      for (let i = 0; i < currentShipmentItems.shipmentItems.length; i++) {
        if (
          product === currentShipmentItems.shipmentItems[i].product.toString()
        ) {
          const existingQuantity =
            currentShipmentItems.shipmentItems[i].quantity;
          const newQuantity = existingQuantity + requestedQuantity;

          const shipmentItem = await ShipmentItem.findByIdAndUpdate(
            currentShipmentItems.shipmentItems[i]._id.toString(),
            {
              quantity: newQuantity,
            }
          );

          /** Deletes the duplicate shipment item as the quantity has already been updated*/
          const invalidShipmentItem = await ShipmentItem.findByIdAndDelete(
            args.shipmentItems
          );

          /** Updates inventory quantity to reflect the added shipment amount*/
          const remainingInventory = totalAvailable - requestedQuantity;
          const inventoryUpdate = await Inventory.findByIdAndUpdate(
            inventory_id,
            {
              inventory: remainingInventory,
            }
          );
          return Shipment.findById(args._id).populate("shipmentItems");
        }
      }


      /** if the item was not already in the shipment, add the shipment item to the shipment*/
      const shipment = await Shipment.findByIdAndUpdate(
        args._id,
        {
          $push: { shipmentItems: args.shipmentItems },
        },
        { new: true }
      ).populate("shipmentItems");

      /** Updates inventory quantity to reflect the added shipment amount*/
      const remainingInventory = totalAvailable - requestedQuantity;
      const inventoryUpdate = await Inventory.findByIdAndUpdate(inventory_id, {
        inventory: remainingInventory,
      });
      return shipment;
    },
    // remove item from shipment
    removeItemFromShipment: async (parent, args, context) => {
      /** Request used to check if inventory is available */
      // returns shipment item with product and product's inventory information
      const inventory = await ShipmentItem.findById(args.shipmentItems)
        .populate("product")
        .populate({
          path: "product",
          populate: "inventory",
        });
      const totalAvailable = inventory.product.inventory.inventory;
      const requestedQuantity = inventory.quantity;
      const product = inventory.product._id.toString();

      /** Checks if product is already on shipment
       * if it is already on shipment, add quantities
       * else add to shipment
       */
      const currentShipmentItems = await Shipment.findById(args._id).populate(
        "shipmentItems"
      );
      // loops through each existing shipment item in the shipment
      // adds quantities if the product being added already exists
      for (let i = 0; i < currentShipmentItems.shipmentItems.length; i++) {
        if (
          product === currentShipmentItems.shipmentItems[i].product.toString()
        ) {
          // quantity of product already listed in shipment
          const existingQuantity =
            currentShipmentItems.shipmentItems[i].quantity;
          const newQuantity = existingQuantity - requestedQuantity;
          /** the new quantity is less than or equal to zero, remove the item from the shipment entirely */
          if (newQuantity <= 0) {
            const shipment = await Shipment.findByIdAndUpdate(
              args._id,
              {
                $pull: { shipmentItems: args.shipmentItems },
              },
              { new: true }
            ).populate("shipmentItems");
            return shipment;
          }
          /** if the quantity is a positive value, set as new quantity */
          const shipmentItem = await ShipmentItem.findByIdAndUpdate(
            currentShipmentItems.shipmentItems[i]._id.toString(),
            {
              quantity: newQuantity,
            }
          );
          return Shipment.findById(args._id).populate("shipmentItems");
        }
      }
    },

    /** SHIPMENT ITEM MUTATIONS **/
    // create new shipment item
    addShipmentItem: async (parent, args, context) => {
      const item = await ShipmentItem.create(args);
      return item;
    },
    // edit shipment item
    editShipmentItem: async (parent, args, context) => {
      const item = await ShipmentItem.findByIdAndUpdate(
        args._id,
        {
          product: args.product,
          quantity: args.quantity,
        },
        { new: true }
      ).populate("product");
      return item;
    },
  },
};

module.exports = resolvers;
