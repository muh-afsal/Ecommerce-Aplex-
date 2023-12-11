



function addToCart(e, productId) {
    e.stopPropagation();

    fetch('/addtocart', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
    })
        .then(response => response.json())
        .then(res => {
            if (res.status) {
                (function() {
                    Toastify({
                      text: "Product Added to Cart",
                      duration: 2000,
                      destination: "https://github.com/apvarun/toastify-js",
                      newWindow: true,
                      close: true,
                      gravity: "bottom", // `top` or `bottom`
                      position: "center", // `left`, `center` or `right`
                      stopOnFocus: true, // Prevents dismissing of toast on hover
                      style: {
                        background: "linear-gradient(to right, #43a047, #96c93d)",
                        // border-radius: 10px;
                        
                      },
                      onClick: function(){} // Callback after click
                    }).showToast();
                  })();
            } else {
                alert("Error");
            }
        })

}


function updatequantity(productId, stock, change) {
    const productPrice = parseInt(document.getElementById(`Price_${productId}`).textContent, 10);

    const newQuantity = parseInt(document.getElementById(`number_${productId}`).value, 10) + change;
    if (newQuantity <= stock && newQuantity >= 1) {

        const Subtotaldisplay = newQuantity * productPrice;

        const subtotalelement = document.getElementById(`Subtotal_${productId}`);
        const cartTotal_subtotalelement = document.getElementById(`cartTotal-Subtotal`);
        subtotalelement.textContent = `${Subtotaldisplay}/-`;

        let currentTotal = document.getElementById("total").textContent;
        if (change == 1) {
            document.getElementById("total").textContent = Number(currentTotal) + Number(productPrice);
            cartTotal_subtotalelement.textContent = Number(currentTotal) + Number(productPrice);
        } else {
            document.getElementById("total").textContent = Number(currentTotal) - Number(productPrice);
            let subTotalcart = Number(currentTotal) - Number(productPrice);
            cartTotal_subtotalelement.textContent = `${subTotalcart}/-`;
        }

        fetch(`/updatequantity/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newQuantity }),
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status) {
                    document.getElementById(`number_${productId}`).value = newQuantity;
                } else {
                    alert('Error updating quantity');
                }
            });
    }
}

function removeProduct(productId,rowId) {
    // alert(userId)
    // const confirmation = confirm("Are you sure you want to remove this product from the cart?");

   
        fetch(`/removeproduct/${productId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(res => {
                if (res.status) {
                    // alert("")
                    //tostify  product removed from cart
                    // alert("Status true")
                    document.getElementById(rowId).style.display = 'none';
                    let currentCount=localStorage.getItem("cartcount")
                    localStorage.setItem("cartcount",currentCount-1)

                    if(localStorage.getItem("cartcount")<=0){
                        window.location.reload()
                    }
                    (function() {
                        Toastify({
                          text: "Product removed From Cart",
                          duration: 2000,
                          newWindow: true,
                          close: true,
                          gravity: "bottom", // `top` or `bottom`
                          position: "center", // `left`, `center` or `right`
                          stopOnFocus: true, // Prevents dismissing of toast on hover
                          style: {
                            background: "linear-gradient(to right, #43a047, #43a097)",
                            
                          },
                          onClick: function(){} // Callback after click
                        }).showToast();
                      })();
                    // Reload the page or update the UI as needed
                    // window.location.reload()


                     
                     const productPrice=parseInt( document.getElementById(`Subtotal_${productId}`).textContent)
                     let totalamount=parseInt(document.getElementById(`total`).textContent)
                     let totalamountelement=document.getElementById(`total`)
                     let totalAmountChange=totalamount-productPrice
                     totalamountelement.textContent=totalAmountChange
                     


                     

                    // calculateTotalPrice(userId)
                    


                } else {
                    // alert('dkkkkkk')
                    (function() {
                        Toastify({
                          text: "Error while removing Product...!",
                          duration: 2000,
                          newWindow: true,
                          close: true,
                          gravity: "bottom", // `top` or `bottom`
                          position: "center", // `left`, `center` or `right`
                          stopOnFocus: true, // Prevents dismissing of toast on hover
                          style: {
                            background: "linear-gradient(to right, #43a047, #96c93d)",
                            
                          },
                          onClick: function(){} // Callback after click
                        }).showToast();
                      })();
                }
            });
    
}


