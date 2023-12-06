const Cart = require("../Model/collections/CartModel");
const Products = require("../Model/collections/ProductModel");

async function productAddtocart(productId, userId) {
  try {
    console.log(productId, userId);
    const cartExist = await Cart.findOne({ User: userId });

    console.log(cartExist);
    if (!cartExist) {
      const newCart = new Cart({
        User: userId,
        Items: [
          {
            Products: productId,
            Quantity: 1,
          },
        ],
        createdAt: Date.now(),
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
          { $push: { Items: { Products: productId, Quantity: 1 } } }
        );
      } else {
        await Cart.updateOne(
          { User: userId, "Items.Products": productId },
          { $inc: { "Items.$.Quantity": 1 } }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function calculateTotalPrice(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      let cartData = await Cart.findOne({ User: userId });
      // console.log(cartData, " data of cart");
      let Total = 0;

      // Use Promise.all to wait for all asynchronous operations to complete
      await Promise.all(cartData.Items.map(async (data) => {
        let productData = await Products.findOne({ _id: data.Products });
        let subtotal = productData.Price * data.Quantity;
        Total += subtotal;
        // log
        // console.log(Total, "  total  ");
      }));

      // console.log(Total, " * total * ");
      resolve(Total);

      
    

    } catch (error) {
      reject(error);
    }
  });
}


module.exports = { productAddtocart, calculateTotalPrice };
