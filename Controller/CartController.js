const Order=require("../Model/collections/orderModel") 
const session = require("express-session");
const { ObjectId } = require("mongodb");
const category = require("../Model/collections/categoryModel");
const User = require("../Model/collections/userModel");
const {
  productAddtocart,
  calculateTotalPrice,
} = require("../helper/cartHelper");
const Products = require("../Model/collections/ProductModel");
const Cart = require("../Model/collections/CartModel");

const LoadCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });

    const cartProduct = await Cart.findOne({ User: user._id }).populate(
      "Items.Products"
    );
    //  console.log(cartProduct);
    let Total = 0;
    calculateTotalPrice(user._id).then((total) => {
      // console.log(total, " in promise");
      // console.log(Total, " total ___________");
      req.session.orderplaced=false;
      res.render("../views/user/cart", { cartProduct: cartProduct, total });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const addtoCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });
    // console.log(user,"user data----");

    const productId = req.body.productId;
    const userId = user._id;
    // console.log(productId,"bhgffx",userId);
    await productAddtocart(productId, userId);

    res.json({ status: true });
  } catch (error) {
    console.log(error);
    res.json({ status: false });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });
    const userId = user._id;
    const productId = req.params.id;
    const newQuantity = req.body.newQuantity;

    // Find the user's cart
    const userCart = await Cart.findOne({ User: userId });

    if (!userCart) {
      return res.json({ status: false, message: "User's cart not found" });
    }

    // Find the index of the product in the cart's Items array
    const productIndex = userCart.Items.findIndex(
      (item) => item.Products.toString() === productId
    );

    if (productIndex === -1) {
      return res.json({
        status: false,
        message: "Product not found in the cart",
      });
    }

    // Update the quantity of the product
    userCart.Items[productIndex].Quantity = newQuantity;

    // Save the updated cart
    await userCart.save();

    const updatedTotal = await calculateTotalPrice(userId);

    // Update the TotalAmount field in the Cart collection
    userCart.TotalAmount = updatedTotal;

    await userCart.save();

    return res.json({
      status: true,
      message: "Quantity updated successfully",
      
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, message: "Error updating quantity" });
  }
};

const removeProduct = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });
    const userId = user._id;
    // console.log(userId);
    const productId = req.params.Id;
    // console.log(productId);

    // Find the user's cart
    const userCart = await Cart.findOne({ User: userId });

    if (!userCart) {
      return res.json({ status: false, message: "User's cart not found" });
    }

    // Find the index of the product in the cart's Items array
    const productIndex = userCart.Items.findIndex(
      (item) => item.Products.toString() === productId
    );

    // console.log(productIndex,"product index==================")
    if (!productIndex === -1) {
      return res.json({
        status: false,
        message: "Product not found in the cart",
      });
    }

    // Remove the product from the Items array
    userCart.Items.splice(productIndex, 1);
    const updatedTotal = await calculateTotalPrice(userId);

    // Save the updated cart
    await userCart.save();

    // Recalculate the total after removing the product

    // Update the TotalAmount field in the Cart collection
    userCart.TotalAmount = updatedTotal;
   
    await userCart.save();

    return res.json({
      status: true,
      message: "Product removed successfully",
      total: updatedTotal,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, message: "Error removing product" });
  }
};

const LoadCheckout = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });
    const userId = user._id;
    // console.log(userId)

    const cartData = await Cart.findOne({ User: userId }).populate(
      "Items.Products"
    );
    const userData = await User.findOne({ _id: userId });
    // console.log(userData)

    // if (!cartData) {
    //   return res.json({ status: false, message: "User's cart not found" });
    // }

    // console.log(cartData)
    res.render("../views/user/checkout", { cartData, userData });
  } catch (error) {
    console.log(error);
  }
};

//address adding
const AddAdress = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });
    const userId = user._id;

    const shippingName = req.body.shippingName;
    const Phone = req.body.phone;
    const City = req.body.city;
    const State = req.body.state;
    const Country = req.body.country;
    const Pincode = req.body.pincode;

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          address: {
            shippingName: shippingName,
            phone: Phone,
            city: City,
            state: State,
            country: Country,
            pincode: Pincode,
          },
        },
      }
    );
    res.redirect("/checkout");
  } catch (error) {
    console.log(error);
    // res.json({ status: false, message: "Error adding address." });
  }
};



const LoadOrderPlaced = async (req, res) => {
  try {
    const addressId = req.body.selectAddressRadioValue;
    const payment = req.body.selectPaymentRadioValue;
    const user = await User.findOne({ email: req.session.email });
    const userId = user._id;

    const cartData = await Cart.findOne({ User: userId }).populate("Items.Products");
    const addressData = user.address.find((address) => address._id == addressId);

    // Generate a random string for orderNumber
    const generateOrderNumber = () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let orderNumber = "";
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        orderNumber += characters.charAt(randomIndex);
      }
      return orderNumber;
    };

    const newOrder = new Order({
      Status: "Ordered",
      UserID: userId,
      orderNumber: generateOrderNumber(),
      TotalPrice: cartData.TotalAmount,
      Items: cartData.Items.map((item) => ({
        productId: item.Products._id,
        Price: item.Products.Price,
        quantity: item.Quantity,
      })),
      Address: {
        shippingName: addressData.shippingName,
        phone: addressData.phone,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        pincode: addressData.pincode,
      },
      paymentMethod: payment,
      paymentStatus: "Paid", 
      CoupenID: null,
      OrderDate: new Date(),
      PaymentId: null,
    });

    // Save the new order
    await newOrder.save();

    // Decrease the stock in the Product collection
    for (const item of newOrder.Items) {
      const product = await Products.findById(item.productId);
      if (product) {
        product.Stock -= item.quantity;
        await product.save();
      }
    }

    // Reset the user's cart
    const userCart = await Cart.findOne({ User: userId });
    userCart.Items = [];
    userCart.TotalAmount = 0;
    await userCart.save();

    req.session.orderplaced = true;
    return res.json({ status: true });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, message: "Error placing order" });
  }
};


const LoadorderPlaced = async (req, res) => {
  try {
    res.render("../views/user/orderPlaced")
  } catch (error) {
    console.log(error);
  }
};




module.exports = {
  LoadCart,
  addtoCart,
  updateQuantity,
  removeProduct,
  LoadCheckout,
  AddAdress,
  LoadOrderPlaced,
  LoadorderPlaced
};
