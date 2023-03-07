import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, lozinka } = credentials as {
          email: string;
          lozinka: string;
        };

        const korisnik = await prisma.korisnik.findFirst({
          where: {
            email: email,
          },
        });

        if (korisnik == null) return null;
        const passwordMatch = bcrypt.compareSync(lozinka, korisnik.lozinka);

        if (!passwordMatch) return null;

        return korisnik;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
