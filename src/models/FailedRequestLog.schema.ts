import { Schema, model } from "mongoose";

const LogSchema = new Schema(
	{
		ip: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		endPoint: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export const FailedRequestLogModel = model("Failed_Request_Log", LogSchema);

export async function logFailedRequest(
	ip: string,
	message: string,
	endPoint: string,
) {
	const log = new FailedRequestLogModel({ ip, message, endPoint });
	log.save();
}
