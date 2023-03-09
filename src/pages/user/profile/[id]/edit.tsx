import Footer from "@/components/footer/footer";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import axios from "axios";
import Image from "next/image";
import default_profil_pic from "@/assets/default_profile_pic.jpg";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  UserIcon,
  CheckIcon,
  XMarkIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { korisnik } from "@prisma/client";

export default function EditProfile() {
  const session = useSession();
  const router = useRouter();
  const id = router.query.id;

  const [novoIme, setNovoIme] = useState<string>("");
  const [novoPrezime, setNovoPrezime] = useState<string>("");
  const [trenutnaLozinka, setTrenutnaLozinka] = useState<string>("");
  const [novaLozinka, setNovaLozinka] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [pictureValue, setPictureValue] = useState<string>("");

  const [trenutnaLozinkaError, setTrenutnaLozinkaError] =
    useState<boolean>(false);
  const [novaLozinkaError, setNovaLozinkaError] = useState<boolean>(false);

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    if (session.status === "authenticated") loadUserInfo();
  }, [session.status]);

  const loadUserInfo = async () => {
    await axios
      .get("/api/user/" + session.data?.user?.id)
      .then((res) => {
        const podaci = JSON.parse(res.data.podaci) as korisnik;
        setNovoIme(podaci.ime);
        setNovoPrezime(podaci.prezime);
        setProfilePicture(podaci.slika);
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
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
    setPictureValue(e.target.value);
    const base64 = (await convertToBase64(file)) as string;
    setProfilePicture(base64);
  };

  const handleOnSubmit = async (e: any) => {
    if (novaLozinka.length < 6) setNovaLozinkaError(true);

    if (
      novoIme.length > 0 &&
      novoPrezime.length > 0 &&
      trenutnaLozinka.length > 0 &&
      novaLozinka.length >= 6
    ) {
      console.log({
        id,
        novoIme,
        novoPrezime,
        trenutnaLozinka,
        novaLozinka,
        slika: profilePicture,
      });

      await axios
        .put(
          `/api/user/${id}`,
          {
            id,
            novoIme,
            novoPrezime,
            trenutnaLozinka,
            novaLozinka,
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
          router.push(`/user/profile/${id}`);
        })
        .catch((error) => {
          console.log(`Došlo je do pogreške! | Poruka: ${error.response}`);
          if (error.response.status == 401) setTrenutnaLozinkaError(true);
        });
    }
  };

  return (
    <div className="bg-gradient-to-tr from-slate-700 to-slate-900 min-h-screen overflow-hidden flex flex-col justify-between">
      <div>
        <LoggedInNavigation />
        <div className="mt-20 mb-20 flex flex-col space-y-10 lg:ml-80 lg:mr-80 ml-5 mr-5 p-5 border-2 border-slate-400 rounded-md border-opacity-5 shadow-md">
          <div className="flex flex-col space-y-5">
            <div className="flex flex-row justify-between items-center mt-5">
              <div className="flex flex-row space-x-4 items-center ml-20 ">
                <UserIcon className="w-10 fill-white" />
                <h2 className="text-white font-semibold text-3xl">
                  Uredi profil
                </h2>
              </div>
            </div>
            <hr className="mr-16 ml-16 opacity-20" />
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row pt-10 pb-10 pl-24 pr-24 space-x-4">
              <div className="w-full flex flex-col space-y-8">
                <div className="flex mx-auto">
                  <XCircleIcon
                    className="absolute mt-2 ml-2 w-8 h-8 hover:cursor-pointer"
                    onClick={(e) => {
                      setProfilePicture("");
                      setPictureValue("");
                    }}
                  />
                  {profilePicture == "" ? (
                    <Image
                      src={default_profil_pic}
                      alt="slika profila"
                      width={350}
                      height={350}
                      className="rounded-lg mx-auto shadow-sm"
                    />
                  ) : (
                    <Image
                      src={profilePicture}
                      alt="slika profila"
                      width={350}
                      height={350}
                      className="rounded-lg mx-auto shadow-sm"
                    />
                  )}
                </div>
                <input
                  className="block w-96 mx-auto text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  value={pictureValue}
                  onChange={(e) => handleOnDrop(e)}
                />
              </div>
              <div className="flex flex-col text-white space-y-6 w-full justify-center border-2 border-slate-400 border-opacity-10 rounded-lg shadow-md p-4">
                <div className="flex flex-col space-y-2">
                  <div className="font-semibold text-2xl text-center">
                    Korisnički podaci:
                  </div>
                  <hr className="mr-16 ml-16 opacity-20" />
                </div>
                <div className="w-full flex flex-col space-y-2 pl-10 ">
                  <div className="flex flex-row space-x-1">
                    <p className="font-semibold text-lg">Ime:</p>
                    {novoIme.length == 0 ? (
                      <pre className="text-red-600">*</pre>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    type="text"
                    name="ime"
                    id="ime"
                    className="rounded-md p-1 bg-slate-100 mr-24 ml-4 text-black"
                    defaultValue={novoIme}
                    onChange={(e) => setNovoIme(e.target.value)}
                  />
                </div>
                <div className="w-full flex flex-col space-y-2 pl-10 ">
                  <div className="flex flex-row space-x-1">
                    <p className="font-semibold text-lg">Prezime:</p>
                    {novoPrezime.length == 0 ? (
                      <pre className="text-red-600">*</pre>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    type="text"
                    name="prezime"
                    id="prezime"
                    className="rounded-md p-1 bg-slate-100 mr-24 ml-4 text-black"
                    defaultValue={novoPrezime}
                    onChange={(e) => setNovoPrezime(e.target.value)}
                  />
                </div>
                <div className="w-full flex flex-col space-y-2 pl-10 ">
                  <div className="flex flex-row space-x-1">
                    <p className="font-semibold text-lg">Trenutna lozinka:</p>
                    {trenutnaLozinka.length == 0 ? (
                      <pre className="text-red-600">*</pre>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    type="password"
                    name="lozinka"
                    id="lozinka"
                    className="rounded-md p-1 bg-slate-100 mr-24 ml-4 text-black"
                    value={trenutnaLozinka}
                    onChange={(e) => setTrenutnaLozinka(e.target.value)}
                  />
                  {!setTrenutnaLozinkaError ? (
                    ""
                  ) : (
                    <div className="text-red-600 text-sm">
                      Netočna trenutna lozinka!
                    </div>
                  )}
                </div>
                <div className="w-full flex flex-col space-y-2 pl-10 mb-6">
                  <div className="flex flex-row space-x-1">
                    <p className="font-semibold text-lg">Nova lozinka:</p>
                    {novaLozinka.length == 0 ? (
                      <pre className="text-red-600">*</pre>
                    ) : (
                      ""
                    )}
                  </div>
                  <input
                    type="password"
                    name="plozinka"
                    id="plozinka"
                    className="rounded-md p-1 bg-slate-100 mr-24 ml-4 text-black"
                    value={novaLozinka}
                    onChange={(e) => setNovaLozinka(e.target.value)}
                  />
                  {!novaLozinkaError ? (
                    ""
                  ) : (
                    <div className="text-red-600 text-sm">
                      Lozinka mora sadržavati barem 6 znakova!
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center space-x-8">
              <button
                className="bg-red-600 text-white p-2 pr-4 pl-4 rounded-md hover:bg-red-500 h-10 shadow-lg w-32 text-sm font-semibold"
                onClick={() => router.push(`/user/profile/${id}`)}
              >
                <div className="flex flex-row space-x-4 items-center hover:cursor-pointer">
                  <XMarkIcon className="w-5" />
                  <label>Odustani</label>
                </div>
              </button>
              <button
                className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-md hover:bg-green-500 h-10 shadow-lg w-32 text-sm font-semibold"
                onClick={handleOnSubmit}
              >
                <div className="flex flex-row space-x-4 items-center hover:cursor-pointer">
                  <CheckIcon className="w-5" />
                  <label>Spremi</label>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
