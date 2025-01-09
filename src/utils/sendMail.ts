import nodemailer from "nodemailer";
import { redisClient } from "../redis/redisConnect";

// Configure the mail transporter
const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

// Add email to the Redis queue
export async function addToMailQueue(email: {
	to: string;
	subject: string;
	html: string;
}) {
	try {
		await redisClient.lpush("mailQueue", JSON.stringify(email));
	} catch (error) {
		console.error("Error adding email to queue:", error);
	}
}

// Send email using nodemailer
async function sendMail(to: string, subject: string, html: string) {
	try {
		await transporter.sendMail({
			to,
			subject,
			html,
		});
		console.log(`Email sent to ${to}`);
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}

// Process the email queue
async function processMailQueue() {
	while (true) {
		try {
			const email = await redisClient.rpop("mailQueue");
			if (email) {
				const { to, subject, html } = JSON.parse(email);

				try {
					await sendMail(to, subject, html);
				} catch (error) {
					await redisClient.lpush("mailQueue", email);
					console.error("Requeued email due to error:", error);
				}
			} else {
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
		} catch (error) {
			console.error("Error processing mail queue:", error);
		}
	}
}

processMailQueue();
