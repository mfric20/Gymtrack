import { Shantell_Sans } from "next/font/google";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const shantell_sans = Shantell_Sans({ subsets: ["latin"] });

export default function LoggedInNavigation() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
  }, [session.status]);

  return (
    <div className="flex flex-row pl-[15%] pr-[15%] justify-between shadow-lg rounded-md">
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
        <div className="dropdown">
          <div
            className="flex flex-row hover:cursor-pointer hover:text-slate-300"
            tabIndex={0}
          >
            <label className="m-1 text-white font-semibold  bg-transparent">
              Moje teretane
            </label>
            <ChevronDownIcon className="w-5" />
          </div>
          <div
            tabIndex={0}
            className="dropdown-content p-4 shadow bg-slate-800 bg-opacity-95 rounded-md w-52 mt-2 flex flex-col space-y-2 justify-center"
          >
            <div className="hover:text-slate-300 hover:cursor-pointer text-white">
              <a>Teretane u kojima sam član</a>
            </div>
            <hr className="mr-2 ml-2 opacity-20" />
            <div className="hover:text-slate-300 hover:cursor-pointer text-white">
              <a>Teretane u kojima sam djelatnik</a>
            </div>
            <hr className="mr-2 ml-2 opacity-20" />
            <div className="hover:text-slate-300 hover:cursor-pointer text-white">
              <a>Teretane u kojima sam vlasnik</a>
            </div>
          </div>
        </div>
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
          onClick={() => router.push("/user/profile/" + session?.data.user?.id)}
        />
      </div>
    </div>
  );
}
