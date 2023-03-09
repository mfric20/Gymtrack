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

  const [userInfo, setUserInfo] = useState<korisnik>();
  const [newName, setNewName] = useState<string>("");
  const [newForname, setNewForname] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [pictureValue, setPictureValue] = useState<string>("");

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    if (session.status === "authenticated") loadUserInfo();
  }, [session.status]);

  const loadUserInfo = async () => {
    await axios
      .get("/api/user/" + session.data?.user?.id)
      .then((res) => {
        const podaci = JSON.parse(res.data.podaci) as korisnik;
        setUserInfo(podaci);
        setNewName(podaci.ime);
        setNewForname(podaci.prezime);
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
                  <p className="font-semibold text-lg">Ime:</p>
                  <input
                    type="text"
                    name="ime"
                    id="ime"
                    className="rounded-md p-1 bg-slate-100 mr-24 ml-4 text-black"
                    defaultValue={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="w-full flex flex-col space-y-2 pl-10 ">
                  <p className="font-semibold text-lg">Prezime:</p>
                  <input
                    type="text"
                    name="prezime"
                    id="prezime"
                    className="rounded-md p-1 bg-slate-100 mr-24 ml-4 text-black"
                    defaultValue={newForname}
                    onChange={(e) => setNewForname(e.target.value)}
                  />
                </div>
                <div className="w-full flex flex-col space-y-2 pl-10 ">
                  <p className="font-semibold text-lg">Trenutna lozinka:</p>
                  <input
                    type="text"
                    name="lozinka"
                    id="lozinka"
                    className="rounded-md p-1 bg-slate-100 mr-24 ml-4 text-black"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="w-full flex flex-col space-y-2 pl-10 mb-6">
                  <p className="font-semibold text-lg">Nova lozinka:</p>
                  <input
                    type="text"
                    name="plozinka"
                    id="plozinka"
                    className="rounded-md p-1 bg-slate-100 mr-24 ml-4 text-black"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center space-x-8">
              <button
                className="bg-red-600 text-white p-2 pr-4 pl-4 rounded-md hover:bg-red-500 h-10 shadow-lg w-32 text-sm font-semibold"
                onClick={() => router.push(`/user/profile/${id}/edit`)}
              >
                <div className="flex flex-row space-x-4 items-center hover:cursor-pointer">
                  <XMarkIcon className="w-5" />
                  <label>Odustani</label>
                </div>
              </button>
              <button
                className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-md hover:bg-green-500 h-10 shadow-lg w-32 text-sm font-semibold"
                onClick={() => router.push(`/user/profile/${id}/edit`)}
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
