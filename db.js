
import * as mongoose from "mongoose";

const connectionString = "mongodb+srv://rizdaniel15:K2JIfjSPyds01q2s@newcluster.ccz9vd8.mongodb.net/sv-shop"

let connection;

try {
	// Connection to database
	connection  = await mongoose.createConnection(connectionString);
	console.log("[DB] Connected");
} catch(err) {
	// Reporting error and exiting node
	console.log(err);
	process.exit(0);
}

const userScheme = mongoose.Schema({
	name: String,
	email: String,
	password: String,
})

const productScheme = mongoose.Schema({
	name: String,
	cost: Number
});

const orderScheme = mongoose.Schema({
	userEmail: String,
	products: Array,
	totalPrice: Number
});

export const userModel  = connection.model("Users", userScheme);
export const productModel  = connection.model("Products", productScheme);
export const orderModel  = connection.model("Orders", orderScheme);