import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { logFailedRequest } from "../models/FailedRequestLog.schema";

const SECRET_KEY = process.env.SECRET_KEY || "secret";
// Generate token
export const generateToken = (data: string) => {
	try {
		return jwt.sign({ data }, SECRET_KEY, {
			expiresIn: "10h",
		});
	} catch (error) {
		console.log(error);
	}
};

// Verify token
export const verifyToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			// log the failed request into the database
			await logFailedRequest(req.ip || "unknown ip", "Invalid token", req.url);
			res.status(401).json({
				message: "Token not provided or invalid format",
			});
			return;
		}
		const token = authHeader.split(" ")[1];
		jwt.verify(token, SECRET_KEY);
		next();
	} catch (error) {
		// log the failed request into the database
		await logFailedRequest(req.ip || "unknown ip", "Invalid token", req.url);

		res.status(401).json({
			message: "Invalid token",
		});
	}
};
