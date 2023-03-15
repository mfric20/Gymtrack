import { korisnik_teretana, teretana } from "@prisma/client";

export type teretana_korisnik = teretana & {
  korisnik_teretana: Array<
    korisnik_teretana & { korisnik: { id: number; email: string } }
  >;
};

export type teretana_info = teretana & {
  korisnik_teretana: Array<korisnik_teretana>;
};
