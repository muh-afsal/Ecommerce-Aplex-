const Cart = require("../Model/collections/CartModel");
const Products = require("../Model/collections/ProductModel");



async function productAddtocart(productId, userId) {
  try {
    const cartExist = await Cart.findOne({ User: userId });

    if (!cartExist) {
      const newCart = new Cart({
        User: userId,
        Items: [
          {
            Products: productId,
            Quantity: 1,
          },
        ],
        TotalAmount: 0, // Initialize TotalAmount to 0
        createdAt: Date.now(),
        UpdatedAt: Date.now(),
      });

      await newCart.save();
    } else {
      const productExist = await Cart.findOne({
        User: userId,
        "Items.Products": productId,
      });

      if (!productExist) {
        await Cart.updateOne(
          { User: userId },
          { 
            $push: { Items: { Products: productId, Quantity: 1 } },
            $set: { UpdatedAt: Date.now() } 
          }
        );
      } else {
        await Cart.updateOne(
          { User: userId, "Items.Products": productId },
          { 
            $inc: { "Items.$.Quantity": 1 },
            $set: { UpdatedAt: Date.now() } 
          }
        );
      }
    }

   
    const totalAmount = await calculateTotalPrice(userId);


    await Cart.updateOne({ User: userId }, { $set: { TotalAmount: totalAmount } });

    console.log("Total Amount:", totalAmount);
  } catch (error) {
    console.log(error);
  }
}





function calculateTotalPrice(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      let cartData = await Cart.findOne({ User: userId });

      let Total = 0;

      await Promise.all(
        cartData.Items.map(async (data) => {
          let productData = await Products.findOne({ _id: data.Products });
          let subtotal = productData.Price * data.Quantity;
          Total += subtotal;
        })
      );

      resolve(Total);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { productAddtocart, calculateTotalPrice };
