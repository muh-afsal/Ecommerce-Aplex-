const mongoose=require ('mongoose')
require('dotenv').config()




const ProductSchema = new Schema({

    isdeleted: {type: Boolean },
    
    Name: {type: String, required: true, },
    
    Description: { type: String, required: true },
    
    variant: [{
    
    model: {type: String, required: true },
    memory: {type: String, required: true },
    color: {type: String, required: true },
    quantity: { type: Number, required: true }
    
    }],
    
    Image: [{
    
    Child_four: { type: String },
    
    Child_one: { type: String },
    
    Child_three: { type: String },
    
    Child_two: {type: String },
    
    Main: {type: String },
    
    }],
    
    Status: {type: String, enum: ['draft', 'published', 'out_of_stock', 'low_quantity'] },
    
    Product_added: { type: Date },
    
    Specification: [{
    
    model: {type: String },
    
    memory: {type: String },
    
    color: {type: String },
    
    Category: {type: String },
    
    
    
    }],
    
    Price: { type: Number, required: true },
    
    Rating: {type: Number },
    isActive:{type:Boolean},
    
    }, { timestamps: true });
    
    





const Products=mongoose.model(process.env.PRODUCT_COLLECTION,ProductSchema)
module.exports=Products