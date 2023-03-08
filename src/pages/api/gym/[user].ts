import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";

type Data = {
  error?: string;
  teretane?: string;
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
      console.info("API zahtjev za dohvaćanje teretana!");
      const { user } = req.query;

      if (user) {
        const teretane = await prisma.teretana.findMany({
          include: {
            korisnik_teretana: {
              where: {
                korisnik: {
                  email: user as string,
                },
              },
              include: {
                korisnik: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            },
          },
        });

        return res.status(200).json({ teretane: JSON.stringify(teretane) });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje teretana | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje teretana  | Poruka ${error}`,
      });
    }
  }
}
