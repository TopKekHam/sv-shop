
function CreateItem(item) {
	const elm = document.createElement("div");

	elm.innerHTML = `<p> ${item.name} </P>`

	return elm;
}

document.getElementById("items").append(CreateItem({name: "new item"}))
