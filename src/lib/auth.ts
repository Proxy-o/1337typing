import type { NextAuthOptions } from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";

//make sure to set the environment variables in the .env.local file
let clientId: string;
let clientSecret: string;
if (process.env.FORTY_TWO_UID && process.env.FORTY_TWO_SECRET) {
	clientId = process.env.FORTY_TWO_UID;
	clientSecret = process.env.FORTY_TWO_SECRET;
} else {
	throw new Error("Missing environment variables for 42 OAuth");
}

export const authOptions: NextAuthOptions = {
	providers: [
		FortyTwoProvider({
			clientId,
			clientSecret,
		}),
	],
	secret: process.env.SECRET,
	callbacks: {
		async redirect({ url, baseUrl }) {
			return Promise.resolve("/list");
		},
		async jwt({ token, user, account, profile }) {
			if (user) {
				token.picture = "urrlimg";
			}
			return token;
		},
		async session({ session, token, user }) {
			if (user) {
				session.user!.image = "dfdf";
			}
			return session;
		},
	},
};
