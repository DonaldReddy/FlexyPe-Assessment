import { Redis } from "ioredis";

export const redisClient = new Redis(
	process.env.REDIS_URI || "redis://localhost:6379",
	{
		retryStrategy: (times) => {
			return Math.min(times * 50, 2000);
		},
		commandTimeout: 10000,
	},
);
