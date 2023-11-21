const User=require('../Model/collections/userModel')
const bcrypt=require('bcrypt');
const OTP=require('../Model/collections/otpModel')
const session = require('express-session');
const { ObjectId } = require("mongodb");
const { sentOTP } = require('./OTPcontroller');
const Product=require("../Model/collections/ProductModel");
// const Products = require('../Model/collections/ProductModel');

//securing password
const securePassword=async(password)=>{
try {
    const passwordhash=await bcrypt.hash(password,10)
    return passwordhash
} catch (error) {
   console.log(error.message); 
}
}




//load landingload
const landingload=async(req,res)=>{
  try {
    const products = await Product.find({}).limit(8);
    if(req.session.adminAuth){
      return res.redirect("/admin/admin")
    }
    res.render('../views/user/landing',{products})
  } catch (error) {
    console.log(error.message); 
  }
}




//loadSignup

const loadSignup=async (req,res)=>{
try {
    res.render('../views/user/signup')
} catch (error) {
    console.log(error.message); 
}
}


//signUp
const signupUser=async(req,res)=>{
  // console.log(req.body);
try {
  const userinfo={
    name:req.body.name.trim(),
    email:req.body.email.toLowerCase(),
    password: await securePassword(req.body.password)
    
  }
  // console.log(userinfo.email);

  const emailexist=await User.findOne({email:userinfo.email})
// console.log(emailexist);
  
  //email 
  // console.log(emailexist,' email exist')
  if(emailexist){
    
    res.render('../views/user/signup',{message:'Email alredy exists'})
  }else{
    const user=({
      username:userinfo.name,
      email:userinfo.email,
      password:userinfo.password,
      date:Date.now()
    })
    req.session.data=user
    res.redirect('/otp')

    
    // const userData=await user.save()
    // if(userData){
    //   res.render("../views/user/home");
    // }else{
    //   res.render("../views/user/signup", { message: "Your have failed to Sign Up"  });
    // }
  }


} catch (error) {
  console.log(error.message); 
}
}
//sendng otp
const otpSender = async (req,res)=>{
try {
  const email=req.session.data.email
  const createdOTP=await sentOTP(email)
  req.session.email=email
  res.redirect("/otpentry")
} catch (error) {
  
}
}

//LoadOTP

const LoadOTP=async (req,res)=>{
  try {
    res.render("../views/user/otp")
  } catch (error) {
console.log(error);
  }
}

//Load Login
const loadLogin=async (req,res)=>{
    try {
      if(req.session.adminAuth){
        res.redirect('/admin/admin')
      }else{
        console.log('reachde       _______',req.session.logged);
        if(req.session.logged){
          const dt=await User.findOne({email:req.session.email})
          console.log(dt);
          if(dt.access){
            res.redirect("/home")
          }else{
            res.render('../views/user/login',{message:"Permission Denied"})
          }
        }else{
          res.render('../views/user/login')
        }
      }
    } catch (error) {
      console.log(error.message);
    }
}


//login

const loginUser=async (req,res)=>{
   try {
    
     const  email=req.body.email.toLowerCase()
     const password=req.body.password;
    // console.log(req.body)

    const emailexists=await User.findOne({email:email})
console.log(emailexists);
    if(emailexists){
      if(emailexists.isAdmin){
        // console.log('reached');
        const admpasswordMatch = await bcrypt.compare(password,emailexists.password)
        req.session.adminAuth=true
        if(admpasswordMatch){
          res.render("../views/admin/adminDash")
        }
      }
      // console.log(emailexists.access,"staus:---")
      if(emailexists.access){
        // console.log(emailexists.access,"staus:--()()()()(-")
        const passwordMatch = await bcrypt.compare(password,emailexists.password)
        // console.log(passwordMatch,"Bcrypt status ")
        if(passwordMatch){
          // const ProductData=  await Products.find({})

          req.session.logged=true;
          req.session.email=email
          console.log('helo___________________________  ',req.session.logged);
          res.redirect("/home")
          
        }else{
           res.render("../views/user/login", { message: "Incorrect Username or Password" });
          }
        }else{
          res.render("../views/user/login", { message: "Sorry,You are Blocked by admin...!" });
      }
    }else{
      res.render("../views/user/login", { message: "User not found" });

    }

   } catch (error) {
    console.log(error.message);
   }
}
//load Home

const loadHome=async (req,res)=>{
try {
  if(req.session.logged){
    const products = await Product.find({}).limit(8);

      res.render("../views/user/home",{products});

  }else{
    res.redirect("/")
  }
  
} catch (error) {
  console.log(error.message);
}
}

//verify otp
const otpverify=async (req,res)=>{
  try {
    
    const data=req.session.data;
    // console.log(data)
  const otp=await  OTP.findOne({email:data.email})
  if(Date.now()>otp.ExpireAt){
    await OTP.deleteOne({email:data.email})
  }else{
    const hashed=otp.otp;
    // const code=req.body.otp
    const code = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;
    // console.log(req.body);
    req.session.email=data.email;
  

    console.log(`hashed is ${hashed}and otp is ${code}`);
  if(hashed==code){
   const newUser=new User({
    username:data.username,
    email:data.email,
    password:data.password,
    date:Date.now()
   })
   await newUser.save()
   req.session.logged=true
   req.session.email=data.email
   res.redirect("/home")
  }else{
    res.render("../views/user/otp",{message:"invalid OTP"})
  }
  }
  } catch (error) {
  console.log(error.message);
    
  }
}

//load product detail
const LoadproductDetail=async (req,res)=>{
  try {
    const id=req.query.id;
    // console.log(id);
    const products = await Product.findById(id)
    res.render("../views/user/ProductDetail",{products})
    // console.log(products);
  } catch (error) {
  console.log(error.message);
    
  }
}

//product details after login
const LoadproductDetailVerified=async (req,res)=>{
  try {
    const id=req.query.id;
    // console.log(id);
    const products = await Product.findById(id)
    res.render("../views/user/ProductDetailesVerified",{products})
    // console.log(products);
  } catch (error) {
  console.log(error.message);
    
  }
}


//product listing
const ProductListing=async(req,res)=>{
  try {
    const products = await Product.find({isdeleted:false})
    res.render("../views/user/ProductListing",{products})
  } catch (error) {
  console.log(error.message);
    
  }
}


//product details verified

const ProductListingverified=async (req,res)=>{
  try {
    const products = await Product.find({isdeleted:false})
    res.render("../views/user/ProductListingVerified",{products})
  } catch (error) {
  console.log(error.message);
    
  }
}
 

//LogoutUser

const LogoutUser = async (req, res) => {
  try {
   req.session.logged=false
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};




module.exports = {
    loadSignup,
    landingload,
    signupUser,
    loadLogin,
    loginUser,
    loadHome,
    otpverify,
    LoadOTP,
    otpSender,
    LoadproductDetail,
    ProductListing,
    ProductListingverified,
    LoadproductDetailVerified,
    LogoutUser
  };
  