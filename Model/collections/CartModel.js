const mongoose = require("mongoose");
require("dotenv").config();

const { Schema, ObjectId } = mongoose;

const CartSchema = new Schema({
  User: { type: Schema.Types.ObjectId, required: true },
  Items: [
    {
      Products: { type: Schema.Types.ObjectId,ref:process.env.PRODUCT_COLLECTION},
      Quantity: { type: Number },
    },
  ],
  TotalAmount: { type: Number},
  createdAt:{type:Date},
  UpdatedAt:{type:Date}
});

const Cart = mongoose.model(process.env.CART_COLLECTION, CartSchema);

module.exports = Cart;
 