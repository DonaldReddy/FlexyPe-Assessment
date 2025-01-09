import { NextFunction, Request, Response } from "express";
import { logFailedRequest } from "../models/failedRequestLog.schema";
import { validateInvalidRequest } from "../monitor/alert";
import headerValidation from "http-headers-validation";

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
				!headerValidation.validateHeaderName(header) ||
				(typeof headerValue === "string" &&
					!headerValidation.validateHeaderValue(headerValue))
			);
		});
		if (invalidHeaders.length > 0) {
			// log the failed request into the database
			logFailedRequest(
				req.ip || "unknown ip",
				"Invalid headers",
				req.url,
				req.method,
			);
			validateInvalidRequest(req.ip || "unknown ip");
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
