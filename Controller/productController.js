const User = require("../Model/collections/userModel");
const OTP = require("../Model/collections/otpModel");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const Product = require("../Model/collections/ProductModel");
const category = require("../Model/collections/categoryModel");
const cart = require("../Model/collections/CartModel");
const Products = require("../Model/collections/ProductModel");

//load product detail
const LoadproductDetail = async (req, res) => {
  try {
    const id = req.query.id;
    const products = await Product.findById(id);
    res.render("../views/user/ProductDetail", { products });
  } catch (error) {
    console.log(error.message);
  }
};

//product details after login
const LoadproductDetailVerified = async (req, res) => {
  try {
    const id = req.query.id;
    const alreadyexist = await cart.findOne({ "Items.Products": id });
    const products = await Product.findById(id,{isdeleted:false});
    res.render("../views/user/ProductDetailesVerified", {
      products: products,
      alreadyexist: alreadyexist,
    });
  } catch (error) {
    console.log(error.message);
  }
};

//product listing
const ProductListing = async (req, res) => {
  try {
    const categoryData = await category.find({ Status: true });
       //creating pagination
       const pageNum = req.query.page;
       const perPage = 8;
       const [dataCount, products] = await Promise.all([
         Product.find({ isdeleted: false }).count(),
         Product.find({ isdeleted: false }).skip((pageNum - 1) * perPage).limit(perPage)
       ]);
       let i = (pageNum - 1) * perPage;
       res.render("../views/user/ProductListing", {products,i,dataCount,categoryData});
  } catch (error) {
    console.log(error.message);
  }
};

//product details verified

const ProductListingverified = async (req, res) => {
  try {
    const categoryData = await category.find({ Status: true });
       //creating pagination
       const pageNum = req.query.page;
       const perPage = 8;
       const [dataCount, products] = await Promise.all([
         Product.find({ isdeleted: false }).count(),
         Product.find({ isdeleted: false }).skip((pageNum - 1) * perPage).limit(perPage)
       ]);
       let i = (pageNum - 1) * perPage;
       res.render("../views/user/ProductListingVerified", {products,i,dataCount,categoryData});
     
   
  } catch (error) {
    console.log(error.message);
  }
};

//Load Manage Product
const LoadmanageProduct = async (req, res) => {
  try {
    const productsData = await Product.find({ isdeleted: false }).sort({
      date: 1,
    });
    res.render("../views/admin/manageProduct", { productsData });
  } catch (error) {
    console.log(error.message);
  }
};
//Load Add porduct
const LoadaddProduct = async (req, res) => {
  try {
    const Category = await category.find({ Status: true }).sort({ date: -1 });
    res.render("../views/admin/AddProduct", { Category });
  } catch (error) {
    console.log(error.message);
  }
};

//adding product
const addProduct = async (req, res) => {
  try {
    const Name = req.body.name;
    const Price = req.body.price;
    const Description = req.body.description;
    const Category = req.body.category;
    const Status = req.body.status;
    const Stock = req.body.Stock;
    let Image = [];
    const mainImage = req.files;

    Image.push("/product-images/" + req.files["main-image"][0].filename);
    for (let i = 0; i < req.files["sub-image"].length; i++) {
      Image.push("/product-images/" + req.files["sub-image"][i].filename);
    }

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

      await newProduct.save();
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
    if (productdata) {
      res.render("../views/admin/EditProduct.ejs", { productdata, Category });
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
    if (req.files) {
      if (req.files["main-image"] && req.files["main-image"][0]) {
        await Product.updateOne(
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
    const Products = await Product.findByIdAndUpdate(id, {
      $set: {
        Name: req.body.name,
        Price: req.body.price,
        Description: req.body.description,
        Category: req.body.category,
        Status: req.body.status,
        Stock: req.body.Stock,
      },
    });
    if (Products) {
   
      res.redirect("/admin/manageProduct");
    } else {
     
      res.render("../views/admin/EditProduct", {
        message: "Update failed",
        productdata,
      });
    }
  } catch (error) {
    console.log(error.message);
   
    res.send("Error in edit product", error);
  }
};

//delete product
const softDeleteProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const result = await Product.findByIdAndUpdate(id, { isdeleted: true });
    res.redirect("/admin/manageProduct");
  } catch (error) {
    console.error(`Error soft deleting product: ${error.message}`);
    throw error;
  }
};



const ProductFilter=async(req,res)=>{
  try {
    const categoryValue=req.query.category?req.query.category.split(","):[]
    let filterQuery={}
    if(categoryValue.length>0){
      filterQuery.Category={$in:categoryValue}
    }
    const productdata=await Products.find(filterQuery).limit(8);

    
    res.json(productdata)
    
    
  } catch (error) {
    console.log(error);
  }
}



const searchProduct=async(req,res)=>{
  try {
    const query = req.body.query;
    const regex = new RegExp( query, "i");

    const searchedProduct = await Products.find({

      $or: [{ Name: { $regex: regex } }],
      isdeleted: false,

    }).limit(8);

    res.json(searchedProduct)


  } catch (error) {
    console.log(error);
  }
}

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
  ProductFilter,
  searchProduct
};
