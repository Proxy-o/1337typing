import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserCard from "@/components/userCard.compnent";
import { User } from "@/lib/types";

export default async function List() {
	// fetch users with fetch method
	let users: User[] = [];
	try {
		const baseURL = process.env.BASE_URL;

		// Create a new `fetch` request
		const request = new Request(`${baseURL}/api/users`);

		// Make the request
		const response = await fetch(request, {
			next: {
				revalidate: 0,
			},
		});

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
		console.error(error);
	}
	return (
		<div className=" flex p-2 max-w-7xl mx-auto  ">
			<Card className="w-full bg-secondary">
				<CardHeader className="text-center">
					<CardTitle className="text-primary">
						Speedy Typers Leaderboard
					</CardTitle>
				</CardHeader>
				<CardContent>
					{/* sort the cards with wpm + acc / 2 */}
					{users
						.sort((a, b) => {
							const aScore = ((a.wpm || 1) + (a.accuracy || 1)) / 2;
							const bScore = ((b.wpm || 1) + (b.accuracy || 1)) / 2;
							return bScore - aScore;
						})
						.map((user, index) => (
							<UserCard key={user.id} user={user} rank={index} />
						))}
				</CardContent>
			</Card>
		</div>
	);
}
