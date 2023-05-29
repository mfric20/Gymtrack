import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

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

  const session = await getServerSession(req, res, authOptions);

  if (req.method === "POST") {
    try {
      if (session) {
        console.info("API zahtjev za kreiranje termina!");
        const { id } = req.query;
        const { startDate, startTime, endTime, maxNumber, createdBy } =
          req.body;

        let startDateString = new Date(startDate).toLocaleDateString();
        let startTimeString = new Date(startTime).toLocaleTimeString();
        let endTimeString = new Date(endTime).toLocaleTimeString();
        const maxNumberInt = parseInt(maxNumber);

        startDateString = startDateString.replaceAll(" ", "");
        startTimeString = startTimeString.substring(
          0,
          startTimeString.length - 3
        );
        endTimeString = endTimeString.substring(0, endTimeString.length - 3);

        const newTerm = await prisma.termin.create({
          data: {
            datum: startDateString,
            pocetak: startTimeString,
            kraj: endTimeString,
            maksimalan_broj: maxNumberInt,
            obrisan: false,
            kreirao: createdBy as string,
            teretana_id: id as string,
          },
        });

        return res.status(200).json({ message: "Termin je dodan!" });
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za kreiranje termina! | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za kreiranje termina!  | Poruka ${error}`,
      });
    }
  } else if (req.method === "DELETE") {
    try {
      if (session) {
        console.info("API zahtjev za brisanje termina!");
        const { termId } = req.body;
        const updatedTerm = await prisma.termin.update({
          where: {
            id: termId,
          },
          data: {
            obrisan: true,
          },
        });
        if (updatedTerm)
          return res.status(200).json({ message: "Termin je obrisan!" });
        else
          return res
            .status(500)
            .json({ error: "Dogodila se greška kod brisanja!" });
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za brisanje termina! | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za brisanje termina!  | Poruka ${error}`,
      });
    }
  }
}
