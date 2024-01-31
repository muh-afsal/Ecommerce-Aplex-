const session = require("express-session");
const { ObjectId } = require("mongodb");
// const products = require("../Model/collections/ProductModel");
const category = require("../Model/collections/categoryModel");

//Load manage category
const LoadmanageCategory = async (req, res) => {
  try {
    const category1 = await category.find({ Status: true }).sort({ date: -1 });
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

    const categoryExist = await category.findOne({
      name: { $regex: new RegExp(`^${Name}$`, "i") },
    });

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
    } else {
      res.redirect("/admin/manageCategory");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const UpdateCategory = async (req, res) => {
  const id = req.query.id;

  try {
    const Category = await category.findById(id);

    const newName = req.body.name;

    const categoryExist = await category.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${newName}$`, "i") },
    });

    if (categoryExist) {
      res.render("../views/admin/EditCategory", {
        errmessage: `A Category named "${newName}" already exists`,
        Category,
      });
    } else {
      const CategoryU = await category.findByIdAndUpdate(id, {
        $set: {
          name: newName,
          description: req.body.description,
        },
      });

      if (CategoryU) {
        res.redirect("/admin/manageCategory");
      } else {
        res.render("../views/admin/EditCategory", {
          errmessage: "Update failed",
          Category,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    
  }
};

//delete category

const softDeleteCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const result = await category.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      res.redirect("/admin/manageCategory");
    } else {
      res.render("../views/admin/EditCategory", {
        errmessage: "Error during delete",
      });
    }
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
