
export async function post(path, json){
	return fetch(path, {
		method : "POST",
		headers : {"Content-Type" : "application/json"},
		body: JSON.stringify(json)
	}).then(data => data.json());
}

export function redirectRelative(path) {
	window.location.href = path;
}

export function setAuthToken(token) {
	document.cookie = `token=${token}`;
}

export async function login(email, password) {
	try {

		let res = await post("/login", {email, password})
		
		if(res.valide) {
			setAuthToken(res.token);
			redirectRelative("/products");
			
			return true;
		} else {
			return false;
		}

	} catch(err) {
		alert("ERROR!!!!");
		return false;
	}
}

export function logout() {
	setAuthToken("");
	redirectRelative("/")
}