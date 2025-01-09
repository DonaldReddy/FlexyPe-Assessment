import "dotenv/config";
import express, { Request, Response } from "express";
import { headerValidator } from "./middlewares/HeaderValidator";
import { generateToken, verifyToken } from "./middlewares/JWT";
import { rateLimit } from "./middlewares/RateLimit";
import dbConnect from "./database/dbConnect";
import { FailedRequestLogModel } from "./models/FailedRequestLog.schema";

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

app.get("/api/metrics", async (req: Request, res: Response) => {
	try {
		const totalFailedRequests = await FailedRequestLogModel.countDocuments({});
		const failedRequestsByIP = await FailedRequestLogModel.aggregate([
			{ $group: { _id: "$ip", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
		]);
		const failedRequestsByEndpoint = await FailedRequestLogModel.aggregate([
			{ $group: { _id: "$endPoint", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
		]);
		const recentFailedRequests = await FailedRequestLogModel.find({})
			.sort({ createdAt: -1 })
			.limit(10);
		const failedRequestsInPast24Hours = await FailedRequestLogModel.find({
			createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
		});
		console.log("metrics generated successful");
		res.status(200).json({
			totalFailedRequests,
			failedRequestsInPast24Hours: failedRequestsInPast24Hours.length,
			failedRequestsByIP,
			failedRequestsByEndpoint,
			recentFailedRequests,
		});
	} catch (error) {
		console.error("Failed to fetch metrics:", error);
		res.status(500).json({ error: "Internal server error" });
	}
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
