import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

type Data = {
  error?: string;
  members?: string;
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
        console.info("API zahtjev za dohvaćanje korisnika teretane!");
        const { id } = req.query;

        if (id) {
          const korisnici = await prisma.korisnik.findMany({
            where: {
              korisnik_teretana: {
                every: {
                  teretana_id: id as string,
                  uloga_id: 1,
                  odobren: true,
                },
              },
            },
          });

          return res.status(200).json({ members: JSON.stringify(korisnici) });
        }
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje korisnika teretane | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje korisnika teretani  | Poruka ${error}`,
      });
    }
  }
}
