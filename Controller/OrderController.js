const Order=require("../Model/collections/orderModel") 
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



const LoadOrderDetails =async (req,res)=>{
    try {
        const user = await User.findOne({ email: req.session.email });
         
         const OrderProduct = await Order.findOne({ UserID: user._id }).populate(
             "Items.productId"
             );
             
        
        res.render("../views/user/orderDetails",{OrderProduct})
    } catch (error) {
        console.log(error);
    }
}






















module.exports = {
    LoadOrderDetails,
    
  };
  