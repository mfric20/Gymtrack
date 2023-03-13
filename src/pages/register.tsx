import { Shantell_Sans } from "next/font/google";
import { ArrowLongLeftIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";

const shantell_sans = Shantell_Sans({ subsets: ["latin"] });

export default function Registration() {
  const router = useRouter();

  const [ime, setIme] = useState<string>("");
  const [prezime, setPrezime] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [lozinka, setLozinka] = useState<string>("");
  const [pLozinka, setPLozinka] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [lozinkaError, setLozinkaError] = useState<boolean>(false);
  const [pLozinkaError, setPLozinkaError] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);

  const provijeriMail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
  );

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
          "/api/auth/register",
          {
            ime: ime,
            prezime: prezime,
            email: email,
            lozinka: lozinka,
            slika: profilePicture,
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

  const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleOnDrop = async (e: any) => {
    const file = e.target.files[0];
    const base64 = (await convertToBase64(file)) as string;
    setProfilePicture(base64);
  };

  return (
    <div className="flex bg-gradient-to-tr from-slate-700 to-slate-900 min-h-screen items-center justify-center">
      <div className="shadow-lg p-10 rounded-lg flex flex-col space-y-4 mt-10 mb-10 w-1/4 bg-slate-100 bg-opacity-5">
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
          <div className="flex flex-col space-y-4 mr-8 ml-8">
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
                className="rounded-md p-1 bg-slate-100 text-black"
                onChange={(e) => setIme(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row space-x-1">
                <label htmlFor="prezime" className="text-white">
                  Prezime:
                </label>
                {prezime.length == 0 ? (
                  <pre className="text-red-600">*</pre>
                ) : (
                  ""
                )}
              </div>
              <input
                type="text"
                name="prezime"
                id="prezime"
                className="rounded-md p-1 bg-slate-100 text-black"
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
                className="rounded-md p-1 bg-slate-100 text-black"
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
                {lozinka.length == 0 ? (
                  <pre className="text-red-600">*</pre>
                ) : (
                  ""
                )}
              </div>
              <input
                type="password"
                name="lozinka"
                id="lozinka"
                className="rounded-md p-1 bg-slate-100 text-black"
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
                className="rounded-md p-1 bg-slate-100 text-black"
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
          </div>

          {profilePicture != "" ? (
            <div className="pt-4 flex flex-col space-y-2">
              <label htmlFor="plozinka" className="text-white">
                Slika:
              </label>
              <div>
                <XCircleIcon
                  className="absolute mt-2 ml-2 w-8 h-8 hover:cursor-pointer"
                  onClick={() => setProfilePicture("")}
                />
                <Image
                  src={profilePicture}
                  alt="Slika profila"
                  width={400}
                  height={400}
                  className="rounded-lg w-full h-96"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row space-x-1">
                <label htmlFor="plozinka" className="text-white">
                  Slika:
                </label>
              </div>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Pritisni za upload</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleOnDrop(e)}
                  />
                </label>
              </div>
            </div>
          )}

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
