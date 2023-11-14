const User=require('../Model/collections/userModel')
const bcrypt=require('bcrypt');
const session = require('express-session');
const { ObjectId } = require("mongodb");


//Load admin dash
const LoadAdminDash=async (req,res)=>{
    try {
        res.render("../views/admin/adminDash")
    } catch (error) {
        console.log(error.message);
    }

}



//Load Manage Product
const LoadmanageProduct=async (req,res)=>{
    try {
        res.render("../views/admin/manageProduct")
    } catch (error) {
        console.log(error.message)
    }
}
//Load Add porduct
const LoadaddProduct=async (req,res)=>{
    try {
        res.render("../views/admin/AddProduct")
    } catch (error) {
        console.log(error.message)
    }
}
//Load manage category
const LoadmanageCategory=async (req,res)=>{
    try {
        res.render("../views/admin/ManageCategory")
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    LoadAdminDash,
    LoadmanageProduct,
    LoadaddProduct,
    LoadmanageCategory
}