import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

type Data = {
  error?: string;
  message?: string;
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

  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    try {
      if (session) {
        console.info("API zahtjev za dohvaćanje učlanjenih teretana!");
        const { user } = req.query;

        if (user) {
          const teretane = await prisma.teretana.findMany({
            where: {
              korisnik_teretana: {
                some: {
                  uloga_id: 1,
                  korisnik: {
                    id: user as string,
                  },
                },
              },
            },
          });

          return res.status(200).json({ teretane: JSON.stringify(teretane) });
        }
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje učlanjenih teretana | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje učlanjenih teretana  | Poruka ${error}`,
      });
    }
  }
}
