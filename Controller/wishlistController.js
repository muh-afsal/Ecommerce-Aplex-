const User = require("../Model/collections/userModel");
const OTP = require("../Model/collections/otpModel");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const Product = require("../Model/collections/ProductModel");
const category = require("../Model/collections/categoryModel");
const Cart = require("../Model/collections/CartModel");
const Products = require("../Model/collections/ProductModel");
const {productAddtocart,calculateTotalPrice,} = require("../helper/cartHelper");


const LoadWishlist=async (req,res)=>{
    try {
        const user = await User.findOne({ email: req.session.email });

        const cartProduct = await Cart.findOne({ User: user._id }).populate(
          "Items.Products"
        );
    
        await calculateTotalPrice(user._id).then((total) => {
          req.session.orderplaced = false;
          res.render("../views/user/wishlist.ejs", { cartProduct: cartProduct, total });
        });
      
    } catch (error) {
        console.log(error)
    }
}






module.exports = {
    LoadWishlist
  };