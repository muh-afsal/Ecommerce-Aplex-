const express=require('express')
const router=express.Router()
const userController=require("../Controller/userController")
const productController=require("../Controller/productController")
const OTPController=require("../Controller/OTPcontroller")
const cartController=require("../Controller/CartController")
const userAuth=require('../auth/userAuth')
// const {checkSession}=require('../auth/userandadmin')
const {checkUserAuthentication}=require('../auth/userAuth')

router.get("/",userController.landingload)
router.get("/signup",userController.loadSignup)
router.post("/signup",userController.signupUser)
router.get("/login",userController.loadLogin)
router.post("/login",userController.loginUser)
router.get("/logout",userController.LogoutUser)
router.get("/home",userController.loadHome)
router.get("/otp",userController.otpSender)
router.get("/otpentry",userController.LoadOTP)
router.post("/otp",userController.otpverify)
router.get("/ProductDetail",productController.LoadproductDetail)
router.get("/ProductDetailverified",userAuth.checkUserAuthentication,productController.LoadproductDetailVerified)
router.get("/productlisting",productController.ProductListing)
router.get("/productlistingverified",userAuth.checkUserAuthentication,productController.ProductListingverified)
router.get("/cart",userAuth.checkUserAuthentication,cartController.LoadCart)
router.post('/addtocart',userAuth.checkUserAuthentication,cartController.addtoCart)
router.post("/updatequantity/:id",userAuth.checkUserAuthentication,cartController.updateQuantity)
router.delete('/removeproduct/:Id', userAuth.checkUserAuthentication, cartController.removeProduct);
router.get("/checkout", userAuth.checkUserAuthentication, cartController.LoadCheckout)








module.exports=router