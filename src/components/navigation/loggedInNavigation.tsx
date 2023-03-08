import { Shantell_Sans } from "next/font/google";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { korisnik } from "@prisma/client";
import axios from "axios";

const shantell_sans = Shantell_Sans({ subsets: ["latin"] });

export default function LoggedInNavigation() {
  const router = useRouter();
  const session = useSession();

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
        setUserInfo(podaci);
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div className="flex flex-row pl-96 pr-96 justify-between shadow-lg rounded-md">
      <div className="items-center mt-5 mb-5 hover:cursor-pointer">
        <h1 className="font-bold text-white text-4xl ">
          <a
            className={shantell_sans.className}
            onClick={() => router.push("/user/dashboard")}
          >
            GYMTRACK
          </a>
        </h1>
      </div>
      <div className="items-center flex flex-row space-x-6">
        <a
          onClick={() => router.push("/user/")}
          className="text-white font-semibold hover:cursor-pointer hover:text-slate-300"
        >
          Početna
        </a>
        <a
          onClick={() => router.push("/user/overview")}
          className="text-white font-semibold hover:cursor-pointer hover:text-slate-300"
        >
          Pregled teretana
        </a>
        <a
          onClick={() => router.push("/user/my")}
          className="text-white font-semibold hover:cursor-pointer hover:text-slate-300"
        >
          Moje teretane
        </a>
      </div>
      <div className="flex flex-row space-x-6 items-center">
        <button
          className="font-semibold text-white border-0 hover:border-0 hover:underline h-10"
          onClick={() => signOut({ callbackUrl: "http://localhost:3000" })}
        >
          Odjava
        </button>
        <UserCircleIcon
          className="w-10 fill-white hover:cursor-pointer hover:fill-slate-300"
          onClick={() => router.push("/user/profile/" + userInfo?.id)}
        />
      </div>
    </div>
  );
}
