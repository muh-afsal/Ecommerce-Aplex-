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
const ReferalOffer = require("./Model/collections/referalOfferModel");
const morgan = require('morgan')



app.use(express.static("public"));
app.use(require('nocache')())

app.use(session({
  secret:process.env.secretkey,
  resave:false,
  saveUninitialized:true
}))

app.set("view engine", "ejs");
// app.use(morgan('tiny'));


app.use(express.urlencoded({extended:true}))
app.use(express.json())



app.use("/",userRoute)
app.use("/admin",adminRoute)


// const addReferalOffer = async () => {
//   try {
//     const newReferalOffer = new ReferalOffer({
//       BonusPrice: 15,
//       Joincount: 0,
//       Added: new Date(),
//       Status: true
//     });

//     // Save the new document to the database
//     await newReferalOffer.save();
//     console.log('New ReferalOffer document added successfully');
//   } catch (error) {
//     console.error('Error adding ReferalOffer document', error);
//   }
// };

// addReferalOffer();


app.listen(3000, () => {
  
  console.log("server has started on http://localhost:3000");
});
