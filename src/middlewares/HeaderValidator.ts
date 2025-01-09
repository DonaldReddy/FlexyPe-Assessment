import { NextFunction, Request, Response } from "express";

// Checking if the header name is valid
const isValidHeaderName = (name: string) => /^[a-zA-Z0-9-]+$/.test(name);
// Checking if the header value is valid
const isValidHeaderValue = (value: string) => !/[\x00-\x1F\x7F]/.test(value);

export function HeaderValidator(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { headers } = req;
	const invalidHeaders = Object.keys(headers).filter((header) => {
		const headerValue = headers[header];
		return (
			!isValidHeaderName(header) ||
			(typeof headerValue === "string" && !isValidHeaderValue(headerValue))
		);
	});
	if (invalidHeaders.length > 0) {
		// TODO: log invalid headers to file
		res.status(400).json({
			message: "Invalid headers",
			invalidHeaders,
		});
	} else next();
}
