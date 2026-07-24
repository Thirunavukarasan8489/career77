import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
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
        const emailLower = credentials.email.toLowerCase().trim();

        // 1. Try finding in User model
        const user = await User.findOne({ email: emailLower });
        if (user && user.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            let name = user.email.split("@")[0];
            if (user.role === "recruiter") {
              const recruiterDoc = await Recruiter.findOne({ userId: user._id });
              if (recruiterDoc) {
                name = recruiterDoc.companyName || "Recruiter";
              }
            } else if (user.role === "candidate") {
              const { Candidate } = await import("@/models/Candidate");
              const candidateDoc = await Candidate.findOne({ userId: user._id });
              if (candidateDoc && candidateDoc.name) {
                name = candidateDoc.name;
              }
            }
            return {
              id: user._id.toString(),
              email: user.email,
              name,
              role: user.role,
            };
          }
        }

        // 2. Fallback check & auto-migration for Recruiter model legacy entries
        const recruiter = await Recruiter.findOne({ email: emailLower });
        if (recruiter && recruiter.password) {
          const isValid = await bcrypt.compare(credentials.password, recruiter.password);
          if (isValid) {
            const newUser = await User.create({
              email: recruiter.email,
              password: recruiter.password,
              role: "recruiter",
            });
            recruiter.userId = newUser._id;
            await recruiter.save();

            return {
              id: newUser._id.toString(),
              email: newUser.email,
              name: recruiter.companyName || "Recruiter",
              role: "recruiter",
            };
          }
        }

        throw new Error("Incorrect email or password");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = (user as any).role || "candidate";
      }
      if (token.role === "recruiter" && token.id) {
        try {
          await connectToDatabase();
          const recDoc = await Recruiter.findOne({ userId: token.id }).populate("companyId");
          if (recDoc && recDoc.companyId) {
            token.companyVerified = (recDoc.companyId as any).verified || false;
          } else {
            token.companyVerified = false;
          }
        } catch {
          token.companyVerified = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).companyVerified = token.companyVerified || false;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
