import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import NextCors from "nextjs-cors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

type Data = {
  error?: string;
  teretana?: string;
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
        console.info("API zahtjev za dohvaćanje informacija o teretani!");
        const { id } = req.query;

        if (id) {
          const teretana = await prisma.teretana.findFirst({
            where: {
              id: id as string,
            },
            include: {
              korisnik_teretana: {
                where: {
                  teretana_id: id as string,
                  korisnik_id: session.user.id,
                },
              },
            },
          });

          return res.status(200).json({ teretana: JSON.stringify(teretana) });
        }
      } else {
        return res.status(401).json({ error: "Nema sesije!" });
      }
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za dohvaćanje informacija o teretani | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za dohvaćanje informacija o teretani  | Poruka ${error}`,
      });
    }
  }
}
