import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

type Data = {
  error?: string;
  workers?: string;
  id?: number;
  updated?: string;
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
        console.info("API zahtjev za dohvaćanje djelatnika teretane!");
        const { id, searchSample } = req.query;
        if (id) {
          if (searchSample === "") {
            const korisnici = await prisma.korisnik.findMany({
              where: {
                korisnik_teretana: {
                  some: {
                    teretana_id: id as string,
                    uloga_id: 2,
                    odobren: true,
                  },
                },
              },
            });
            return res.status(200).json({ workers: JSON.stringify(korisnici) });
          } else {
            const korisnici = await prisma.korisnik.findMany({
              where: {
                korisnik_teretana: {
                  some: {
                    teretana_id: id as string,
                    uloga_id: 2,
                    odobren: true,
                  },
                },
                OR: [
                  {
                    ime: {
                      contains: searchSample as string,
                    },
                  },
                  {
                    prezime: {
                      contains: searchSample as string,
                    },
                  },
                ],
              },
            });
            return res.status(200).json({ workers: JSON.stringify(korisnici) });
          }
        }
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje djelatnika teretane | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje djelatnika teretani  | Poruka ${error}`,
      });
    }
  } else if (req.method === "DELETE") {
    try {
      if (session) {
        console.info("API zahtjev za brisanje djelatnika teretane!");
        const { id } = req.query;
        const { userId } = req.body;

        if (id) {
          const dbResponse = await prisma.korisnik_teretana.update({
            where: {
              korisnik_id_teretana_id: {
                teretana_id: id as string,
                korisnik_id: userId as string,
              },
            },
            data: {
              zahtjevDjelatnika: false,
              uloga_id: 1,
            },
          });

          return res.status(200).json({ updated: JSON.stringify(dbResponse) });
        }
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za brisanje korisnika iz teretane! | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za brisanje korisnika iz teretane!  | Poruka ${error}`,
      });
    }
  }
}
