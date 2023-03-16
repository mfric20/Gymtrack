import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import { getServerSession } from "next-auth/next";
import { v4 } from "uuid";
import { authOptions } from "../../auth/[...nextauth]";
import { korisnik_teretana } from "@prisma/client";

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
        console.info("API zahtjev za dohvaćanje teretana vlasnika!");
        const { id } = req.query;

        if (id) {
          const teretane = await prisma.teretana.findMany({
            where: {
              korisnik_teretana: {
                some: {
                  uloga_id: 3,
                  korisnik: {
                    id: id as string,
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
        `Greška kod API zahtjeva za dohvaćanje teretana vlasnika | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje teretana vlasnika  | Poruka ${error}`,
      });
    }
  } else if (req.method === "POST") {
    try {
      if (session) {
        console.log("API zahtjev za kreiranje teretane!");
        const { user } = req.query;
        const { naziv, adresa, slika } = req.body;
        const id = v4();

        const teretana = await prisma.teretana.create({
          data: {
            id: id,
            naziv: naziv,
            adresa: adresa,
            slika: slika,
          },
        });

        const kor_ter = await prisma.korisnik_teretana.create({
          data: {
            korisnik_id: user as string,
            teretana_id: id,
            uloga_id: 3,
          },
        });

        return res.status(200).json({ message: "Uspješno!" });
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za kreiranje teretane | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za kreiranje teretane  | Poruka ${error}`,
      });
    }
  }
}
