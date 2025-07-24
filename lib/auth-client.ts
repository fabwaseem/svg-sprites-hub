import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import {
  inferAdditionalFields,
  magicLinkClient,
  usernameClient,
  adminClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
    magicLinkClient(),
    adminClient(),
  ],
});
