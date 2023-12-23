const mongoose = require("mongoose");
require("dotenv").config();

const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const CouponSchema = new Schema({
  CouponCode: { type: String, required: true },
  DiscountValue: { type: Number, required: true },
  ExpirationDate: { type: Date, required: true },
  MaxDiscountAmount: { type: Number, required: true },
  MinPurchaseAmount: { type: Number, required: true },
  IsActive: { type: Boolean, required: true },
  StartDate: { type: Date, required: true },
  UsageCount: { type: Number },
});

const Coupon = mongoose.model(process.env.COUPON_COLLECTION, CouponSchema);

export default Coupon;


 
