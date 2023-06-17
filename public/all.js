const showExistsOrders = () =>{
    const div = document.getElementById("existsOrders").value;
    fetch("/existsOrders", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then(data => {console.log(data)}).catch((err)=>{
        console.log(err);
    })

    let arr = data.Orders;
    arr.forEach(element => {
        const h3 = document.createElement("h3");
        h3.innerHTML(element.userEmail);
        const p = document.createElement("p");
        p.innerHTML(element.products);
        const h4 = document.createElement("h4");
        h4.innerHTML("total price:" + element.totalPrice);
        div.append(h3,p,h4);
    });
}

const addNewProduct = () =>{
    const name = document.getElementById("productName").value;
    const cost = document.getElementById("productPrice").value;
    fetch("/addNewProduct", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, cost })
    }).then(res => res.json()).then(data => {console.log(data)}).catch((err)=>{
        console.log(err);
    })

    alert(data.message);
}