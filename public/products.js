import { addRenderer, queueRender, get, div, p, button, changeItemCountInCart, getItemCountInCart } from "./app.js";

function getSortMode() {
	return document.getElementById("inputSortMode").value;
}

// sorting function for product list
const sortFuncs = {
	name : (a, b) => {
		const length = Math.min(a.name.length, b.name.length);

		for(let i = 0; i < length; i++) {
			if(a.name[i] !== b.name[i])
			{
				return a.name.charCodeAt(i) - b.name.charCodeAt(i);
 			}
		}
		
		return a.name.length - b.name.length;
	},
	price : (a, b) => b.cost - a.cost
}

let products;

// creates list of all products
async function renderProductsList(sortMode) {

	console.log("a");

	products.sort(sortFuncs[sortMode]);

	const filterVal = document.getElementById("searchInput").value || "";
	const regExp = new RegExp(filterVal, "i")

	// filters products by name -> creates div with data for each product
	const elms = products.filter(p => p.name.match(regExp)).map((product) => div({class:"product"}, [
		p({},[product.name]),
		p({},[`${product.cost}$`]),
		button({
			product: product.name, 
			"on:click" : (e) => { changeItemCountInCart(e.target.getAttribute("product"), 1) }
		}, ["+"]),
		p({},[`${getItemCountInCart(product.name)}`]),
		button({
			disabled: getItemCountInCart(product.name) === 0,
			product: product.name, 
			"on:click" : (e) => { changeItemCountInCart(e.target.getAttribute("product"), -1) }
		}, ["-"]),
	]));

	return elms;
}

// draw all data / updates DOM
async function updateProductList() {

	if(!products) {
		products = await get("/data/products", true);
	}
	
	const list = document.getElementById("productsList");

	list.innerHTML = "";

	const sortMode = getSortMode();

	renderProductsList(sortMode).then(elms => {
		list.append(...elms);
	})
}

// add callback function to call each time data changes
addRenderer(updateProductList);

// sort select functionality
document.getElementById("inputSortMode").addEventListener("change", () => {
	updateProductList();
})

// search input functionality
document.getElementById("searchInput").addEventListener("input", () => {
	queueRender();
})