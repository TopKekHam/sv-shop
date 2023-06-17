// fetch functions, makes code smaller

const chache = new Map();

function getChacheData(path, method) {
  return chache.get(method + ":" + path);
}

function setChacheData(path, method, data) {
  chache.set(method + ":" + path, data);
}

export async function post(path, json, chached) {
  let data;

  if (chached) {
    data = getChacheData(path);
    if (data) return data;
  }

  data = await fetch(path, {
    method: "POST",
		redirect: 'follow',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  });

  if (data.headers.get("Content-Type").match("application/json"))
    data = await data.json();

  setChacheData(path, "POST", data);

  return data;
}

export async function get(path, chached) {
  let data;

  if (chached) {
    data = getChacheData(path);
    if (data) return data;
  }

  data = await fetch(path, {
    method: "GET",
		redirect: 'follow'
  });

  if (data.headers.get("Content-Type").match("application/json"))
    data = await data.json();

  setChacheData(path, "GET", data);

  return data;
}

export function redirectRelative(path) {
  window.location.href = path;
}

// Auth functions

export function setAuthToken(token) {
  document.cookie = `token=${token}`;
}

export async function login(email, password) {
  try {
    let res = await post("/login", { email, password });

    if (res.valide) {
      const lastLogin = localStorage.getItem("lastLogin");

      if (lastLogin !== email) {
        clearCart();
      }

      localStorage.setItem("lastLogin", email);

      setAuthToken(res.token);
      redirectRelative("/products");

      return true;
    } else {
      return false;
    }
  } catch (err) {
    alert("ERROR!!!!");
    return false;
  }
}

export function logout() {
  setAuthToken("");
  redirectRelative("/");
}

// renderer functions, makes redrawing / updating DOM easier when data changes. 

const renderers = [];
let needToRenderer = false;

export function addRenderer(renderer) {
  renderers.push(renderer);
}

export function queueRender() {
  if (needToRenderer === false) {
    window.requestAnimationFrame(() => {
      doRender();
    });
  }

  needToRenderer = true;
}

queueRender();

function doRender() {
  needToRenderer = false;

  for (const renderer of renderers) {
    renderer();
  }
}

// Cart functions

export let itemsInCart = [];

// loading cart from localStorage
{
  const json = localStorage.getItem("cart");
  if (json) {
    itemsInCart = JSON.parse(json);
  }
}

export function clearCart() {
  itemsInCart = [];
  localStorage.setItem("cart", "[]");
}

// update item count
// param count is relative to current count.
export function changeItemCountInCart(name, count) {
  queueRender();

  for (let i = 0; i < itemsInCart.length; i++) {
    if (itemsInCart[i].name === name) {
      itemsInCart[i].count += count;

			let newCount = itemsInCart[i].count;
			
			if(itemsInCart[i].count === 0) {
				itemsInCart.splice(i, 1);
			}
      
			localStorage.setItem("cart", JSON.stringify(itemsInCart));
			return newCount;
    }
  }

  itemsInCart.push({ name, count });
  localStorage.setItem("cart", JSON.stringify(itemsInCart));
  return count;
}

// get item count by name
export function getItemCountInCart(name) {
  for (let i = 0; i < itemsInCart.length; i++) {
    if (itemsInCart[i].name === name) {
      return itemsInCart[i].count;
    }
  }

  return 0;
}

// functions for DOM element creation, makes code shorter.

export function element(tag, attributes, children) {
  const elm = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((attr) => {
      if (attr.startsWith("on:")) {
        elm.addEventListener(attr.substring(3), attributes[attr]);
      } else {
        if (attr === "disabled") {
          if (attributes[attr]) {
            elm.setAttribute(attr, attributes[attr]);
          }
        } else {
          elm.setAttribute(attr, attributes[attr]);
        }
      }
    });
  }

  if (children) {
    elm.append(...children);
  }

  return elm;
}

export function div(attributes, children) {
  return element("div", attributes, children);
}

export function button(attributes, children) {
  return element("button", attributes, children);
}

export function input(attributes, children) {
  return element("input", attributes, children);
}

export function p(attributes, children) {
  return element("p", attributes, children);
}

export function a(attributes, children) {
  return element("a", attributes, children);
}

export function h1(attributes, children) {
  return element("h1", attributes, children);
}

export function h2(attributes, children) {
  return element("h2", attributes, children);
}

export function h3(attributes, children) {
  return element("h3", attributes, children);
}

export function h4(attributes, children) {
  return element("h4", attributes, children);
}

export function h5(attributes, children) {
  return element("h5", attributes, children);
}

