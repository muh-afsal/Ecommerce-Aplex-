const User = require("../Model/collections/userModel");
const OTP = require("../Model/collections/otpModel");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const category = require("../Model/collections/categoryModel");
const Cart = require("../Model/collections/CartModel");
const Products = require("../Model/collections/ProductModel");
const Wishlist = require("../Model/collections/wishlistModel");
const ReferalOffers = require("../Model/collections/referalOfferModel");
const CategoryOffers = require("../Model/collections/categoryofferModel");
const ProductOffers = require("../Model/collections/productOfferModel");
var cron = require("node-cron");
const {
  productAddtocart,
  calculateTotalPrice,
} = require("../helper/cartHelper");

// Load Manage Category offers ------------------------------------------------>
const LoadManageCategoryOffers = async (req, res) => {
  try {
    const Categorydata = await category.find();
    const Offerdata = await CategoryOffers.find();
    res.render("../views/admin/ManageCategoryOffers.ejs",{Categorydata,Offerdata})
  } catch (error) {
    console.log(error)
  }
};


cron.schedule("* * * * * *", async () => {
  try {
    const currentDate = new Date();

    const catUpdate = await CategoryOffers.updateMany(
      {
        EndDate: { $lt: currentDate },
      },
      { $set: { Status: false } }
    );

    const productOffers = await ProductOffers.find();

    const updateProductOffersPromises = productOffers.map(async (productOffer) => {
      if (productOffer.EndDate < currentDate) {
        await ProductOffers.findByIdAndUpdate(
          productOffer._id,
          { $set: { Status: false } },
          { new: true }
        );
      }
    });

    await Promise.all(updateProductOffersPromises);

  } catch (error) {
    console.error("Error updating offers:", error);
  }
});




// Load Manage product offers ------------------------------------------------>
const LoadManageProductOffers = async (req, res) => {
  try {
    const ProductsData = await Products.find  ({isdeleted:false});
    const Offerdata = await ProductOffers.find();
    res.render("../views/admin/ManageProductOffers.ejs",{Offerdata,ProductsData})
  } catch (error) {
    console.log(error)
  }
};

// Load Manage referal offers ------------------------------------------------>
const LoadManageReferalOffers = async (req, res) => {
  try {   
    const Referaldata = await ReferalOffers.findOne();
    res.render("../views/admin/ManageReferalOffers.ejs",{Referaldata})
  } catch (error) {
    console.log(error)
  }
};


const DisableReferalOffers=async(req,res)=>{
  try {
    const Referaldata = await ReferalOffers.findOneAndUpdate({Status:false});
    res.json({ status: true});
  } catch (error) {
    console.log(error)
  }
}
const EnableReferalOffers=async(req,res)=>{
  try {
    const Referaldata = await ReferalOffers.findOneAndUpdate({Status:true});
    res.json({ status: true});
  } catch (error) {
    console.log(error)
  }
}


const EditReferal=async(req,res)=>{
  try {
    const newBprice=req.body.newBonusPrice
    const Referaldata = await ReferalOffers.findOneAndUpdate({BonusPrice:newBprice});
    if(Referaldata){
      res.json({ status: true,message:"Bonus Price Updated Succesfully"});
    }else{
      res.json({ status: false,message:"Error while Updating Bonus Price !"});
    }
  } catch (error) {
    res.json({ status: false,message:"Error while Updating Bonus Price !"});
    console.log(error)
  }
}


const AddCategoryOffer = async (req, res) => {
  try {
    const categoryentered = req.body.categoryName;
    const Offerdata = await CategoryOffers.find();
    const Categorydata = await category.find({ Status: true });
    const productdata = await Products.find({ Category: categoryentered });

    const existingCategoryOffer = await CategoryOffers.findOne({ CategoryName: categoryentered });

    if (existingCategoryOffer) {
      return res.render('../views/admin/ManageCategoryOffers.ejs', {
        Categorydata,
        Offerdata,
        errorMessage: 'Category with this name already exists.',
      });
    }

    const newCategoryOffer = new CategoryOffers({
      CategoryName: req.body.categoryName,
      OfferPersentage: req.body.OfferePersentage,
      EndDate: req.body.newexpiringDate,
      Added: Date.now(),
    });

    await newCategoryOffer.save();

    const discountPercentage = parseFloat(req.body.OfferePersentage);
    const discountMultiplier = 1 - discountPercentage / 100;

    const updatePromises = productdata.map(async (product) => {
      if (product.Offertype !== 'productOffer') {
        const originalPrice = product.Price;
        const discountedPrice = Math.ceil(originalPrice * discountMultiplier);

        product.DiscountPrice = discountedPrice;
        product.DiscountPercentage = discountPercentage;
        product.isOffer = true;
        product.Offertype = 'categoryoffer';

        return product.save();
      } else {
        return Promise.resolve();
      }
    });

    await Promise.all(updatePromises);

    res.redirect('/admin/categoryOffers');
  } catch (error) {
    console.log(error);
  }
};




const DeleteCategoryOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const categoryOffer = await CategoryOffers.findById(offerId);

    if (!categoryOffer) {
      return res.status(404).json({ success: false, message: 'Category offer not found' });
    }

    const productsInCategory = await Products.find({ Category: categoryOffer.CategoryName });

    // Update each product in the category
    const updateProductsPromises = productsInCategory.map(async (product) => {
      if (product.Offertype === 'categoryoffer') {
        product.DiscountPrice = 0;
        product.DiscountPercentage = 0;
        product.isOffer = false;
        product.Offertype = 'none';

        await product.save();
      }
    });

    await Promise.all(updateProductsPromises);

    await CategoryOffers.findByIdAndDelete(offerId);

    res.json({ success: true, message: 'Category offer deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const EditCategoryOffer = async (req, res) => {
  try {
    const offerId = req.query.id;

    const updatedCategoryOffer = await CategoryOffers.findByIdAndUpdate(
      offerId,
      {
        CategoryName: req.body.CategoryName,
        OfferPersentage: req.body.OfferePersentage,
        EndDate: req.body.newexpiringDate,
      },
      { new: true }
    );

    if (!updatedCategoryOffer) {
      console.log("Category offer not found");
    }

    const productsInCategory = await Products.find({ Category: updatedCategoryOffer.CategoryName, Offertype: 'categoryoffer' });

    const updateProductsPromises = productsInCategory.map(async (product) => {
      if (product.Offertype !== 'productOffer') {
        const originalPrice = product.Price;
        const discountPercentage = parseFloat(updatedCategoryOffer.OfferPersentage);
        const discountMultiplier = 1 - discountPercentage / 100;
        const discountedPrice = Math.ceil(originalPrice * discountMultiplier);

        product.DiscountPrice = discountedPrice;
        product.DiscountPercentage = discountPercentage;

        return product.save();
      } else {
        return Promise.resolve();
      }
    });

    await Promise.all(updateProductsPromises);

    const Categorydata = await category.find();
    const Offerdata = await CategoryOffers.find();
    res.render("../views/admin/ManageCategoryOffers.ejs", { Categorydata, Offerdata });
  } catch (error) {
    console.log(error);
  }
};





const AddProductOffer = async (req, res) => {
  try {
    const { ProductName, OfferePersentage, newexpiringDate } = req.body;
    const existingProductOffer = await ProductOffers.findOne({ ProductName: ProductName });
    if (existingProductOffer) {
      const ProductsData = await Products.find  ({isdeleted:false});
      const Offerdata = await ProductOffers.find();
      return res.render('../views/admin/ManageProductOffers.ejs', {ProductsData,Offerdata, errorMessage: 'Category with this name already exists.'});
    }

    const newProductOffer = new ProductOffers({
      ProductName: ProductName,
      OfferPersentage: OfferePersentage,
      Added: Date.now(),
      EndDate: newexpiringDate,
    });

    await newProductOffer.save();

    const discountPercentage = parseFloat(OfferePersentage);
    const discountMultiplier = 1 - discountPercentage / 100;

    const product = await Products.findOne({ Name: ProductName });
     console.log(product)
    if (product) {
      const originalPrice = product.Price;
      const discountedPrice = Math.ceil(originalPrice * discountMultiplier);

      product.DiscountPrice = discountedPrice;
      product.DiscountPercentage = discountPercentage;
      product.isOffer = true;
      product.Offertype = 'productOffer';

      await product.save();
    }

    res.redirect('/admin/productOffers');
  } catch (error) {
    console.log(error);
  }
};


const DeleteProductOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const productOffer = await ProductOffers.findById(offerId);

    if (!productOffer) {
      return res.status(404).json({ success: false, message: 'Product offer not found' });
    }

    const product = await Products.findOne({ Name: productOffer.ProductName });

    if (product) {
      const categoryOffer = await CategoryOffers.findOne({ CategoryName: product.Category });

      if (categoryOffer) {
        const originalPrice = product.Price;
        const discountPercentage = parseFloat(categoryOffer.OfferPersentage);
        const discountMultiplier = 1 - discountPercentage / 100;
        const discountedPrice = Math.ceil(originalPrice * discountMultiplier);

        product.DiscountPrice = discountedPrice;
        product.DiscountPercentage = discountPercentage;
        product.isOffer = true;
        product.Offertype = 'categoryoffer';

        await product.save();
      } else {
        product.DiscountPrice = 0;
        product.DiscountPercentage = 0;
        product.isOffer = false;
        product.Offertype = 'none';

        await product.save();
      }
    }

    await ProductOffers.findByIdAndDelete(offerId);

    res.json({ success: true, message: 'Product offer deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};






const EditProductsOffer = async (req, res) => {
  try {
    const offerId = req.query.id;

    const updatedProductOffer = await ProductOffers.findByIdAndUpdate(
      offerId,
      {
        ProductName: req.body.ProductName,
        OfferPersentage: req.body.OfferePersentage,
        EndDate: req.body.newexpiringDate,
      },
      { new: true }
    );

    if (!updatedProductOffer) {
      console.log("Product offer not found");
    }

    const product = await Products.findOne({ Name: updatedProductOffer.ProductName });

    if (product) {
      const originalPrice = product.Price;
      const discountPercentage = parseFloat(updatedProductOffer.OfferPersentage);
      const discountMultiplier = 1 - discountPercentage / 100;
      const discountedPrice = Math.ceil(originalPrice * discountMultiplier);

      product.DiscountPrice = discountedPrice;
      product.DiscountPercentage = discountPercentage;

      await product.save();
    }

    res.redirect('/admin/productOffers');

  } catch (error) {
    console.log(error);
  }
};





module.exports = {
  LoadManageCategoryOffers,
  LoadManageProductOffers,
  LoadManageReferalOffers,
  DisableReferalOffers,
  EnableReferalOffers,
  EditReferal,
  AddCategoryOffer,
  DeleteCategoryOffer ,
  EditCategoryOffer,
  AddProductOffer,
  DeleteProductOffer,
  EditProductsOffer
};
