const mongoose=require ('mongoose')
require('dotenv').config()

const Schema= new mongoose.Schema({

    username:{
        type:String,
        required:true,
        // unique:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        
    },
    emailAuth:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date
    },
    status:{
        type:Boolean,
        default:true
    },
})

const Users=mongoose.model(process.env.USER_COLLECTION,Schema)
module.exports=Users