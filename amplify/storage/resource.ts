import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplifygen2files",
  access: (allow) => ({
    "public/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
