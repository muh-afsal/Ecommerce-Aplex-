const Orders = require("../Model/collections/orderModel");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const category = require("../Model/collections/categoryModel");
const User = require("../Model/collections/userModel");

const Products = require("../Model/collections/ProductModel");
const Cart = require("../Model/collections/CartModel");

const LoadOrders = async (req, res) => {
  const orderData = await Orders.find().sort({ OrderDate: -1 });;

  try {
    res.render("../views/admin/ManageOrders", { orderData });
  } catch (error) {
    console.log(error);
  }
};

const Orderdetails = async (req, res) => {
  try {
    const orderId = req.query.id;

    const orderData = await Orders.findOne({ _id: orderId }).populate(
      "Items.productId"
    );
   

    res.render("../views/admin/AdminOrderDetails", { orderData });
  } catch (error) {
    console.error(error);
    // res.render('user/404Page')
  }
};

const UpdateOrderStatus = async (req, res) => {
  
  
  try {
    const user = await User.findOne({ email: req.session.email });
    const { orderId } = req.params;
    const { status } = req.body;


    if(status==="Ordered"){
      await Orders.findByIdAndUpdate(orderId, { Status: status });
      res.json({ success: true});

    }
    if(status==="Delivered"){
      await Orders.findByIdAndUpdate(orderId, { Status: status , paymentStatus:"Paid"});
    res.json({ success: true});

    }
    if(status==="Cancelled"){
      await Orders.findByIdAndUpdate(orderId, { Status: status , paymentStatus:"Cancelled"});
    res.json({ success: true});

    }
    

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const UpdatePaymentStatus = async (req, res) => {
  
  try {
    const { orderId } = req.params;
    const { status } = req.body;
     

   
      await Orders.findByIdAndUpdate(orderId, { paymentStatus: status });
    


    res
      .status(200)
      .json({ success: true, message: "Payment status updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const LoadReturnreq=async(req,res)=>{
  try {
     const userData = await User.findOne({ email: req.session.email },{});
     
    const orderData = await Orders.find({returnRequestSend:true}).sort({ OrderDate: -1 });;
      res.render("../views/admin/OrderReturns",{orderData})
  } catch (error) {
    console.log(error)
  }
}


const acceptReturnRequest=async(req,res)=>{
  try {
    const user = await User.findOne({ email: req.session.email });
    const { orderId } = req.params;
    await Orders.findByIdAndUpdate(orderId, { returnRequestAccept: true,Status:"Returned" });

    const totalAmount = orderData.TotalPrice;

    user.walletBalance += totalAmount;

    await user.save();

      const transactionId = generateOrderNumber(); 
      const activityDetails = {
        TransactionType: "credit",
        message: "Order cancelled",
        Date: new Date(),
        TransactionID: transactionId,
      };

      user.Activity.push(activityDetails);

      await user.save();
    res.json({ success: true});
  } catch (error) {
    console.log(error);
  }
}
const rejectReturnRequest=async(req,res)=>{
  try {
    const { orderId } = req.params;
    await Orders.findByIdAndUpdate(orderId, { returnRequestAccept: false ,Status:"Order Return Request Rejected !" });
    res.json({ success: false});
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  LoadOrders,
  Orderdetails,
  UpdatePaymentStatus,
  UpdateOrderStatus,
  LoadReturnreq,
  acceptReturnRequest,
  rejectReturnRequest
};
