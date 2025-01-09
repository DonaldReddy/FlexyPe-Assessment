import { NextFunction, Request, Response } from "express";

export function HeaderValidator(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { headers } = req;
	if (!headers.authorization) {
		res.status(401).json({ message: "Unauthorized" });
	}
	next();
}
