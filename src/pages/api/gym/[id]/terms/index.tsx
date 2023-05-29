import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

type Data = {
  error?: string;
  terms?: string;
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
        console.info("API zahtjev za dohvacanje svih termina!");
        const { currentDate, createdBy, id } = req.query;

        const currentDateObject = new Date(currentDate as string);
        const currentDateString = currentDateObject
          .toLocaleDateString()
          .replaceAll(" ", "");

        const terms = await prisma.termin.findMany({
          where: {
            datum: currentDateString,
            kreirao: createdBy as string,
            teretana_id: id as string,
            obrisan: false,
          },
        });

        return res.status(200).json({ terms: JSON.stringify(terms) });
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvacanje svih termina! | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvacanje svih termina!  | Poruka ${error}`,
      });
    }
  }
}
