const session = require("express-session");
const { ObjectId } = require("mongodb");
// const products = require("../Model/collections/ProductModel");
const category = require("../Model/collections/categoryModel");

//Load manage category
const LoadmanageCategory = async (req, res) => {
  try {
    const category1 = await category.find({ Status: true }).sort({ date: 1 });
    res.render("../views/admin/ManageCategory", { category: category1 });
  } catch (error) {
    console.log(error.message);
  }
};

//Load add category
const LoadaddCategory = async (req, res) => {
  try {
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
    const Category = await category.findById(id);
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
  const Category = await category.findById(id);
  try {
    const CategoryU = await category.findByIdAndUpdate(id, {
      $set: {
        name: req.body.name,
        description: req.body.description,
      },
    });

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
      errmessage: "Category Alread Exist!!!!",
      Category,
    });
  }
};

//delete category

const softDeleteCategory = async (req, res) => {
  try {
    const id = req.query.id;

    const Category = await category.findByIdAndUpdate(id, {
      $set: { Status: false },
    });

    res.redirect("/admin/manageCategory");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  LoadmanageCategory,
  LoadaddCategory,
  addCategory,
  LoadEditCategory,
  UpdateCategory,
  softDeleteCategory,
};
