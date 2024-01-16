const fs = require('fs');
const path = require('path');
const easyinvoice = require('easyinvoice');



module.exports = {
    generateInvoice: async (orderDetails) => {
        try {
            var data = {
                
                "customize": {
                   
                },
    
                "images": {
                  
                    "logo": fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'aplexlogosearch.png'), 'base64'),
                   
    
                },
                "sender": {
                    "company": "Phone Bazaar",
                    "address": "Vellayil",
                    "zip": "673001",
                    "city": "Calicut",
                    "country": "Kerala"
                },
                "client": {
                    "company": orderDetails[0].Address.Name,
                    "address": orderDetails[0].Address.Address,
                    "zip":orderDetails[0].Address.Pincode ,
                    "city": orderDetails[0].Address.City,
                    "state":orderDetails[0].Address.State,
                    "Mob No": orderDetails[0].Address.Mobile
                },
                "information": {
                    "Order ID": orderDetails[0]._id,
                    "date": orderDetails[0].OrderDate,
                    "invoice date": orderDetails[0].OrderDate,
                },
                "products": (orderDetails[0].Items && orderDetails[0].Items.length > 0) ? orderDetails[0].Items.map((product) => ({
                    "quantity": product.quantity,
                    "description": product.productId.name,
                    "price": product.productId.descountedPrice
                })) : [],
                
    
                "bottom-notice": "Thank You For Your Purchase",
                "settings": {
                    "currency": "INR",
                    "tax-notation": "vat",
                    "currency": "INR",
                    "margin-top": 50,
                    "margin-right": 50,
                    "margin-left": 50,
                    "margin-bottom": 25
                },
    
          
        }

            const result = await easyinvoice.createInvoice(data);

            const filePath = path.join(__dirname, '..', 'pdf', `${orderDetails[0]._id}.pdf`);
            await fs.promises.writeFile(filePath, result.pdf, 'base64');

            return filePath;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};