import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers";
import NavBar from "@/components/navbar.component";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "1337 typing game",
	description: "a typing game ? ",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="bg-primary">
				<NextAuthProvider>
					<NavBar />
					{children}
				</NextAuthProvider>
			</body>
		</html>
	);
}
