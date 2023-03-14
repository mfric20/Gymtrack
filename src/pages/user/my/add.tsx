import Footer from "@/components/footer/footer";
import axios from "axios";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  SquaresPlusIcon,
  XMarkIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { convertToBase64 } from "@/functinos/functions";
import Image from "next/image";

export default function My() {
  const session = useSession();
  const router = useRouter();

  const [naziv, setNaziv] = useState<string>("");
  const [adresa, setAdresa] = useState<string>("");
  const [gymPicture, setGymPicture] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<boolean>(false);

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
  }, [session.status]);

  const handleOnUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = (await convertToBase64(file)) as string;
    setGymPicture(base64);
  };

  const handleOnSubmit = async () => {
    const id = session.data.user.id;
    if (naziv.length > 0 && adresa.length > 0) {
      await axios
        .post(
          "/api/gym/" + id + "/owner",
          {
            naziv: naziv,
            adresa: adresa,
            slika: gymPicture,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          router.push("./owner");
        })
        .catch((error) => {
          console.log(`Došlo je do pogreške! | Poruka: ${error}`);
        });
    } else setErrorMessage(true);
  };

  return (
    <div className="bg-gradient-to-tr from-slate-700 to-slate-900 min-h-screen flex flex-col justify-between overflow-hidden">
      <div>
        <LoggedInNavigation />
        <div className="mt-20 mb-20 flex flex-col space-y-10 lg:ml-[15%] lg:mr-[15%] ml-5 mr-5 p-5 pb-10 border-2 border-slate-400 rounded-md border-opacity-5 shadow-md bg-slate-100 bg-opacity-5">
          <div className="flex flex-col space-y-5">
            <div className="flex flex-row justify-between items-center mt-5">
              <div className="flex flex-row space-x-4 items-center ml-20 ">
                <SquaresPlusIcon className="w-8 fill-white" />
                <h2 className="text-white font-semibold text-2xl">
                  Dodaj teretanu
                </h2>
              </div>
            </div>
            <hr className="mr-16 ml-16 opacity-20" />
          </div>
          <div className="flex flex-row pl-[8%] pr-[8%] space-x-2">
            {gymPicture == "" ? (
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
                    onChange={(e) => handleOnUpload(e)}
                  />
                </label>
              </div>
            ) : (
              <div className="w-full flex">
                <div className="m-auto">
                  <XCircleIcon
                    className="absolute mt-2 ml-2 w-8 h-8 hover:cursor-pointer z-10 fill-black"
                    onClick={(e) => {
                      setGymPicture("");
                    }}
                  />
                  <Image
                    src={gymPicture}
                    alt="slika profila"
                    width={400}
                    height={350}
                    className="rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}

            <div className="w-full flex flex-col space-y-12">
              <div className="flex flex-col space-y-2">
                <div className="font-semibold text-2xl text-center text-white">
                  Osnovne informacije:
                </div>
                <hr className="mr-16 ml-16 opacity-20" />
              </div>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row space-x-1">
                    <label htmlFor="email" className="text-white ml-10">
                      Naziv:
                    </label>
                    {naziv.length == 0 ? (
                      <pre className="text-red-600">*</pre>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="rounded-md p-1 bg-slate-100 w-[65%] text-black mx-auto"
                    onChange={(e) => setNaziv(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row space-x-1">
                    <label htmlFor="email" className="text-white ml-10">
                      Adresa:
                    </label>
                    {adresa.length == 0 ? (
                      <pre className="text-red-600">*</pre>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="rounded-md p-1 bg-slate-100 w-[65%] text-black mx-auto"
                    onChange={(e) => setAdresa(e.target.value)}
                  />
                </div>
                {errorMessage ? (
                  <div className="mx-auto text-red-500">
                    Naziv i adresa su obavezni!
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center space-x-8">
            <button
              className="bg-red-600 text-white p-2 pr-4 pl-4 rounded-md hover:bg-red-500 h-10 shadow-lg w-32 text-sm font-semibold hover:cursor-pointer"
              onClick={() => router.push(`./owner`)}
            >
              <div className="flex flex-row space-x-4 items-center hover:cursor-pointer">
                <XMarkIcon className="w-5" />
                <label className=" hover:cursor-pointer">Odustani</label>
              </div>
            </button>
            <button
              className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-md hover:bg-green-500 h-10 shadow-lg w-32 text-sm font-semibold hover:cursor-pointer"
              onClick={handleOnSubmit}
            >
              <div className="flex flex-row space-x-4 items-center hover:cursor-pointer">
                <PlusIcon className="w-5" />
                <label className=" hover:cursor-pointer">Dodaj</label>
              </div>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
