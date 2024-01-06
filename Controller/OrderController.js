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

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const orderObjectId = new mongoose.Types.ObjectId(orderId);

    const orderData = await Order.findOneAndUpdate(
      { _id: orderObjectId },
      { $set: { Status: "Cancelled" } },
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
};
