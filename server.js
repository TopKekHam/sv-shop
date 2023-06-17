import Express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as url from 'url';
import { v4 as uuidv4 } from 'uuid';

import {orderModel, userModel} from "./db.js";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = Express();

app.use(Express.static("public"))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());

const tokenMap = new Map();

function adminMiddle(req,res,next){
    if(req.query.admin == 'true'){
        next()
    }else{
        res.send("error")
    }
}

function authMiddleware(req, res, next) {
	const {token} = req.cookies;
	
	if(!token)
	{
		res.redirect("/login");
		return;
	}

	const authData = tokenMap.get(token);
	
	if(!authData) {
		res.redirect("/login");
		return;
	}

	req.auth = authData;
	next();
}

function generateAndAddAuthToken(email) {
	const token = uuidv4();
	tokenMap.set(token, {token, email});
	return token;
}

app.get("/login", (req, res) => {
	if(req.auth) res.redirect("/products");

	res.sendFile(__dirname + "/public/login.html");
})

app.post("/login", async (req, res) => {
	const {email, password} = req.body;

	const dbRes = await userModel.findOne({email, password});
	
	if(dbRes) {
		const token = generateAndAddAuthToken(email);
		res.send({valide: true, token})
	} else {
		res.send({valide: false})
	}
})

app.get("/", authMiddleware, (req, res) => {
	res.redirect("/products");
})

app.get("/products", authMiddleware, (req, res) => {
	res.sendFile(__dirname + "/public/products.html");
})

app.get("/all", adminMiddle, (req, res) => {
	res.sendFile(__dirname + "/public/all.html");
})

app.get("/signup", (req, res) => {
	res.sendFile(__dirname + "/public/signup.html");
})

app.post("/addNewProduct",(req,res)=>{
	let temp = {
		name: req.body.name,
		cost: req.body.cost
	}

    const addProductToDB = async(product) =>{
        await userModel.insertMany(product);
    }
    addProductToDB(temp);
	res.send({message:`The product ${temp.name} is now available on the website`});
})

app.get("/existsOrders", (req,res)=>{
	orderModel.find((err,Orders)=>{
		if(err) throw err;
		else res.send(Orders);
	})
})

app.post("/signup",(req,res)=>{
	let temp = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	}

    const addUserToDB = async(user) =>{
        await userModel.insertMany(user);
    }
    addUserToDB(temp);
	res.redirect("/signin");
})

app.listen(3001, () => {
	console.log("[Server] http://localhost:3001");
})