import { NextFunction, Request, Response } from "express";
import { logFailedRequest } from "../models/FailedRequestLog.schema";
import { addToMailQueue } from "../utils/sendMail";
import { redisClient } from "../redis/redisConnect";

const MAX_REQUESTS = 2; // max requests allowed in the time window, should be 5.
const TIME_WINDOW = 10; // time window in seconds, should be 10min(600s).

export const rateLimit = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const IP = req.ip;
		if (!IP) {
			res.status(400).json({
				message: "Invalid IP",
			});
			return;
		}
		const IPinfo = await redisClient.get(IP);
		if (IPinfo) {
			const current_count = parseInt(IPinfo) + 1;
			const prevTTL = await redisClient.ttl(IP);
			// checking if the time window is not expired for the IP
			if (prevTTL > 0 && prevTTL < TIME_WINDOW) {
				// if the current count is greater than the max requests
				if (current_count > MAX_REQUESTS) {
					// log the failed request into the database
					logFailedRequest(
						req.ip || "unknown ip",
						"Too many requests",
						req.url,
						req.method,
					).catch((err) => console.error("Failed to log failed request:", err));

					addToMailQueue({
						to: "donaldreddy2712@gmail.com",
						subject: "Too many requests",
						html: `<p>unusual activity detected from this IP:- ${IP}</p>
						<p>${new Date().toUTCString()}</p>
						`,
					}).catch((err) => console.error("Failed to queue email:", err));

					res.status(429).json({
						message: "Too many requests, please try again later",
					});
					return;
				}
				// set the new count and set the remaining time window
				await redisClient.set(IP, current_count);
				await redisClient.expire(IP, prevTTL);
			} else {
				// if the time window is expired, reset the count and set the new time window
				await redisClient.set(IP, 1);
				await redisClient.expire(IP, TIME_WINDOW);
			}
		} else {
			// if the IP is not found, set the count and time window
			await redisClient.set(IP, 1);
			await redisClient.expire(IP, TIME_WINDOW);
		}
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Internal server error",
		});
	}
};
