const multer = require("multer");
const productStorage = require("../auth/fileUpload");
const {checkAdminAuth}=require('../auth/adminAuth')
const productUpload = multer({ storage: productStorage });
const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");
const adminAuth = require("../auth/adminAuth");

const uploadObj = [
  { name: "main-image", maxCount: 1 },
  { name: "sub-image", maxCount: 4 },
];



router.get("/admin",checkAdminAuth,adminController.LoadAdminDash);
router.get("/manageProduct",checkAdminAuth, adminController.LoadmanageProduct);
router.get("/addproduct",checkAdminAuth, adminController.LoadaddProduct);
router.post("/addProduct", productUpload.fields(uploadObj), adminController.addProduct);
router.get("/editProduct",checkAdminAuth, adminController.editProductLoad);
router.post("/editProduct", productUpload.fields(uploadObj),adminController.UpdateProduct); 
router.get("/deleteProduct",adminController.softDeleteProduct)
router.get("/manageUser",checkAdminAuth,adminController.manageUser)
router.post("/blockUnblockUser",adminController.blockUnblockUser)
router.get("/manageCategory",checkAdminAuth, adminController.LoadmanageCategory);
router.get("/addCategory",checkAdminAuth,adminController.LoadaddCategory)
router.post("/addCategory",adminController.addCategory)
router.get("/editCategory",checkAdminAuth,adminController.LoadEditCategory)
router.post("/editCategory",adminController.UpdateCategory)
router.get("/deleteCategory",adminController.softDeleteCategory)
router.get('/logout',(req,res)=>{
  req.session.adminAuth=false
  res.redirect('/login')
})


module.exports = router;
