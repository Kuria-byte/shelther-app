import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"  // Updated import path

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
