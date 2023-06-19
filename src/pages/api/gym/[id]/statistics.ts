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
  stats?: string;
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
        console.info("API zahtjev za dohvaćanje statistike teretane!");
        const { id } = req.query;

        const stats = await prisma.termin.findMany({
          where: {
            teretana_id: id as string,
            obrisan: false,
          },
          select: {
            korisnik_termin: true,
            korisnik: {
              select: {
                ime: true,
                prezime: true,
              },
            },
            kreirao: true,
          },
        });

        const groupedData = Object.values(
          stats.reduce((result, item) => {
            const key = item.kreirao;
            if (!result[key]) {
              result[key] = [];
            }
            result[key].push(item);
            return result;
          }, {})
        );

        let data = [];

        groupedData.map((item: any) => {
          item.map((term: any) => {
            data.push({
              name: term.korisnik.ime + " " + term.korisnik.prezime,
              broj: term.korisnik_termin.length,
            });
          });
        });

        const countByNames = Object.entries(
          data.reduce((result, { name, broj }) => {
            if (!result[name]) {
              result[name] = 0;
            }
            result[name] += broj;
            return result;
          }, {})
        ).map(([name, broj]) => ({ name, broj }));

        return res.status(200).json({ stats: JSON.stringify(countByNames) });
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje statistike teretane | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje statistike teretane  | Poruka ${error}`,
      });
    }
  }
}
