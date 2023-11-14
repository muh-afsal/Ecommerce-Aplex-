const express = require('express');
const router = express.Router();
const adminController = require("../Controller/adminController");
const adminAuth = require('../auth/adminAuth');

router.get("/admin", adminController.LoadAdminDash);
router.get("/manageProduct", adminController.LoadmanageProduct);
router.get("/manageCategory", adminController.LoadmanageCategory);
router.get("/addproduct", adminController.LoadaddProduct);

module.exports = router;

