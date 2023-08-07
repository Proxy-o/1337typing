import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types";
import Link from "next/link";

function UserCard({ user, rank }: { user: User; rank: number }) {
	return (
		<Link
			href={`https://profile.intra.42.fr/users/${user.login}`}
			className="flex items-center hover:scale-[1.01] p-2 m-2 rounded-md bg-primary text-secondary"
		>
			<div className=" mr-2 pr-2 text-base border-r">{rank + 1}</div>
			<Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
				<AvatarImage src={user.avatarUrl || ""} alt="Avatar" />
				<AvatarFallback>JL</AvatarFallback>
			</Avatar>
			<div className="ml-4 space-y-1">
				<p className="text-sm font-medium leading-none">{user.login}</p>
			</div>
			<div className="ml-auto font-medium">{user.accuracy} % Accuracy </div>
			<div className="ml-auto font-medium">{user.wpm} WPM </div>
		</Link>
	);
}

export default UserCard;
