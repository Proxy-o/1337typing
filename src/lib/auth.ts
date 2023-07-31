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
		// async redirect({ url, baseUrl }) {
		// 	return Promise.resolve("/");
		// },

		async jwt({ token, user, account, profile }) {
			if (profile) {
				token.id = profile.id;
				token.login = profile.login;
				token.img = profile.image.link;
				token.url = profile.url;
				token.campus = profile.campus[0].name;
			}
			return token;
		},
		async session({ session, token, user }) {
			session.user!.id = token.id as string;
			session.user!.login = token.login as string;
			session.user!.image = token.img as string;
			session.user!.url = token.url as string;
			session.user!.campus = token.campus as string;
			return session;
		},
	},
};
