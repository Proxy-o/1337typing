import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function List() {
	const session = await getServerSession(authOptions);
	console.log("pl", session);
	return <h1>List</h1>;
}
