const Orders = require("../Model/collections/orderModel");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const category = require("../Model/collections/categoryModel");
const User = require("../Model/collections/userModel");

const Products = require("../Model/collections/ProductModel");
const Cart = require("../Model/collections/CartModel");

const LoadOrders = async (req, res) => {
  const orderData = await Orders.find().sort({ OrderDate: -1 });;

  try {
    res.render("../views/admin/ManageOrders", { orderData });
  } catch (error) {
    console.log(error);
  }
};

const Orderdetails = async (req, res) => {
  try {
    const orderId = req.query.id;

    const orderData = await Orders.findOne({ _id: orderId }).populate(
      "Items.productId"
    );
   

    res.render("../views/admin/AdminOrderDetails", { orderData });
  } catch (error) {
    console.error(error);
    // res.render('user/404Page')
  }
};

const UpdateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;


  try {
    await Orders.findByIdAndUpdate(orderId, { Status: status });

    res
      .status(200)
      .json({ success: true, message: "Order status updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const UpdatePaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    await Orders.findByIdAndUpdate(orderId, { paymentStatus: status });

    res
      .status(200)
      .json({ success: true, message: "Payment status updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  LoadOrders,
  Orderdetails,
  UpdatePaymentStatus,
  UpdateOrderStatus,
};
