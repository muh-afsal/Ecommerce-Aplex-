const express = require("express");
const session=require("express-session")
const app = express();
const userRoute=require("./Routes/userRoute")
const adminRoute=require("./Routes/adminRoute")
const mongoose = require("mongoose");
const securekey=process.env.secretkey
const connectdb=require('./config/connection')
require('dotenv').config()

app.use(express.static("public"));

app.use(session({
  secret:process.env.secretkey,
  resave:false,
  saveUninitialized:true
}))

app.set("view engine", "ejs");


app.use(express.urlencoded({extended:true}))
app.use(express.json())




app.use("/",userRoute)
app.use("/admin",adminRoute)

app.listen(3000, () => {
  console.log("server has started on http://localhost:3000");
});
