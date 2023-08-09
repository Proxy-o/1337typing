'use server'
import { User } from "@/lib/types";
import axios from "axios";

export async function updatePWD(userData: User) {
	try {
		const response = await fetch("http://localhost:3000/api/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		// You can handle the response if needed
		// const data = await response.json();
		// console.log(data);
	} catch (error) {
		console.error("Error updating password:", error);
	}
}
