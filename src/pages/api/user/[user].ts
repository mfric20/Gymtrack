import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";

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

  if (req.method === "GET") {
    try {
      console.info("API zahtjev za dohvaćanje korisnickih podataka!");
      const { user } = req.query;

      if (user) {
        const korisnik = await prisma.korisnik.findFirst({
          where: {
            email: user as string,
          },
          select: {
            id: true,
            email: true,
            ime: true,
            prezime: true,
          },
        });

        return res.status(200).json({ podaci: JSON.stringify(korisnik) });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje korisnickih podataka | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje korisnickih podataka  | Poruka ${error}`,
      });
    }
  }
}
