import bodyParser from "body-parser";
import express from "express";
import * as url from 'url';
import * as mongoose from "mongoose";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

const connectionString = "mongodb+srv://rizdaniel15:K2JIfjSPyds01q2s@newcluster.ccz9vd8.mongodb.net/test"
const connectionString2 = "mongodb+srv://rizdaniel15:K2JIfjSPyds01q2s@newcluster.ccz9vd8.mongodb.net/test2"

let connection;
let connection2;

try {
	// Connection to database
	connection  = await mongoose.createConnection(connectionString);
	connection2 = await mongoose.createConnection(connectionString2);
} catch(err) {
	// Reporting error and exiting node
	console.log(err);
	process.exit(0);
}

const studentScheme = mongoose.Schema({
	id: String,
	name: String,
	age: Number,
});

const studentModel  = connection.model("students", studentScheme);
const studentModel2 = connection2.model("Students", studentScheme);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static("public"));

// SIGN UP

app.get("/signup", (req, res) => {
	res.sendFile(__dirname + "/public/signup.html");
})

app.post("/signup", async (req, res) => {
	const temp = {
		id: req.body.id,
		name: req.body.name,
		age : req.body.age
	};

	const addStudentToDb = async student => {
		return await studentModel.insertMany(student);
	}

	try {
		const insertedStudent = await addStudentToDb(temp);
	} catch (err) {
		console.log(err);
	}

	res.redirect("/signup");
});

// SIGN IN

app.get("/signin", (req, res) => {
	res.sendFile(__dirname + "/public/signin.html");
})

app.post("/signin", async (req, res) => {

	const findStudent = async (id, name) => {
		// Tell mongodb not to get the '_id' and '__v' fields -----------
		//                                                              v
		const res = await studentModel.findOne({ id, name }, {_id: false, __v: false});
		return res;
	}

	const student = await findStudent(req.body.id, req.body.name);
	console.log(student);

	if(!student) {
		res.redirect("signin");
		return;
	}

	res.send(`Hello ${student.name}!`);
});

// UPDATE AGE

app.get("/updateAge", (req, res) => {
	res.sendFile(__dirname + "/public/updateAge.html");
})

app.post("/updateAge", async (req, res) => {

	const updateAge = async (name, age) => {
		const res = await studentModel.findOneAndUpdate({ name }, {$set: {age}}, {projection: {_id: false, __v: false}});
		return res;
	}

	const query = await updateAge(req.body.name, req.body.newAge);
	console.log(query);

	if(!query) {
		res.send(`Didn't find student with name ${req.body.name}`);
		return;
	}

	res.send(`Age update to ${req.body.newAge}`);
});

app.listen(3000, () => {
	console.log("[express] Running, http://localhost:3000");
});

