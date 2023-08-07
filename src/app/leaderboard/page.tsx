import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserCard from "@/components/userCard.compnent";
import { User } from "@/lib/types";
import axios from "axios";

export default async function List() {
	// fetch users with fetch method
	let users: User[] = [];
	try {
		const baseURL = process.env.BASE_URL;

		// Create an Axios instance with the base URL
		const api = axios.create({
			baseURL: baseURL,
		});

		const response = await api.get("/api/users");
		users = response.data;
	} catch (error) {
		// Handle any errors that occurred during the request
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
					{users.map((user: User, index: number) => {
						return <UserCard user={user} rank={index} key={index} />;
					})}
				</CardContent>
			</Card>
		</div>
	);
}
