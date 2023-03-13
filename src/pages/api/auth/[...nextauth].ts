import NextAuth, { Awaitable, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/api/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      type: "credentials",
      credentials: {},
      authorize: async (credentials, req) => {
        try {
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

          if (korisnik != null && passwordMatch)
            return {
              id: korisnik.id,
              ime: korisnik.ime,
              prezime: korisnik.prezime,
              email: korisnik.email,
              slika: korisnik.slika,
              lozinka: korisnik.lozinka,
              aktiviran: korisnik.aktiviran,
              aktivacijski_kod: korisnik.aktivacijski_kod,
            };

          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(prisma),
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
