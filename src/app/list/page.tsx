import { User } from "@/components/user.component";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function List() {
	const session = await getServerSession(authOptions);
	return (
		<h1>
			<User />
		</h1>
	);
}