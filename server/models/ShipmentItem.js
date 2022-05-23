const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const shipmentItemSchema = new Schema({
  product:
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
});

const ShipmentItem = mongoose.model("ShipmentItem", shipmentItemSchema);

module.exports = ShipmentItem;