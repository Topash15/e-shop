const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const inventorySchema = new Schema({
  product: 
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  inventory: {
    type: Number,
    required: false,
    default: 0,
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;