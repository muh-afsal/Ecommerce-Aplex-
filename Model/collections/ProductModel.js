const mongoose=require ('mongoose')
require('dotenv').config()



const ProductSchema = new mongoose.Schema({

    isdeleted: {type: Boolean,default:false },
    
    Name: {type: String, required: true, unique:true},
    
    Description: { type: String, required: true },
    
    variant: [{
    

    model: {type: String, required: true },
    memory: {type: String, required: true },
    color: {type: String, required: true },
    quantity: { type: Number, required: true }
    
    }],

    Image: {
        type:Array,
    },
    Stock:{
        type: Number, required: true
    },
    Category:{
        type:String,
    },
    
    Status: {type: String, enum: ['Draft', 'Published', 'Out of Stock', 'Low Stock'] },
    
    Product_added: { type: Date },
    
    Specification: [{
    
    model: {type: String },
    
    memory: {type: String },
    
    color: {type: String },
    
    Category: {type: String },
    
    
    
    }],
    
    Price: { type: Number, required: true },
    
    Rating: {type: Number },
  
    
    }, { timestamps: true });
    
    





const Products=mongoose.model(process.env.PRODUCT_COLLECTION,ProductSchema)
module.exports=Products