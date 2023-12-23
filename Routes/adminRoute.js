const multer = require("multer");
const { checkAdminAuth } = require("../auth/adminAuth");
const productStorage = require("../auth/fileUpload");
const productUpload = multer({ storage: productStorage });
const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");
const productController = require("../Controller/productController");
const categoryController = require("../Controller/categoryController");
const orderController = require("../Controller/adminOrdersController");
const couponController = require("../Controller/couponController");

const adminAuth = require("../auth/adminAuth");

const uploadObj = [
  { name: "main-image", maxCount: 1 },
  { name: "sub-image", maxCount: 4 },
];

router.get("/adminlogin", adminController.loadAdminLogin);
router.post("/adminlogin", adminController.loginAdmin);
router.get("/admin", checkAdminAuth, adminController.LoadAdminDash);
router.get("/manageProduct", checkAdminAuth, productController.LoadmanageProduct);
router.get("/addproduct", checkAdminAuth, productController.LoadaddProduct);
router.post("/addProduct", productUpload.fields(uploadObj), productController.addProduct);
router.get("/editProduct", checkAdminAuth, productController.editProductLoad);
router.post("/editProduct", productUpload.fields(uploadObj), productController.UpdateProduct);
router.get("/deleteProduct", productController.softDeleteProduct);
router.get("/manageUser", checkAdminAuth, adminController.manageUser);
router.post("/blockUnblockUser", adminController.blockUnblockUser);
router.get("/manageCategory", checkAdminAuth, categoryController.LoadmanageCategory);
router.get("/addCategory", checkAdminAuth, categoryController.LoadaddCategory);
router.post("/addCategory", categoryController.addCategory);
router.get("/editCategory", checkAdminAuth, categoryController.LoadEditCategory);
router.post("/editCategory", categoryController.UpdateCategory);
router.get("/deleteCategory", categoryController.softDeleteCategory);
router.get("/orders", checkAdminAuth, orderController.LoadOrders);
router.get("/orderdetails", checkAdminAuth, orderController.Orderdetails);
router.post("/updateOrderStatus/:orderId", checkAdminAuth, orderController.UpdateOrderStatus);
router.post("/updatePaymentStatus/:orderId", checkAdminAuth, orderController.UpdatePaymentStatus);
router.get("/adminlogout", (req, res) => { req.session.adminAuth = false; res.redirect("/admin/adminlogin"); });
router.get("/Managecoupon",checkAdminAuth,couponController.LoadManageCoupons)

module.exports = router;
