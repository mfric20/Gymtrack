import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

type Data = {
  error?: string;
  message?: string;
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
  } else if (req.method === "POST") {
    try {
      if (session) {
        console.info("API zahtjev za izmjenu podataka o terminu!");
        const { startDate, startTime, endTime, maxNumber, termId } = req.body;

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

        const changedTerm = await prisma.termin.update({
          where: {
            id: parseInt(termId as string),
          },
          data: {
            datum: startDateString,
            pocetak: startTimeString,
            kraj: endTimeString,
            maksimalan_broj: maxNumberInt,
          },
        });
        if (changedTerm)
          return res.status(200).json({ message: "Izmjena uspješna!" });
        else
          return res.status(500).json({ error: "Greška kod izmjene termina!" });
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za izmjenu podataka o terminu! | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za izmjenu podataka o terminu!  | Poruka ${error}`,
      });
    }
  } else if (req.method === "DELETE") {
    try {
      if (session) {
        console.info("API zahtjev za brisanje prijave na termin!");
        console.log(req.body);
        const { termId, userId } = req.body;

        const deletedApplication = await prisma.korisnik_termin.delete({
          where: {
            korisnik_id_termin_id: {
              korisnik_id: userId as string,
              termin_id: parseInt(termId as string),
            },
          },
        });
        if (deletedApplication)
          return res.status(200).json({ message: "Brisanje uspješno!" });
        else
          return res
            .status(500)
            .json({ error: "Greška kod brisanje prijave na termin!" });
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za brisanje prijave na termin! | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za brisanje prijave na termin!  | Poruka ${error}`,
      });
    }
  }
}
