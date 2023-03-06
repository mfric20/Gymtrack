import { Shantell_Sans } from "next/font/google";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession, signIn, getProviders } from "next-auth/react";
import axios from "axios";

const shantell_sans = Shantell_Sans({ subsets: ["latin"] });

export default function Registration() {
  const router = useRouter();
  const [ime, setIme] = useState<string>("");
  const [prezime, setPrezime] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [lozinka, setLozinka] = useState<string>("");
  const [pLozinka, setPLozinka] = useState<string>("");

  const [emailError, setEmailError] = useState<boolean>(false);
  const [lozinkaError, setLozinkaError] = useState<boolean>(false);
  const [pLozinkaError, setPLozinkaError] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);

  const provijeriMail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
  );

  const loginUser = async () => {
    const res = await signIn("credentials", {
      ime: ime,
      prezime: prezime,
      email: email,
      lozinka: lozinka,
      redirect: false,
      callbackUrl: `${window.location.origin}`,
    });

    if (res?.error) {
      console.log(res?.error);
    } else router.push("/dashboard");
  };

  const handleOnSubmit = async () => {
    if (!provijeriMail.test(email)) setEmailError(true);
    else setEmailError(false);

    if (lozinka.length < 6) setLozinkaError(true);
    else setLozinkaError(false);

    if (pLozinka != lozinka) setPLozinkaError(true);
    else setPLozinkaError(false);

    if (
      provijeriMail.test(email) &&
      lozinka.length >= 6 &&
      pLozinka == lozinka &&
      ime.length > 0 &&
      prezime.length > 0
    ) {
      await axios
        .post(
          "/api/register",
          {
            ime: ime,
            prezime: prezime,
            email: email,
            lozinka: lozinka,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const data: { message?: string; error?: string; id?: number } =
            res.data;
          router.push("/activation/" + data.id);
        })
        .catch((error) => {
          console.log(`Došlo je do pogreške! | Poruka: ${error}`);
          setEmailExists(true);
        });
    }
  };

  return (
    <div className="flex bg-gradient-to-tr from-slate-700 to-slate-900 h-screen items-center justify-center">
      <div className="shadow-lg p-10 rounded-lg flex flex-col space-y-4 bg-slate-100 bg-opacity-5">
        <div>
          <ArrowLongLeftIcon
            className="h-8 fill-white al hover:cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>
        <h1 className="font-bold text-white text-4xl text-center">
          <label className={shantell_sans.className}>GYMTRACK</label>
        </h1>
        <h2 className="font-bol text-white text-xl text-center pt-6">
          Registracija
        </h2>
        <hr />
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row space-x-1">
              <label htmlFor="ime" className="text-white">
                Ime:
              </label>
              {ime.length == 0 ? <pre className="text-red-600">*</pre> : ""}
            </div>
            <input
              type="text"
              name="ime"
              id="ime"
              className="rounded-md p-1 bg-slate-100 w-72"
              onChange={(e) => setIme(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row space-x-1">
              <label htmlFor="prezime" className="text-white">
                Prezime:
              </label>
              {prezime.length == 0 ? <pre className="text-red-600">*</pre> : ""}
            </div>
            <input
              type="text"
              name="prezime"
              id="prezime"
              className="rounded-md p-1 bg-slate-100"
              onChange={(e) => setPrezime(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row space-x-1">
              <label htmlFor="email" className="text-white">
                Email:
              </label>
              {email.length == 0 ? <pre className="text-red-600">*</pre> : ""}
            </div>
            <input
              type="text"
              name="email"
              id="email"
              className="rounded-md p-1 bg-slate-100"
              onChange={(e) => setEmail(e.target.value)}
            />
            {!emailError ? (
              ""
            ) : (
              <div className="text-red-600 text-sm">
                Email adresa nije važeća!
              </div>
            )}
            {!emailExists ? (
              ""
            ) : (
              <div className="text-red-600 text-sm">
                Već postoji korisnik sa ovom email adresom!
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row space-x-1">
              <label htmlFor="lozinka" className="text-white">
                Lozinka:
              </label>
              {lozinka.length == 0 ? <pre className="text-red-600">*</pre> : ""}
            </div>
            <input
              type="password"
              name="lozinka"
              id="lozinka"
              className="rounded-md p-1 bg-slate-100"
              onChange={(e) => setLozinka(e.target.value)}
            />
            {!lozinkaError ? (
              ""
            ) : (
              <div className="text-red-600 text-sm">
                Lozinka mora sadržavati barem 6 znakova!
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row space-x-1">
              <label htmlFor="plozinka" className="text-white">
                Potvrdi lozinku:
              </label>
              {pLozinka.length == 0 ? (
                <pre className="text-red-600">*</pre>
              ) : (
                ""
              )}
            </div>
            <input
              type="password"
              name="plozinka"
              id="plozinka"
              className="rounded-md p-1 bg-slate-100"
              onChange={(e) => setPLozinka(e.target.value)}
            />
            {!pLozinkaError ? (
              ""
            ) : (
              <div className="text-red-600 text-sm">
                Lozinka se ne podudara!
              </div>
            )}
          </div>
          <div>
            <p className="text-white text-sm mt-10 text-center">
              Već imate profil?{" "}
              <label
                className="underline hover:cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Prijava
              </label>
            </p>
          </div>
          <div>
            <button
              className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-lg hover:bg-green-500 h-10 w-full shadow-lg"
              onClick={handleOnSubmit}
            >
              Registracija
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
