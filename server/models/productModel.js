const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    productName: String,
    desc: String,
    price: String,
    typeProduct: String,
    address: String,
    hashtag: String,
    img: {
      type: Array,
      default: [],
    },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
