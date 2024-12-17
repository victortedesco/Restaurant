window.removeProduct = function removeProduct(productId) {
  let products = localStorage.getItem("cart") ?? {};
  products = JSON.parse(products);
  
  delete products[productId];

  localStorage.setItem("cart", JSON.stringify(products));
  window.location.reload();
};

window.performCheckout = function performCheckout() {
  window.alert("Your order has been confirmed!")
  localStorage.clear();
  window.location.reload();
}

function loadProducts() {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      const cart = JSON.parse(localStorage.getItem("cart"));
      let total = 0;
      data.products
        .filter((x) => x.id in cart)
        .forEach((product) => {
          const productFinalPrice =
            product.price * (1 - product.discount / 100);
          const productFinalPriceWithQuantity =
            productFinalPrice * cart[product.id];
          total += productFinalPriceWithQuantity;
          const productPriceFormatted =
            product.discount != 0
              ? `${productFinalPrice.toFixed(2)} (${product.discount}% OFF)`
              : `${product.price}`;
          const productHTML = `
          <div class="product-item">
            <div class="product-info">
              <img class="product-image" src="${product.imageUrl}" alt="${product.name} Image"/>
              <div class="product-details">
                  <p><b>Name:</b> ${product.name}</p>
                  <p><b>Price:</b> $ ${productPriceFormatted}</p>
                  <p><b>Quantity:</b> ${cart[product.id]}</p>
                  <p><b>Total:</b> $ ${productFinalPriceWithQuantity.toFixed(2)}</p>
              </div>
            </div>
              <button id="delete-from-cart" onclick="removeProduct(${product.id})">🗑️</button>
          </div>`;
          document.getElementById("product-list").innerHTML += productHTML;
        });
      document.getElementById("cart-details").innerHTML += `
        <p>Total: $ ${total.toFixed(2)}</p>
        <button id="checkout" onclick="performCheckout()">Checkout!</button>
      `;
      if (Object.keys(cart).length === 0) {
        document.getElementById("product-list").innerHTML += `
            <p style="font-size: x-large; font-weight: bold; text-align:center;">Your cart is empty!</p>
        `
        document.getElementById("checkout").disabled = true;
      }
    });
}

document.addEventListener("DOMContentLoaded", () => loadProducts());
