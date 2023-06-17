import { post, redirectRelative, login } from "./app.js";


async function onClickLogin() {
	const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
	
  const res = await login(email, password);
	
  if (!res) alert("Invalid email or password.");
}

document.getElementById("loginButton").addEventListener("click", onClickLogin);