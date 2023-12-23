const mongoose = require("mongoose");
require("dotenv").config();

const orders = new mongoose.Schema({
    Status: { type: String, enum: [ 'Ordered', 'Shipped', 'delivered', 'cancelled' ] },
    Items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref:process.env.PRODUCT_COLLECTION},
        Price: { type: Number },
        quantity: { type: Number },
    }],
    UserID: { type: mongoose.Schema.Types.ObjectId, },
    orderNumber: { type: String },
    TotalPrice: { type: Number },
    Address: {
        shippingName:{type:String},
        phone:{type:Number},
        city:{type:String},
        state:{type:String},
        country:{type:String},
        pincode:{type:Number},
    },
  
    paymentMethod: { type: String },
    paymentStatus: { type: String },
    CoupenID: { type: mongoose.Schema.Types.ObjectId, },
    OrderDate: { type: Date },
    PaymentId: { type: Number },

  
});

const ordersModel = mongoose.model(process.env.ORDERS_COLLECTION, orders);

module.exports = ordersModel;
