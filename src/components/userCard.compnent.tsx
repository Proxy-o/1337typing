import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types";

function UserCard({ user }: { user: User }) {
	return (
		<div className="flex items-center">
			<Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
				<AvatarImage src={user.avatarUrl || ""} alt="Avatar" />
				<AvatarFallback>JL</AvatarFallback>
			</Avatar>
			<div className="ml-4 space-y-1">
				<p className="text-sm font-medium leading-none">{user.login}</p>
			</div>
			<div className="ml-auto font-medium">{user.wpm} WPM </div>
		</div>
	);
}

export default UserCard;
