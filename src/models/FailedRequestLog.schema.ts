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
		method: {
			type: String,
			default: "GET",
		},
	},
	{
		timestamps: true,
	},
);
LogSchema.index({ ip: 1, endPoint: 1 });
export const FailedRequestLogModel = model("Failed_Request_Log", LogSchema);

export async function logFailedRequest(
	ip: string,
	message: string,
	endPoint: string,
	method: string,
) {
	const log = new FailedRequestLogModel({ ip, message, endPoint, method });
	log.save();
}
