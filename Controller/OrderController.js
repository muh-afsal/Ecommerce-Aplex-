const Order = require("../Model/collections/orderModel");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const category = require("../Model/collections/categoryModel");
const User = require("../Model/collections/userModel");
const {
  productAddtocart,
  calculateTotalPrice,
} = require("../helper/cartHelper");
const Products = require("../Model/collections/ProductModel");
const Cart = require("../Model/collections/CartModel");
const mongoose = require("mongoose");


// Generate a random string for orderNumber-----------------------------------------------
const generateOrderNumber = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let orderNumber = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderNumber += characters.charAt(randomIndex);
  }
  return orderNumber;
};


// Load order details-------------------------------------------------------------------
const LoadOrderDetails = async (req, res) => {
  try {
    const orderId = req.query.id;

    const orderData = await Order.findOne({ _id: orderId }).populate(
      "Items.productId"
    );
    if (orderData) {  
      res.render("../views/user/orderDetails", { orderData });
    } else {
      res.send("404");
    }
  } catch (error) {
    console.error(error);
    // res.render('user/404Page')
  }
};

// Load orders-------------------------------------------------------------------
const LoadOrders = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });
    const userId = user._id;
    const orderData = await Order.find({ UserID: userId}).sort({ OrderDate: -1 });
    res.render("../views/user/orders", { orderData });
  } catch (error) {
    console.log(error);
  }
};

// Cancell order-------------------------------------------------------------------
const cancelOrder = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });

    const orderId = req.params.id;
    const orderObjectId = new mongoose.Types.ObjectId(orderId);
    const orderData = await Order.findOneAndUpdate(
      { _id: orderObjectId },
      { $set: { Status: "Cancelled" } },
      { new: true }
    );

    if (orderData.Status === "Cancelled") {
      const totalAmount = orderData.TotalPrice;

      user.walletBalance += totalAmount;

      await user.save();

        const transactionId = generateOrderNumber(); 
        const activityDetails = {
          TransactionType: "credit",
          message: "Order cancelled",
          Date: new Date(),
          TransactionID: transactionId,
        };
  
        user.Activity.push(activityDetails);
  
        await user.save();
    }


    res.redirect(`/orderDetails?id=${orderObjectId}`);
  } catch (error) {
    console.log(error);
  }
};

// Return order -------------------------------------------------------------------

const returnOrder = async (req, res) => {
  try {
    
    const orderId = req.params.id;
    const reason=req.body.returnReason;
    const user = await User.findOne({ email: req.session.email });

    const orderObjectId = new mongoose.Types.ObjectId(orderId);
    const orderData = await Order.findOneAndUpdate(
      { _id: orderObjectId },
      { $set: { Status: "Request Send for Return" ,returnRequestSend:true} },
      { new: true }
    );

    res.redirect(`/orderDetails?id=${orderObjectId}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  LoadOrderDetails,
  LoadOrders,
  cancelOrder,
  returnOrder
};

