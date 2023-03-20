import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  error?: string;
  message?: string;
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
        console.info("API zahtjev za učlanjivanje u teretanu!");
        const { gymId } = req.body;

        const dbResponse = await prisma.korisnik_teretana.create({
          data: {
            korisnik_id: session.user.id,
            teretana_id: gymId,
            uloga_id: 1,
            odobren: false,
          },
        });

        return res.status(200).json({ message: "Uspješno poslan zahtjev!" });
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za učlanjivanje u teretanu | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za učlanjivanje u teretanu | Poruka ${error}`,
      });
    }
  }
}
