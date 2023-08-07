"use client";
import { cn } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import UserNav from "./usernav.comopnent";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function NavBar() {
	const router = useRouter();
	const { data } = useSession();
	const [activeLink, setActiveLink] = useState("");

	// Function to set the active link based on the current route
	const handleSetActiveLink = (href: string) => {
		setActiveLink(href);
	};

	return (
		<div className="bg-primary">
			<div className="flex p-2 max-w-7xl mx-auto">
				{data ? (
					<>
						<nav className="flex items-center space-x-4 lg:space-x-6 w-full">
							<Link
								href="/"
								className={`text-sm font-medium transition-colors ${
									activeLink === "/"
										? "text-secondary"
										: "text-muted-foreground"
								} hover:text-secondary`}
								onClick={() => handleSetActiveLink("/")}
							>
								Home
							</Link>
							<Link
								href="/leaderboard"
								className={`text-sm font-medium transition-colors ${
									activeLink === "/leaderboard"
										? "text-secondary"
										: "text-muted-foreground"
								} hover:text-secondary`}
								onClick={() => handleSetActiveLink("/leaderboard")}
							>
								Leaderboard
							</Link>
						</nav>
						<UserNav />
					</>
				) : (
					<div className="w-full flex justify-end">
						<Button onClick={() => signIn()}>Login</Button>
					</div>
				)}
			</div>
		</div>
	);
}

export default NavBar;
