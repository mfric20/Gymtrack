import { korisnik } from "@prisma/client";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function ApplicationInfo({ user }: { user: korisnik }) {
  return (
    <div className="border-2 rounded-md border-slate-300 shadow-lg border-opacity-40 p-3 flex flex-row justify-between px-[2%]">
      <div className="flex flex-row space-x-4">
        <Image
          src={user.slika}
          alt="Slika profila"
          width={100}
          height={100}
          className="rounded-md"
        ></Image>
        <div className="flex flex-col">
          <div>
            <label className="text-white text-base">Ime i prezime:</label>
            <p className="ml-4">
              {user?.ime} {user?.prezime}
            </p>
          </div>
          <div>
            <label className="text-white text-base">Email adresa:</label>
            <p className="ml-4">{user?.email}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2 justify-center">
        <button className="p-2 px-6 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500 font-semibold flex flex-row space-x-2 items-center">
          <CheckIcon className="w-5" />
          <h2>Prihvati</h2>
        </button>
        <button className="p-2 px-6 bg-red-600 text-white rounded-md shadow-md hover:bg-red-500 font-semibold flex flex-row space-x-2 items-center">
          <XMarkIcon className="w-5" />
          <h2>Odbij</h2>
        </button>
      </div>
    </div>
  );
}
