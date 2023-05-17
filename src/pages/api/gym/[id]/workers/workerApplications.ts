import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import NextCors from "nextjs-cors";

type Data = {
  error?: string;
  updated?: string;
  workerApplicationMembers?: string;
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
        console.info(
          "API zahtjev za dohvaćanje prijava za djelatnika teretane!"
        );
        const { id } = req.query;

        if (id) {
          const korisnici = await prisma.korisnik.findMany({
            where: {
              korisnik_teretana: {
                some: {
                  teretana_id: id as string,
                  uloga_id: 1,
                  zahtjevDjelatnika: true,
                },
              },
            },
          });

          console.log(typeof korisnici);
          return res
            .status(200)
            .json({ workerApplicationMembers: JSON.stringify(korisnici) });
        }
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje prijava za djelatnika teretane | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje prijava za djelatnika teretane  | Poruka ${error}`,
      });
    }
  } else if (req.method === "PUT") {
    try {
      if (session) {
        console.info(
          "API zahtjev za prihvaćanje prijave za djelatnika teretane!"
        );
        const { id } = req.query;
        const { userId } = req.body;
        console.log(req.body);

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
              uloga_id: 2,
            },
          });

          return res.status(200).json({ updated: JSON.stringify(dbResponse) });
        }
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za prihvaćanje prijave za djelatnika teretane | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za prihvaćanje prijave za djelatnika teretane  | Poruka ${error}`,
      });
    }
  } else if (req.method === "DELETE") {
    try {
      if (session) {
        console.info("API zahtjev za brisanje prijave za djelatnika teretane!");
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
            },
          });

          return res.status(200).json({ updated: JSON.stringify(dbResponse) });
        }
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za brisanje prijave za djelatnika teretane | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za brisanje prijave za djelatnika teretane  | Poruka ${error}`,
      });
    }
  }
}
