import { addToMailQueue } from "../utils/sendMail";
import { redisClient } from "../redis/redisConnect";

const MAX_REQUESTS = 2; // max requests allowed in the time window
const TIME_WINDOW = 10; // time window in seconds.

export const validateInvalidRequest = async (ip: string) => {
	try {
		console.log("ip", ip);

		if (!ip) {
			return;
		}

		const IP = "invalid" + ip;
		const IPinfo = await redisClient.get(IP);
		if (IPinfo) {
			console.log("IPinfo", IPinfo);

			const current_count = parseInt(IPinfo) + 1;
			const prevTTL = await redisClient.ttl(IP);
			// checking if the time window is not expired for the IP
			if (prevTTL > 0 && prevTTL < TIME_WINDOW) {
				// if the current count is greater than the max requests
				if (current_count > MAX_REQUESTS) {
					// log the failed request into the database
					addToMailQueue({
						to: "donaldreddy2712@gmail.com",
						subject: "Invalid requests exceeded",
						html: `<p>unusual activity detected from this IP:- ${IP.replace(
							"invalid",
							"",
						)}</p>
                        <p>${new Date().toUTCString()}</p>
                        `,
					});

					return;
				}
				// set the new count and set the remaining time window
				await redisClient.set(IP, current_count);
				await redisClient.expire(IP, prevTTL);
			} else {
				// if the time window is expired, reset the count and set the new time window
				await redisClient.set(IP, 1);
				await redisClient.expire(IP, TIME_WINDOW);
			}
		} else {
			// if the IP is not found, set the count and time window
			await redisClient.set(IP, 1);
			await redisClient.expire(IP, TIME_WINDOW);
		}
	} catch (error) {
		console.error(error);
	}
};
