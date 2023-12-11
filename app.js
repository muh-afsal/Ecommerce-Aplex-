const express = require("express");
const session=require("express-session")
const app = express();
const userRoute=require("./Routes/userRoute")
const adminRoute=require("./Routes/adminRoute")
const mongoose = require("mongoose");
const securekey=process.env.secretkey
const connectdb=require('./config/connection')
require('dotenv').config()
const bcrypt=require("bcrypt")
const Admin = require("./Model/collections/AdminModel");


app.use(express.static("public"));
app.use(require('nocache')())

app.use(session({
  secret:process.env.secretkey,
  resave:false,
  saveUninitialized:true
}))

// async function adminss() {

//   const hashedPassword = bcrypt.hashSync("admin@123", 10);
//   const newAdmin = new Admin({
//     name: "Afsal",
//     email: "admin@gmail.com",
//     date:new Date(),
//     password: hashedPassword
//   })
//   await newAdmin.save();
// }
// adminss()

app.set("view engine", "ejs");


app.use(express.urlencoded({extended:true}))
app.use(express.json())




app.use("/",userRoute)
app.use("/admin",adminRoute)

app.listen(3000, () => {
  console.log("server has started on http://localhost:3000");
});
