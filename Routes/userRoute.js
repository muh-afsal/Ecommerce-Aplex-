const express=require('express')
const router=express.Router()
const userController=require("../Controller/userController")
const OTPController=require("../Controller/OTPcontroller")
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
router.get("/ProductDetail",userController.LoadproductDetail)
router.get("/ProductDetailverified",userAuth.checkUserAuthentication,userController.LoadproductDetailVerified)
router.get("/productlisting",userController.ProductListing)
router.get("/productlistingverified",userAuth.checkUserAuthentication,userController.ProductListingverified)








module.exports=router