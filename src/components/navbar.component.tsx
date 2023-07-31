"use client";
import { cn } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import UserNav from "./usernav.comopnent";
import { Button } from "./ui/button";

function NavBar() {
	const { data } = useSession();

	return (
		<div className="flex p-2 max-w-7xl mx-auto">
			{data ? (
				<>
					<nav className="flex items-center space-x-4 lg:space-x-6 w-full">
						<Link
							href="/examples/dashboard"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							Home
						</Link>
						<Link
							href="/examples/dashboard"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
						>
							Leaderboard
						</Link>
						<Link
							href="/examples/dashboard"
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
						>
							Settings
						</Link>
					</nav>
					<UserNav />
				</>
			) : (
				<div className="w-full flex justify-end">
					<Button onClick={() => signIn()}> Login </Button>
				</div>
			)}
		</div>
	);
}

export default NavBar;
