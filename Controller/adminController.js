const bcrypt = require("bcrypt");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const products = require("../Model/collections/ProductModel");
const User = require("../Model/collections/userModel");
const category = require("../Model/collections/categoryModel");

//Load admin dash
const LoadAdminDash = async (req, res) => {
  try {
    res.render("../views/admin/adminDash");
  } catch (error) {
    console.log(error.message);
  }
};

//Load Manage Product
const LoadmanageProduct = async (req, res) => {
  try {
    const productsData = await products
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
    const productexist = await products.findOne({ Name: Name });

    if (productexist) {
      res.render("../views/admin/AddProduct", {
        errmessage: `A product named "${Name}" alredy exists`,
      });
    } else {
      const newProduct = new products({
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
      console.log("prodct saved");
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
    const productdata = await products.findById({ _id: id });
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
            await products.updateOne(
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
    const productdata = await products.findById(id);
    const Product = await products.findByIdAndUpdate(id, {
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
    const result = await products.findByIdAndUpdate(id, { isdeleted: true });
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

//manageuser

const manageUser = async (req, res) => {
  try {
    const userData = await User.find({ isAdmin: false });
    res.render("../views/admin/ManageUser", { userData });
  } catch (error) {
    console.log(error.message);
  }
};

//block and unblock user
// const blockUnblockUser = async (req,res) => {
//     try {
//         // console.log('called kkk');
//         const id=req.query.id
//         const result = await User.findByIdAndUpdate(id,{ access: false });

//         res.redirect("/admin/manageUser")
//     } catch (error) {
//         console.error(`Error soft deleting product: ${error.message}`);
//         throw error;
//     }
// };

// In your router or controller file
const blockUnblockUser = async (req, res) => {
  try {
    const { id, access } = req.body;

    const result = await User.findByIdAndUpdate(id, { access });

    // Redirect back to the original page
    res.redirect("/admin/manageUser");
  } catch (error) {
    console.error(`Error updating user access: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

//Load manage category
const LoadmanageCategory = async (req, res) => {
  try {
    const category1 = await category.find({ Status: true }).sort({ date: 1 });
    console.log(category1, "sfsg");
    res.render("../views/admin/ManageCategory", { category: category1 });
  } catch (error) {
    console.log(error.message);
  }
};

//Load add category
const LoadaddCategory = async (req, res) => {
  try {
    // console.log(category1,'this i');
    res.render("../views/admin/AddCategory.ejs");
  } catch (error) {
    console.log(error.message);
  }
};

//adding category
const addCategory = async (req, res) => {
  try {
    const Name = req.body.name;
    const Description = req.body.description;

    const categoryExist = await category.findOne({ name: Name });

    if (categoryExist) {
      res.render("../views/admin/AddCategory", {
        errmessage: `A Category named "${Name}" alredy exists`,
      });
    } else {
      const newCategory = new category({
        name: Name,
        description: Description,
        date: Date.now(),
      });

      await newCategory.save();
      // console.log("prodct saved");
      res.redirect("/admin/manageCategory");
    }
  } catch (error) {
    console.log(error);
  }
};

//edit category

const LoadEditCategory = async (req, res) => {
  try {
    const id = req.query.id;
    // console.log("product id:", id);
    const Category = await category.findById(id);
    console.log(Category);
    if (Category) {
      res.render("../views/admin/editCategory", { Category });
      // res.status(200).json({ product });
    } else {
      res.redirect("/admin/manageCategory");
      // res.status(400).json({ error:  "something is wrong"});
    }
  } catch (error) {
    console.log(error.message);
  }
};

//update category
const UpdateCategory = async (req, res) => {
  const id = req.query.id;
  const Category=await category.findById(id)
try {
  // console.log(id,"id of the category--------------------------------------------------------------------------------------")
  

  const CategoryU=await category.findByIdAndUpdate(id,{
    $set:{
      name:req.body.name,
      description:req.body.description,
    }
  })
  // console.log(req.body.name,req.body.description,"name and the desription of the category-------------------------")
  if (CategoryU) {
    res.redirect("/admin/manageCategory");
  } else {
    // If the update fails, render an error message
    res.render("../views/admin/EditCategory", {
      errmessage: "Update failed",
      Category,
    });
  }

} catch (error) {
  console.log(error.message);
  res.render("../views/admin/EditCategory", {
    errmessage:"Category Alread Exist!!!!",
    Category,
  });
}
};


//delete category

const softDeleteCategory=async (req,res)=>{
try {
  const id=req.query.id

  const Category=await category.findByIdAndUpdate(id,{$set:{ Status:false}})

  res.redirect("/admin/manageCategory")
} catch (error) {
  console.log(error.message);
  
}
}















module.exports = {
  LoadAdminDash,
  LoadmanageProduct,
  LoadaddProduct,
  LoadmanageCategory,
  addProduct,
  softDeleteProduct,
  editProductLoad,
  UpdateProduct,
  manageUser,
  blockUnblockUser,
  LoadaddCategory,
  addCategory,
  LoadEditCategory,
  UpdateCategory,
  softDeleteCategory,
};
