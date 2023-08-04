import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users to retrieve all users
export async function GET(request: NextRequest) {
	console.log("GET /api/users");
	const users = await prisma.user.findMany({
		select: {
			id: true,
			login: true,
			profileUrl: true,
			avatarUrl: true,
			score: true,
		},
	});
	return NextResponse.json(users);
}

// POST /api/users to create a new user
export async function POST(request: NextRequest) {
	let user;
	try {
		const requestBody = await request.json();

		if (!requestBody) {
			throw new Error("Request body is missing.");
		}
		// Input validation - check for required fields
		if (
			!requestBody.login ||
			!requestBody.profileUrl ||
			!requestBody.avatarUrl ||
			!requestBody.score
		) {
			throw new Error(
				"All fields (login, profileUrl, avatar_url, score) are required."
			);
		}
		// Data sanitization (optional) - sanitize the input data if needed

		user = await prisma.user.upsert({
			where: {
				login: requestBody.login,
			},
			update: {
				score: requestBody.score,
			},
			create: {
				id: requestBody.id,
				login: requestBody.login,
				profileUrl: requestBody.profileUrl,
				avatarUrl: requestBody.avatarUrl,
				score: parseInt(requestBody.score),
			},
		});
	} catch (error) {
		console.log(error);
		return NextResponse.error();
	}

	return NextResponse.json(user);
}