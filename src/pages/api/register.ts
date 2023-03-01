import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { mailOptions, transporter } from "@/services/nodemailer";

type Data = {
  error?: string;
  message?: string;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      console.info("API zahtjev za registraciju novog korisnika!");
      const { ime, prezime, email, lozinka } = req.body;

      const hash = await bcrypt.hash(lozinka, 12);
      const activationCode = Math.floor(Math.random() * 999999) + 100000;

      const dbResponse = await prisma.korisnik.create({
        data: {
          ime: ime,
          prezime: prezime,
          email: email,
          lozinka: hash,
          aktivacijski_kod: activationCode,
          aktiviran: 0,
        },
      });

      await transporter.sendMail({
        ...mailOptions,
        to: email,
        subject: "Aktivacijski kod",
        text: "This is test string",
        html: `<h1>Aktivacijski kod </h2> <p>Vaš aktivacijski kod je: ${activationCode} </p>`,
      });

      res.status(100).json({ message: "Kreiran je novi korisnik!" });
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za registraciju novog korisnika | Poruka ${error}`
      );
      res.status(400).json({
        error:
          "`Greška kod API zahtjeva za registraciju novog korisnika | Poruka ${error}`",
      });
    }
  }
}
