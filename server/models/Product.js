const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  inventory: {
    type: Schema.Types.ObjectId,
    ref: "Inventory"
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;