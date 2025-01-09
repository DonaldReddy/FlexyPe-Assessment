import express, { Request, Response } from "express";
import { HeaderValidator } from "./middlewares/HeaderValidator";
import { generateToken, verifyToken } from "./middlewares/JWT";

const app = express();
const PORT = 3000;

app.use(HeaderValidator);

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

app.get("/api/metrics", (req: Request, res: Response) => {
	console.log("metrics generated successful");
});

app.listen(PORT, () => {
	console.log("server is running on port " + PORT);
});
