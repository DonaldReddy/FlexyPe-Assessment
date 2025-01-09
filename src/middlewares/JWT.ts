import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "asdsa7sdgh7s8d77q373897237dfbn3f84894f4f";
// Generate token
export const generateToken = (data: string) => {
	return jwt.sign({ data }, SECRET_KEY, {
		expiresIn: "10h",
	});
};

// Verify token
export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res.status(401).json({
				message: "Token not provided or invalid format",
			});
			return;
		}

		const token = authHeader.split(" ")[1]; // Extract token
		jwt.verify(token, SECRET_KEY); // Verify the token
		next();
	} catch (error) {
		// TODO:log error to file

		res.status(401).json({
			message: "Invalid token",
		});
	}
};
