import Footer from "@/components/footer/footer";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { korisnik } from "@prisma/client";
import default_profil_pic from "@/assets/default_profile_pic.jpg";

export default function Profile() {
  const session = useSession();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<korisnik>();
  const id = router.query.id;

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    if (session.status === "authenticated") loadUserInfo();
  }, [session.status]);

  const loadUserInfo = async () => {
    await axios
      .get("/api/user/" + id)
      .then((res) => {
        const podaci = JSON.parse(res.data.podaci) as korisnik;
        setUserInfo(podaci);
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
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
                <h2 className="text-white font-semibold text-3xl">Profil</h2>
              </div>
              <button
                className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-md hover:bg-green-500 h-10 shadow-lg w-32 text-sm font-semibold mr-20"
                onClick={() => router.push(`/user/profile/${id}/edit`)}
              >
                <div className="flex flex-row space-x-4 items-center hover:cursor-pointer">
                  <PencilSquareIcon className="w-5" />
                  <label>Uredi</label>
                </div>
              </button>
            </div>
            <hr className="mr-16 ml-16 opacity-20" />
          </div>
          <div className="flex flex-row pt-10 pb-10 pl-24 pr-24 space-x-4">
            <div className="w-full flex flex-col space-y-2">
              {userInfo?.slika != "" ? (
                <Image
                  src={userInfo?.slika as string | ""}
                  alt="slika profila"
                  width={350}
                  height={350}
                  className="rounded-lg mx-auto shadow-sm"
                />
              ) : (
                <Image
                  src={default_profil_pic}
                  alt="slika profila"
                  width={350}
                  height={350}
                  className="rounded-lg mx-auto shadow-sm"
                />
              )}
            </div>
            <div className="flex flex-col text-white space-y-6 w-full justify-center border-2 border-slate-400 border-opacity-10 rounded-lg shadow-md">
              <div className="flex flex-col space-y-2">
                <div className="font-semibold text-2xl text-center">
                  Korisnički podaci:
                </div>
                <hr className="mr-16 ml-16 opacity-20" />
              </div>
              <div className="w-full flex flex-col space-y-2 pl-10 ">
                <p className="font-semibold text-lg">Ime:</p>
                <div className="ml-2 text-slate-200">{userInfo?.ime}</div>
              </div>
              <div className="w-full flex flex-col space-y-2 pl-10 ">
                <p className="font-semibold text-lg">Prezime:</p>
                <div className="ml-2 text-slate-200">{userInfo?.prezime}</div>
              </div>
              <div className="w-full flex flex-col space-y-2 pl-10 ">
                <p className="font-semibold text-lg">Email adresa:</p>
                <div className="ml-2 text-slate-200">{userInfo?.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
