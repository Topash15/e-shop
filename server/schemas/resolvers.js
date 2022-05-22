const { Product, Shipment } = require("../models");

const resolvers = {
  Query: {
    // get all products
    products: async (parent, args, context) => {
      return Product.find();
    },
    // get single product by id
    product: async (parent, args, context) => {
        const product = await Product.findById(args._id);
        return product
    }
  },
  Mutation: {
    // add product
    addProduct: async (parent, args, context) => {
        const product = await Product.create(args);
        return product;
    },
    // edit product
    editProduct: async (parent, args, context) => {
        const product = await Product.findByIdAndUpdate(args._id,{
            name: args.name,
            description: args.description,
            inventory: args.inventory
        },
        {new: true})
        return product;
    },
    // delete product
    deleteProduct: async (parent, args, context) => {
        const product = await Product.findByIdAndDelete(args._id);
        return product;
    }
  },
};

module.exports = resolvers;
