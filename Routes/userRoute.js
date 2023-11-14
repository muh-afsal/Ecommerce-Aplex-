const express=require('express')
const router=express.Router()
const userController=require("../Controller/userController")
const OTPController=require("../Controller/OTPcontroller")
const userAuth=require('../auth/userAuth')



router.get("/",userController.landingload)
router.get("/signup",userController.loadSignup)
router.post("/signup",userController.signupUser)
router.get("/login",userController.loadLogin)
router.post("/login",userController.loginUser)
router.get("/home",userController.loadHome)
router.get("/otp",userController.otpSender)
router.get("/otpentry",userController.LoadOTP)
router.post("/otp",userController.otpverify)


// router.get()





module.exports=router