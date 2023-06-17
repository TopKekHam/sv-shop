import { addRenderer, get, div, p, button, changeItemCountInCart, getItemCountInCart } from "./app.js";

function getSortMode() {
	return document.getElementById("inputSortMode").value;
}

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

async function renderProductsList(sortMode) {

	products.sort(sortFuncs[sortMode]);

	const elms = products.map((product) => div({class:"product"}, [
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

addRenderer(updateProductList);

document.getElementById("inputSortMode").addEventListener("change", () => {
	updateProductList();
})