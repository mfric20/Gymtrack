import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";

type Data = {
  error?: string;
  message?: string;
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

  if (req.method === "POST") {
    try {
      console.info("API zahtjev za aktivaciju korisnika!");
      const { id, aktivacijski_kod } = req.body;

      const korisnik = await prisma.korisnik.findFirst({
        where: {
          id: id,
        },
      });

      if (korisnik?.aktivacijski_kod === parseInt(aktivacijski_kod)) {
        const dbResponse = await prisma.korisnik.update({
          where: {
            id: id,
          },
          data: {
            aktiviran: 1,
          },
        });
        return res.status(200).json({ message: "Korisnik je aktiviran!" });
      } else
        return res.status(406).json({ error: "Pogrešan aktivacijski kod!" });
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za aktivaciju korisnika | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za aktivaciju korisnika | Poruka ${error}`,
      });
    }
  }
}
