const multer = require("multer");
const productStorage = require("../auth/fileUpload");

const productUpload = multer({ storage: productStorage });
const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");
const adminAuth = require("../auth/adminAuth");

const uploadObj = [
  { name: "main-image", maxCount: 1 },
  { name: "sub-image", maxCount: 4 },
];

router.get("/admin", adminController.LoadAdminDash);
router.get("/manageProduct", adminController.LoadmanageProduct);
router.get("/manageCategory", adminController.LoadmanageCategory);
router.get("/addproduct", adminController.LoadaddProduct);
router.post("/addProduct", productUpload.fields(uploadObj), adminController.addProduct);

module.exports = router;
