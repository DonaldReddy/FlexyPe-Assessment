import "dotenv/config";
import express, { Request, Response } from "express";
import { headerValidator } from "./middlewares/HeaderValidator";
import { generateToken, verifyToken } from "./middlewares/JWT";
import { rateLimit } from "./middlewares/RateLimit";
import dbConnect from "./database/dbConnect";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(headerValidator);
app.use(rateLimit);

app.post("/api/login", (req: Request, res: Response) => {
	const token = generateToken("user");
	console.log("login successful");
	res.header("Authorization", "Bearer " + token);
	res.send("login successful");
});

app.use(verifyToken);

app.post("/api/submit", (req: Request, res: Response) => {
	console.log("submit successful");
	res.send("submit successful");
});

app.get("/api/metrics", (req: Request, res: Response) => {
	console.log("metrics generated successful");
});

async function startServer() {
	try {
		await dbConnect();
		app.listen(PORT, () => {
			console.log(`Server running at ${PORT}`);
		});
	} catch (error) {
		console.error("Internal server error", error);
	}
}

startServer();
