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
        const { currentDate, id } = req.query;

        const currentDateObject = new Date(currentDate as string);
        const currentDateString = currentDateObject
          .toLocaleDateString()
          .replaceAll(" ", "");

        const terms = await prisma.termin.findMany({
          where: {
            datum: currentDateString,
            teretana_id: id as string,
            obrisan: false,
          },
          include: {
            korisnik: true,
            _count: {
              select: {
                korisnik_termin: true,
              },
            },
            korisnik_termin: {
              where: {
                korisnik_id: session.user.id,
              },
            },
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
        console.info("API zahtjev za prijavu na termin!");
        const { termId } = req.body.data;

        const maxNumber = await prisma.termin.findFirst({
          select: {
            maksimalan_broj: true,
          },
          where: {
            id: termId,
          },
        });

        const currentNumber = await prisma.korisnik_termin.count({
          where: {
            termin_id: termId,
          },
        });

        if (maxNumber.maksimalan_broj <= currentNumber)
          return res.status(200).json({ message: "Termin je pun!" });

        const newApplication = await prisma.korisnik_termin.create({
          data: {
            korisnik_id: session.user.id,
            termin_id: parseInt(termId as string),
          },
        });

        if (newApplication)
          return res.status(200).json({ message: "Uspješna prijava!" });
        else return res.status(500).json({ error: "Dogodila se greška!" });
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za prijavu na termin! | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za prijavu na termin!  | Poruka ${error}`,
      });
    }
  } else if (req.method === "DELETE") {
    try {
      if (session) {
        console.info("API zahtjev za brisanje prijave na termin!");
        const { termId } = req.body;

        const deletedTerm = await prisma.korisnik_termin.delete({
          where: {
            korisnik_id_termin_id: {
              korisnik_id: session.user?.id,
              termin_id: parseInt(termId as string),
            },
          },
        });

        if (deletedTerm)
          return res.status(200).json({ message: "Uspješno obrisano!" });
        else return res.status(500).json({ error: "Dogodila se greška!" });
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
