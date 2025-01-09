import mongoose from "mongoose";

export default async function dbConnect() {
	console.log("connecting to FlexyPe DB");
	await mongoose.connect(
		process.env.DB_URI || "mongodb://localhost:27017/flexype",
	);
	console.log("connected to FlexyPe DB");
}
