import { post, get, addRenderer, itemsInCart, div, p, clearCart, redirectRelative } from "./app.js";

let products;

function getProductCost(name) {
	console.log(products);
  return products.filter((p) => p.name === name)[0].cost;
}

function getTotalPrice() {
  return itemsInCart.reduce(
    (val, current) => val + current.count * getProductCost(current.name),
    0
  );
}

function getTotalCount() {
  return itemsInCart.reduce((val, current) => val + current.count, 0);
}


// draw all data / updates DOM
async function productsList() {
  if (!products) {
    products = await get("/data/products", true);
  }

  let elms = itemsInCart.map((item) =>
    div({}, [
      p({}, [`${item.name} ${getProductCost(item.name)}$ x ${item.count}`]),
    ])
  );

  const list = document.getElementById("productsList");

  document.getElementById(
    "totalProducts"
  ).innerHTML = `Total products: ${getTotalCount()}`;
  document.getElementById(
    "totalPrice"
  ).innerHTML = `Total price: ${getTotalPrice()}$`;

  list.innerHTML = "";
  list.append(...elms);
}

// add callback function to call each time data changes
addRenderer(productsList);

// approve button functionality
document.getElementById("approveButton").addEventListener("click", (e) => {
  if (itemsInCart.length > 0) {
    post("/buy", { products: itemsInCart, totalPrice: getTotalPrice() });
		clearCart();
		redirectRelative('/login');
	}
});
