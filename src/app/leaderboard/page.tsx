import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserCard from "@/components/userCard.compnent";
import { User } from "@/lib/types";
import axios from "axios";

export default async function List() {
	// fetch users with fetch method
	let users: User[] = [];
	try {
		const baseURL = process.env.BASE_URL;

		// Create a new `fetch` request
		const request = new Request(`${baseURL}/api/users`);

		// Make the request
		const response = await fetch(request, { cache: "no-cache" });

		// Check if the request was successful
		if (response.status === 200) {
			// Parse the response body as JSON
			const data = await response.json();

			// Set the users variable to the data
			users = data;
		} else {
			// Handle the error
			throw new Error(`Request failed with status code ${response.status}`);
		}
	} catch (error) {
		// Handle any errors that occurred during the request
	}
	console.log(users);
	return (
		<div className=" flex p-2 max-w-7xl mx-auto  ">
			<Card className="w-full bg-secondary">
				<CardHeader className="text-center">
					<CardTitle className="text-primary">
						Speedy Typers Leaderboard
					</CardTitle>
				</CardHeader>
				<CardContent>
					{users.map((user: User, index: number) => {
						return <UserCard user={user} rank={index} key={index} />;
					})}
				</CardContent>
			</Card>
		</div>
	);
}
