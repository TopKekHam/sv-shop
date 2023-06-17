import Express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as url from 'url';
import { v4 as uuidv4 } from 'uuid';

import {userModel} from "./db.js";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = Express();

app.use(Express.static("public"))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());

const tokenMap = new Map();

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

app.listen(3001, () => {
	console.log("[Server] http://localhost:3001");
})