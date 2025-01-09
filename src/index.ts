import "dotenv/config";
import express, { Request, Response } from "express";
import { headerValidator } from "./middlewares/headerValidator";
import { generateToken, verifyToken } from "./middlewares/jwt";
import { rateLimit } from "./middlewares/rateLimit";
import dbConnect from "./database/dbConnect";
import { getMetrics } from "./controllers/metrics";

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

app.get("/api/metrics", getMetrics);

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
