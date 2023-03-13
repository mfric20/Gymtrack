import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  error?: string;
  podaci?: string;
  id?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    try {
      if (session) {
        console.info("API zahtjev za dohvaćanje korisnickih podataka!");
        const { user } = req.query;

        if (user) {
          const korisnik = await prisma.korisnik.findFirst({
            where: {
              id: user as string,
            },
            select: {
              id: true,
              email: true,
              ime: true,
              prezime: true,
              slika: true,
            },
          });

          return res.status(200).json({ podaci: JSON.stringify(korisnik) });
        }
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje korisnickih podataka | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje korisnickih podataka  | Poruka ${error}`,
      });
    }
  } else if (req.method === "PUT") {
    try {
      if (session) {
        console.info("API zahtjev za ažuriranje korisnickih podataka!");
        const {
          id,
          novoIme,
          novoPrezime,
          trenutnaLozinka,
          novaLozinka,
          slika,
        } = req.body;

        const korisnik = await prisma.korisnik.findFirst({
          where: {
            id: id as string,
          },
        });

        const passwordMatch = bcrypt.compareSync(
          trenutnaLozinka,
          korisnik.lozinka
        );

        if (passwordMatch) {
          const hash = await bcrypt.hash(novaLozinka, 12);

          const updatedKorisnik = await prisma.korisnik.update({
            where: {
              id: id as string,
            },
            data: {
              ime: novoIme,
              prezime: novoPrezime,
              lozinka: hash,
              slika: slika,
            },
          });

          return res.status(200).json({ podaci: "Uspješno" });
        }

        return res.status(401).json({
          error: `Netočna trenutna lozinka!`,
        });
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      return res.status(400).json({
        error: `Greška kod API zahtjeva za ažuriranje korisnickih podataka  | Poruka ${error}`,
      });
    }
  }
}
