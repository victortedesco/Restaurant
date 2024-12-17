import { routes } from "../../../router.js";

function getProduct(id) {
  if (!id) {
    window.location.href = routes["/"];
    return;
  }

  return fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      return data.products.find((x) => x.id == id);
    });
}

window.addToCart = function addToCart(productId) {
  const quantityInput = document.getElementById("quantity");
  let currentValue = parseInt(quantityInput.value, 10);

  let products = {};

  if (localStorage.getItem("cart")) {
    products = JSON.parse(localStorage.getItem("cart"));
  }

  products[productId] = currentValue;

  localStorage.setItem("cart", JSON.stringify(products));

  window.alert("The product was added to the cart!");
};

window.setQuantity = function setQuantity(amount) {
  const quantityInput = document.getElementById("quantity");
  let currentValue = parseInt(quantityInput.value, 10);

  currentValue += amount;

  if (currentValue < 1) {
    currentValue = 1;
  } else if (currentValue > 99) {
    currentValue = 99;
  }

  quantityInput.value = currentValue;
};

function loadProductDetails(product) {
  if (!product) {
    document.getElementById("product-info").innerHTML = "Product not found!";
    return;
  }

  const productFinalPrice = product.price * (1 - product.discount / 100);
  const productPriceFormatted =
    product.discount != 0
      ? `${productFinalPrice.toFixed(2)} (${product.discount}% OFF)`
      : `${product.price}`;

  document.getElementById("product-info").innerHTML = `
      <div class="product-details">
        <p>${product.name}</p>
        <img class="product-image" src="${product.imageUrl}" alt="${product.name} Image"/>
        <p><b>Price:</b> $ ${productPriceFormatted}</p>
      </div>
      <form class="product-input" onsubmit="event.preventDefault(); addToCart(${product.id});">
        <div class="quantity-input">
          <button class="quantity-button" type="button" onclick="setQuantity(-1)">-</button><br>
          <input type="number" id="quantity" min="1" max="99" value="1" name="quantity">
          <button class="quantity-button" type="button" onclick="setQuantity(1)">+</button><br>
        </div>
        <input type="submit" id="add-to-cart" value="Add to Cart">
      </form>
  `;

  if (!product.isAvailable) {
    document.getElementById("add-to-cart").disabled = true;
  }

  const quantityInput = document.getElementById("quantity");
  quantityInput.addEventListener("input", () => {
    let value = parseInt(quantityInput.value, 10);

    if (isNaN(value) || value < 1) {
      quantityInput.value = 1;
    } else if (value > 99) {
      quantityInput.value = 99;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));

  getProduct(productId).then((product) => {
    loadProductDetails(product);
  });
});
