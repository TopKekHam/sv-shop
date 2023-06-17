const signUp = () => {
    const name = document.getElementById("name").value;
    const age = document.getElementById("email").value;
    const id = document.getElementById("password").value;
    fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    }).then(res => res.json()).then(data => {console.log(data)}).catch((err)=>{
        console.log(err);
    })
}