import Footer from "@/components/footer/footer";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { korisnik } from "@prisma/client";

export default function Profile() {
  const session = useSession();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<korisnik>();

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    if (session.status === "authenticated") loadUserInfo();
  }, [session.status]);

  const loadUserInfo = async () => {
    await axios
      .get("/api/user/" + session.data?.user?.email)
      .then((res) => {
        const podaci = JSON.parse(res.data.podaci) as korisnik;
        console.log(podaci);
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
            <div className="flex flex-row space-x-4 items-center ml-20 mt-5">
              <UserIcon className="w-10 fill-white" />
              <h2 className="text-white font-semibold text-3xl">Profil</h2>
            </div>
            <hr className="mr-16 ml-16 opacity-20" />
          </div>
          <div className="pl-24 pr-24 flex flex-col text-white space-y-6 w-1/2 mx-auto">
            <div className="w-full flex flex-col space-y-2">
              <p className="ml-20">Ime:</p>
              <div className="p-2 rounded-md bg-opacity-5 border-2 border-slate-400 shadow-md border-opacity-25 w-2/3 mx-auto">
                {userInfo?.ime}
              </div>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <p className="ml-20">Prezime:</p>
              <div className="p-2 rounded-md bg-opacity-5 border-2 border-slate-400 shadow-md border-opacity-25 w-2/3 mx-auto">
                {userInfo?.prezime}
              </div>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <p className="ml-20">Email adresa:</p>
              <div className="p-2 rounded-md bg-opacity-5 border-2 border-slate-400 shadow-md border-opacity-25 w-2/3 mx-auto">
                {userInfo?.email}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
