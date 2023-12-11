const bcrypt = require("bcrypt");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const User = require("../Model/collections/userModel");
const Admin = require("../Model/collections/AdminModel");





// Load admin login
const loadAdminLogin = async (req, res) => {
  // console.log(req.session.email,"admin email------------------------");
  try {
    if (req.session && req.session.adminAuth) {
      res.redirect("/admin/admin");
    } else {
      // console.log("rached");
      if (req.session && req.session.logged) {
        const admin = await Admin.findOne({ email: req.session.email });
        if (admin) {
          res.redirect("/admin");  // Assuming you have a home route for admin
        } else {
          res.render("../views/admin/Adminlogin", { message: "Permission Denied" });
        }
      } else {
        res.render("../views/admin/Adminlogin");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  // console.log("reached here--------------------------")
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const adminExists = await Admin.findOne({ email: email });
    if (adminExists) {
      const passwordMatch = adminExists.password===password;
  
      if (passwordMatch) {
        req.session.adminAuth = true;
        res.redirect("/admin/admin");  // Redirect to the admin dashboard
      } else {
        res.render("../views/admin/Adminlogin", {
          message: "Incorrect Username or Password",
        });
      }
    } else {
      res.render("../views/admin/Adminlogin", { message: "Admin not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

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
  loginAdmin,
  loadAdminLogin
};
