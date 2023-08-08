import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users to retrieve all users
export async function GET(request: NextRequest) {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			login: true,
			profileUrl: true,
			avatarUrl: true,
			wpm: true,
			accuracy: true,
		},
		orderBy: {
			wpm: "desc",
		},
	});
	return NextResponse.json(users);
}

// POST /api/users to create a new user
export async function POST(request: NextRequest) {
	const token = await getToken({ req: request, secret: process.env.SECRET });

	if (!token) {
		return NextResponse.json({ error: "flag:{good job}" });
	}
	let user;

	const requestBody = await request.json();

	if (!requestBody) {
		throw new Error("Request body is missing.");
	}
	// Input validation - check for required fields
	if (
		!requestBody.login ||
		!requestBody.profileUrl ||
		!requestBody.avatarUrl ||
		!requestBody.wpm ||
		!requestBody.accuracy
	) {
		throw new Error(
			"A required field is missing. Required fields: login, profileUrl, avatarUrl, wpm, accuracy"
		);
	}
	// Data sanitization (optional) - sanitize the input data if needed

	const session = await getServerSession(authOptions);
	const existingUser = await prisma.user.findUnique({
		where: {
			login: requestBody.login,
		},
	});
	const shouldUpdateUser =
		existingUser &&
		((existingUser.wpm && existingUser.wpm <= parseInt(requestBody.wpm)) ||
			(existingUser.accuracy &&
				existingUser.accuracy <= parseInt(requestBody.accuracy)));

	if (
		shouldUpdateUser === true &&
		session &&
		requestBody.login === session.user!.name
	) {
		// Update the existing user with the new wpm and accuracy
		user = await prisma.user.update({
			where: {
				login: requestBody.login,
			},
			data: {
				wpm: parseInt(requestBody.wpm),
				accuracy: parseInt(requestBody.accuracy),
			},
		});
	} else if (
		!existingUser &&
		session &&
		requestBody.login === session.user!.name
	) {
		// Create a new user since the user does not exist
		user = await prisma.user.create({
			data: {
				// id: requestBody.id,
				login: requestBody.login,
				profileUrl: requestBody.profileUrl,
				avatarUrl: requestBody.avatarUrl,
				wpm: parseInt(requestBody.wpm),
				accuracy: parseInt(requestBody.accuracy),
			},
		});
	}

	return NextResponse.json({ user });
}
