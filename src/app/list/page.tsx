import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import UserCard from "@/components/userCard.compnent";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/types";
import axios from "axios";
import { getServerSession } from "next-auth";

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
		console.error("Error fetching users:", error);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
			<Card className="col-span-3">
				<CardHeader>
					<CardTitle>Recent Sales</CardTitle>
					<CardDescription>You made 265 sales this month.</CardDescription>
				</CardHeader>
				<CardContent>
					{users.map((user: User, index: number) => {
						return <UserCard user={user} key={index} />;
					})}
				</CardContent>
			</Card>
		</div>
	);
}
