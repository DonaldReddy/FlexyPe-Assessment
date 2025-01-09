import express from "express";
import { HeaderValidator } from "./middlewares/HeaderValidator";

const app = express();
const PORT = 3000;

app.use(HeaderValidator);

app.listen(PORT, () => {
	console.log("server is running on port " + PORT);
});
