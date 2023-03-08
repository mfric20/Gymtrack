import bcrypt from "bcrypt";
import NextCors from "nextjs-cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/api/client";
import { mailOptions, transporter } from "@/services/nodemailer";
import { v4 } from "uuid";

type Data = {
  error?: string;
  message?: string;
  id?: string;
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

  if (req.method === "POST") {
    try {
      console.info("API zahtjev za registraciju novog korisnika!");
      const { ime, prezime, email, lozinka, slika } = req.body;

      const id = v4();
      const hash = await bcrypt.hash(lozinka, 12);
      const activationCode = Math.floor(Math.random() * 900000) + 100000;

      const dbResponse = await prisma.korisnik.create({
        data: {
          id: id,
          ime: ime,
          prezime: prezime,
          email: email,
          slika: slika,
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
        html: `<h1>Aktivacijski kod </h2> <p style="font-size:18px;font-weight:normal">Hvala Vam na registraciji, kako bi nastavili sa prijavom Vaš aktivacijski kod je: ${activationCode}. </p>`,
      });

      return res
        .status(200)
        .json({ message: "Kreiran je novi korisnik!", id: id });
    } catch (error) {
      console.error(
        `Greška kod API zahtjeva za registraciju novog korisnika | Poruka ${error}`
      );
      return res.status(400).json({
        error: `Greška kod API zahtjeva za registraciju novog korisnika | Poruka ${error}`,
      });
    }
  }
}
