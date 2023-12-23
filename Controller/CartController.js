const Order = require("../Model/collections/orderModel");
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
const Razorpay = require("razorpay");
const { RAZORPAY_KEY_ID, RAZORPAY_SECRET_ID } = process.env;
const { createRazorpayOrder } = require("../service/razorpay");

// Load add to cart----------------------------------
const LoadCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });
    
    const cartProduct = await Cart.findOne({ User: user._id }).populate(
      "Items.Products"
      );
    
    
    
    calculateTotalPrice(user._id).then((total) => {
      req.session.orderplaced = false;
      res.render("../views/user/cart", { cartProduct: cartProduct, total });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const addtoCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });

    const productId = req.body.productId;
    const userId = user._id;
  
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

    
    userCart.Items[productIndex].Quantity = newQuantity;

   
    await userCart.save();

    const updatedTotal = await calculateTotalPrice(userId);

 
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

    const productId = req.params.Id;

    const userCart = await Cart.findOne({ User: userId });

    if (!userCart) {
      return res.json({ status: false, message: "User's cart not found" });
    }

    const productIndex = userCart.Items.findIndex(
      (item) => item.Products.toString() === productId
    );

    if (!productIndex === -1) {
      return res.json({
        status: false,
        message: "Product not found in the cart",
      });
    }

    userCart.Items.splice(productIndex, 1);
    const updatedTotal = await calculateTotalPrice(userId);

    await userCart.save();

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

    const cartData = await Cart.findOne({ User: userId }).populate(
      "Items.Products"
    );
    const userData = await User.findOne({ _id: userId });

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


  //placing order and saving order details
const LoadOrderPlaced = async (req, res) => {
  try {
    console.log("reached");
    const addressId = req.body.selectAddressRadioValue;
    const payment = req.body.selectPaymentRadioValue;
    const user = await User.findOne({ email: req.session.email });
    const userId = user._id;

    let paymentsts

    if(payment==="Online" || payment==="wallet"){
      paymentsts="Paid"
    }else{
      paymentsts="Pending"
    }

    const cartData = await Cart.findOne({ User: userId }).populate(
      "Items.Products"
    );
    const addressData = user.address.find(
      (address) => address._id == addressId
    );

    const orderid = generateOrderNumber();

    const newOrder = new Order({
      Status: "Ordered",
      UserID: userId,
      orderNumber: orderid,
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
      paymentStatus: paymentsts,
      CoupenID: null,
      OrderDate: new Date(),
      PaymentId: null,
    });
    req.session.TotalPrice = cartData.TotalAmount;

 
      const ordersaved = await newOrder.save();
      
      if (ordersaved) {
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

        res.json({success:true});
      }
    

  } catch (error) {
    console.log(error, "error in place order");
    return res.json({ status: false, message: "Error placing order" });
  }
};




const generateRazorpay=async (req,res)=>{
  try {
    const orderid = generateOrderNumber();
    const user = await User.findOne({ email: req.session.email });
    const userId = user._id;
    const cartData = await Cart.findOne({ User: userId }).populate(
      "Items.Products"
    );

    const totalinrupees = Math.round(cartData.TotalAmount * 100);
      var order = {
        amount: totalinrupees,
        currency: "INR",
        receipt: orderid,
      };
      await createRazorpayOrder(order)
        .then((createdOrder) => {
          res.json({ paymentMethod: "Online", createdOrder, order ,online:true});
        })
        .catch((err) => {
          console.log("error in creating order");
        });
  } catch (error) {
    
  }
}




const LoadorderPlaced = async (req, res) => {
  try {
    req.session.orderplaced = true;
    res.render("../views/user/orderPlaced");
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
  LoadorderPlaced,
  // VerifyPayment,
  generateRazorpay
};
