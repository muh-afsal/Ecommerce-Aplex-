const Order=require("../Model/collections/orderModel") 
const session = require("express-session");
const { ObjectId } = require("mongodb");
const category = require("../Model/collections/categoryModel");
const User = require("../Model/collections/userModel");

const Products = require("../Model/collections/ProductModel");
const Cart = require("../Model/collections/CartModel");



const LoadOrders =async (req,res)=>{
const orderData=await Order.find()

    try {
       res.render("../views/admin/ManageOrders",{orderData})
    } catch (error) {
        console.log(error);
    }
}

// const Ordersdetails=async(req,res)=>{
// try {
    
// } catch (error) {
  
// }
// }









module.exports = {
    LoadOrders,
    // Ordersdetails
    
  };
  