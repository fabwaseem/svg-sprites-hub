import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins/username";
import { magicLink } from "better-auth/plugins/magic-link";
import { admin } from "better-auth/plugins/admin";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    username(),
    admin(),
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        console.log("Sending magic link to", email, token, url);
      },
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
});
