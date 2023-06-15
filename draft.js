
let loggedInUsers = {};

function isUserLoggedIn(req, res, next) {
    let token = req.headers["Auth"];

    if(!token) 
    {
        res.status(401);
        return;
    }

    let user = loggedInUsers[token];

    if(!user) {
        res.status(401);
        return; 
    }

    req.authUser = user;
    next();
}

app.post("/login", (req , res) => {
    // check
    const token = "asdjhfakhfka";

    loggedInUsers["asdjhfakhfka"] = "dani";

    res.send({token});
})

app.get("/products", isUserLoggedIn, (req, res) => {

    req.authUser;

    usersModel.finOne({name: req.authUser});
});