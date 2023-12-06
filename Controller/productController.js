const User=require('../Model/collections/userModel')
const OTP=require('../Model/collections/otpModel')
const session = require('express-session');
const { ObjectId } = require("mongodb");
const Product=require("../Model/collections/ProductModel");
const category = require("../Model/collections/categoryModel");
const cart=require('../Model/collections/CartModel')


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
      const alreadyexist= await cart.findOne({"Items.Products":id})
      // console.log(alreadyexist+"haiiiiii");
      // console.log(id);
      const products = await Product.findById(id)
      res.render("../views/user/ProductDetailesVerified",{products:products,alreadyexist:alreadyexist})
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

  //Load Manage Product
const LoadmanageProduct = async (req, res) => {
    try {
      const productsData = await Product
        .find({ isdeleted: false })
        .sort({ date: 1});
      res.render("../views/admin/manageProduct", { productsData });
    } catch (error) {
      console.log(error.message);
    }
  };
  //Load Add porduct
  const LoadaddProduct = async (req, res) => {
    try {
      const Category = await category.find({ Status: true }).sort({ date: -1 });
      res.render("../views/admin/AddProduct",{Category});
    } catch (error) {
      console.log(error.message);
    }
  };
  
  //adding product
  const addProduct = async (req, res) => {
    try {
      // const {Name,Price,Description,Category,Status}=req.body
      const Name = req.body.name;
      const Price = req.body.price;
      const Description = req.body.description;
      const Category = req.body.category;
      const Status = req.body.status;
      const Stock = req.body.Stock;
      let Image = [];
      const mainImage = req.files;
  
      console.log(req.files, "________________________");
      Image.push("/product-images/" + req.files["main-image"][0].filename);
      for (let i = 0; i < req.files["sub-image"].length; i++) {
        Image.push("/product-images/" + req.files["sub-image"][i].filename);
      }
      // console.log(image)
      // console.log(Name);
      // console.log(Price);
      // console.log(Description);
      // console.log(Category);
      // console.log(Status);
      const productexist = await Product.findOne({ Name: Name });
  
      if (productexist) {
        res.render("../views/admin/AddProduct", {
          errmessage: `A product named "${Name}" alredy exists`,
        });
      } else {
        const newProduct = new Product({
          Name: Name,
          Price: Price,
          Description: Description,
          Category: Category,
          Image: Image,
          Status: Status,
          Stock: Stock,
          Product_added: Date.now(),
        });
        console.log(newProduct);
  
        await newProduct.save();
        // console.log("prodct saved");
        res.redirect("/admin/addproduct");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  //edit product
  const editProductLoad = async (req, res) => {
    try {
      const Category = await category.find({ Status: true }).sort({ date: -1 });
      const id = req.query.id;
      const productdata = await Product.findById({ _id: id });
      // console.log(productdata);
      if (productdata ) {
        res.render("../views/admin/EditProduct.ejs", { productdata,Category});
      } else {
        res.redirect("/admin/manageProduct");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
   
  //update product
  const UpdateProduct = async (req, res) => {
    try {
      const id = req.query.id;
  
      let Image = [];
      // const mainImage = req.files;
      if (req.files) {
        console.log(req.files, "________________________");
        if (req.files["main-image"] && req.files["main-image"][0]) {
          // Image.push("/product-images/" + req.files["main-image"][0].filename);
          await products.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                [`Image.${0}`]:
                  "/product-images/" + req.files["main-image"][0].filename,
              },
            }
          );
        }
        if (req.files["sub-image"]) {
          for (let i = 0; i < req.files["sub-image"].length; i++) {
            if (req.files["sub-image"][i]) {
              await Product.updateOne(
                { _id: new ObjectId(id) },
                {
                  $set: {
                    [`Image.${i + 1}`]:
                      "/product-images/" + req.files["sub-image"][i].filename,
                  },
                }
              );
            }
          }
        }
      }
      const productdata = await Product.findById(id);
      const Product = await Product.findByIdAndUpdate(id, {
        $set: {
          Name: req.body.name,
          Price: req.body.price,
          Description: req.body.description,
          Category: req.body.category,
          Status: req.body.status,
          Stock: req.body.Stock,
        },
      });
      // console.log(Product);
      if (Product) {
        // If the update is successful, redirect to the appropriate page
        res.redirect("/admin/manageProduct");
      } else {
        // If the update fails, render an error message
        res.render("../views/admin/EditProduct", {
          message: "Update failed",
          productdata,
        });
      }
    } catch (error) {
      console.log(error.message);
      // Handle the error and render an error message
      // res.render("../views/admin/EditProduct", { message: "An error occurred",productdata });
      res.send("Error in edit product", error);
    }
  };
  
  //delete product
  const softDeleteProduct = async (req, res) => {
    try {
      // console.log('called kkk');
      const id = req.query.id;
      const result = await Product.findByIdAndUpdate(id, { isdeleted: true });
      // if (result) {
      //     console.log(`Product with ID ${productId} soft deleted successfully.`);
      //     return result;
      // } else {
      //     console.log(`Product with ID ${productId} not found.`);
      //     return null;
      // }
      res.redirect("/admin/manageProduct");
    } catch (error) {
      console.error(`Error soft deleting product: ${error.message}`);
      throw error;
    }
  };
  




  module.exports = {
    LoadproductDetail,
    LoadproductDetailVerified,
    ProductListing,
    ProductListingverified,
    LoadmanageProduct,
    LoadaddProduct,
    addProduct,
    softDeleteProduct,
    editProductLoad,
    UpdateProduct,
  }