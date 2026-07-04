import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "admin" | "warga";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "admin" | "warga";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "warga";
  }
}
