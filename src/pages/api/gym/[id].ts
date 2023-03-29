import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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

  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    try {
      if (session) {
        console.info("API zahtjev za dohvaćanje početnih teretana!");
        const { id } = req.query;

        if (id) {
          const teretane = await prisma.teretana.findMany({
            include: {
              korisnik_teretana: {
                where: {
                  korisnik: {
                    id: id as string,
                  },
                  odobren: true,
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
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje početnih teretana | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje početnih teretana  | Poruka ${error}`,
      });
    }
  } else if (req.method === "POST") {
    try {
      if (session) {
        console.info("API zahtjev za dohvaćanje teretane!");
        const { id } = req.query;
        const { gymId } = req.body;

        if (id) {
          const teretana = await prisma.teretana.findFirst({
            where: {
              id: gymId,
            },
            include: {
              korisnik_teretana: {
                where: {
                  korisnik_id: id as string,
                  teretana_id: gymId,
                },
              },
            },
          });

          return res.status(200).json({ teretane: JSON.stringify(teretana) });
        }
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje teretane | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje teretane  | Poruka ${error}`,
      });
    }
  }
}
