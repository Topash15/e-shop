const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const shipmentSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now(),
  },
  shipmentItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "ShipmentItem",
    },
  ],
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;