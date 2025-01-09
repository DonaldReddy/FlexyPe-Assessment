import { NextFunction, Request, Response } from "express";
import { logFailedRequest } from "../models/failedRequestLog.schema";

// Checking if the header name is valid
const isValidHeaderName = (name: string) => /^[a-zA-Z0-9-]+$/.test(name);
// Checking if the header value is valid
const isValidHeaderValue = (value: string) => !/[\x00-\x1F\x7F]/.test(value);

export function headerValidator(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { headers } = req;
		const invalidHeaders = Object.keys(headers).filter((header) => {
			const headerValue = headers[header];
			return (
				!isValidHeaderName(header) ||
				(typeof headerValue === "string" && !isValidHeaderValue(headerValue))
			);
		});
		if (invalidHeaders.length > 0) {
			// log the failed request into the database
			logFailedRequest(
				req.ip || "unknown ip",
				"Invalid headers",
				req.url,
				req.method,
			).catch((err) => console.error("Failed to log failed request:", err));
			res.status(400).json({
				message: "Invalid headers",
				invalidHeaders,
			});
		} else next();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Internal server error",
		});
	}
}
