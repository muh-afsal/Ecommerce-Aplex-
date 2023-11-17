const bcrypt=require('bcrypt');
const session = require('express-session');
const { ObjectId } = require("mongodb");
const products = require('../Model/collections/ProductModel');




//Load admin dash
const LoadAdminDash=async (req,res)=>{
    try {
        res.render("../views/admin/adminDash")
    } catch (error) {
        console.log(error.message);
    }

}



//Load Manage Product
const LoadmanageProduct=async (req,res)=>{
    try {
        res.render("../views/admin/manageProduct")
        
    } catch (error) {
        console.log(error.message)
    }
}
//Load Add porduct
const LoadaddProduct=async (req,res)=>{
    try {
        res.render("../views/admin/AddProduct")
    } catch (error) {
        console.log(error.message)
    }
}


//adding product
const addProduct = async (req, res) => {
    try {
        // const {Name,Price,Description,Category,Status}=req.body
        const Name = req.body.name;
        const Price = req.body.price;
        const Description = req.body.description;
        const Category = req.body.category;
        const Status = req.body.status;
        let Image = [];
        const mainImage = req.files;
        console.log(req.body)
        // if(req.files){
        //     console.log(req.files,'________________________')
        //     if(req.files["main-image"] && req.files["main-image"][0]){
        //         Image.push('/product-images/' + req.files["main-image"][0].filename);
        //     }else{
        //         return res.render("../views/admin/AddProduct",{err:"Upload image"})
        //     }
        //     if(req.files['sub-image']){
        //         for(let i=0;i<req.files['sub-image'].length;i++){
        //             if(req.files['sub-image'][i]){
        //                 Image.push('/product-images/' + req.files["sub-image"][i].filename);
        //             }
        //         }
        //     }else{
        //         return res.render("../views/admin/AddProduct",{err:"Upload image"})
        //     }
        // }else{
        //     return res.render("../views/admin/AddProduct",{err:"Upload image"})
        // }
        console.log(req.files,'________________________')
        Image.push('/product-images/' + req.files["main-image"][0].filename);
        for(let i=0;i<req.files['sub-image'].length;i++){
            Image.push('/product-images/' + req.files["sub-image"][i].filename);
        }
        // console.log(image)
        console.log(Name);
        console.log(Price);
        console.log(Description);
        console.log(Category);
        console.log(Status);
        const productexist = await products.findOne({ Name: Name });

        if (productexist) {

            res.render('../views/admin/AddProduct', { message: `A product named ${Name} alredy exists` });
        } else {
            const newProduct = new products({
                Name: Name,
                Price: Price,
                Description: Description,
                Category: Category,
                Image: Image,
                Status: Status,
                Product_added: Date.now()
            });

            await newProduct.save();
            console.log("prodct saved");
            res.render('../views/admin/AddProduct', { message: `Product Added Succesfuly` });
        }
    } catch (error) {
        console.log(error);
    }
};


//Load manage category
const LoadmanageCategory=async (req,res)=>{
    try {
        res.render("../views/admin/ManageCategory")
    } catch (error) {
        console.log(error.message)
    }
}



module.exports={
    LoadAdminDash,
    LoadmanageProduct,
    LoadaddProduct,
    LoadmanageCategory,
    addProduct
}