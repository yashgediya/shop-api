const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quentity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Order", orderSchema);
