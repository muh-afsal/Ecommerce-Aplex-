const session = require("express-session");
const { ObjectId } = require("mongodb");
const Coupon = require("../Model/collections/categoryModel");


const LoadManageCoupons=async(req,res)=>{
    try {
        res.render("../views/admin/ManageCoupon.ejs")
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    LoadManageCoupons
  };