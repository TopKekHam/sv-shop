import Express from "express";
import bodyParser from "body-parser";
import * as url from 'url';

import {userModel} from "./db.js";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = Express();

app.use(Express.static("public"))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.listen(3001, () => {
	
	console.log("[Server] http://localhost:3001");
})