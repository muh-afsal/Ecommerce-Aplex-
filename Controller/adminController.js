const bcrypt = require("bcrypt");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const User = require("../Model/collections/userModel");


//Load admin dash
const LoadAdminDash = async (req, res) => {
  try {
    res.render("../views/admin/adminDash");
  } catch (error) {
    console.log(error.message);
  }
};


//manageuser

const manageUser = async (req, res) => {
  try {
    const userData = await User.find({ isAdmin: false });
    res.render("../views/admin/ManageUser", { userData });
  } catch (error) {
    console.log(error.message);
  }
};

//block and unblock user
// const blockUnblockUser = async (req,res) => {
//     try {
//         // console.log('called kkk');
//         const id=req.query.id
//         const result = await User.findByIdAndUpdate(id,{ access: false });

//         res.redirect("/admin/manageUser")
//     } catch (error) {
//         console.error(`Error soft deleting product: ${error.message}`);
//         throw error;
//     }
// };

// In your router or controller file
const blockUnblockUser = async (req, res) => {
  try {
    const { id, access } = req.body;

    const result = await User.findByIdAndUpdate(id, { access });

    // Redirect back to the original page
    res.redirect("/admin/manageUser");
  } catch (error) {
    console.error(`Error updating user access: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};















module.exports = {
  LoadAdminDash,
  manageUser,
  blockUnblockUser,
};
