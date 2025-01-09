import { Request, Response } from "express";
import { FailedRequestLogModel } from "../models/failedRequestLog.schema";

export async function getMetrics(req: Request, res: Response) {
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
}
