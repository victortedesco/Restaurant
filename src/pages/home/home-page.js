import { routes } from "../../../router.js";

document.addEventListener("DOMContentLoaded", () => loadProducts());

function loadProducts() {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      data.products.forEach((product) => {
        const productFinalPrice = product.price * (1 - product.discount / 100);
        const productPriceFormatted =
          product.discount != 0
            ? `${productFinalPrice.toFixed(2)} (${product.discount}% OFF)`
            : `${product.price}`;
        const productHTML = product.isAvailable
          ? `<div style="cursor: pointer" onclick="goToProductPage(${product.id})" class="product-item">
                <img class="product-image" src="${product.imageUrl}" alt="${product.name} Image"/>
                <div class="product-details">
                    <p><b>Name:</b> ${product.name}</p>
                    <p><b>Price:</b> $ ${productPriceFormatted}</p>
                </div>
            </div>`
          : `<div class="product-item">
                <img class="product-image" src="${product.imageUrl}"/>
                <div class="product-details">
                    <p><b>Name:</b> ${product.name}</p>
                    <p><b>This product is unavailable at the time...</b></p>
                </div>
            </div>`;
        document.getElementById("product-list").innerHTML += productHTML;
      });
    });
}

window.goToProductPage = function (productId) {
  window.location.href = `${routes["/product"]}?id=${productId}`;
};
