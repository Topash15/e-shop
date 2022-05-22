const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const shipmentSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now(),
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;