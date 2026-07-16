import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { Recruiter } from "@/models/Recruiter";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        await connectToDatabase();
        const recruiter = await Recruiter.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!recruiter || !recruiter.password) {
          throw new Error("Incorrect email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, recruiter.password);
        if (!isValid) {
          throw new Error("Incorrect email or password");
        }

        return {
          id: recruiter._id.toString(),
          email: recruiter.email,
          name: recruiter.companyName || "Recruiter",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/recruiter/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
