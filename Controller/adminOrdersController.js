const Orders=require("../Model/collections/orderModel") 
const session = require("express-session");
const { ObjectId } = require("mongodb");
const category = require("../Model/collections/categoryModel");
const User = require("../Model/collections/userModel");

const Products = require("../Model/collections/ProductModel");
const Cart = require("../Model/collections/CartModel");



const LoadOrders =async (req,res)=>{
const orderData=await Orders.find()

    try {
       res.render("../views/admin/ManageOrders",{orderData})
    } catch (error) {
        console.log(error);
    }
}

const Orderdetails = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email })
    console.log(req.session.email,"email of admin----------------" );
    const orderId = req.params.id;

    console.log(orderId,"order id-----------------");

    const orderData = await Orders.find({ _id: orderId }).populate('Items.productId');



    res.render('../views/admin/AdminOrderDetails', { orderData, user })

  } catch (error) {
    console.error(error)
    // res.render('user/404Page')
  }
}








module.exports = {
    LoadOrders,
    Orderdetails
    
  };
  