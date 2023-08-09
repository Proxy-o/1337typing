"use server";
import axios from "axios";

export async function updatePWD(data: String) {
	const mbencrypt = require("mb-encrypt");
	const decodedString = mbencrypt.decrypt(data, "key");
	if (!decodedString) {
		throw new Error("Request body is missing.");
	}
	console.log("decodedString", decodedString);
	try {
		const userData = JSON.parse(decodedString);
		const response = await axios.post(
			"http://localhost:3000/api/users",
			userData
		);
	} catch (error) {
		console.error("Error the encprted data", error);
	}

	// try {
	// 	const response = await fetch("http://localhost:3000/api/users", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: decodedString,
	// 	});
	// 	if (!response.ok) {
	// 		throw new Error("Network response was not ok");
	// 	}
	// 	// You can handle the response if needed
	// 	// const data = await response.json();
	// 	// console.log(data);
	// } catch (error) {
	// 	console.error("Error updating password:", error);
	// }
}
