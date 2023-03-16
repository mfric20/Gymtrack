import { useState } from "react";
import {
  InformationCircleIcon,
  ListBulletIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

export default function WorkerInfo() {
  const [selectedTab, setSelectedTab] = useState<string>("info");

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center">
        <div
          className={`border-2 w-48 border-r-0 rounded-r-none p-2 text-slate-100 rounded-md border-slate-300 shadow-lg border-opacity-50  text-center hover:cursor-pointer ${
            selectedTab === "info"
              ? "bg-green-700 font-semibold"
              : "bg-slate-700 hover:bg-slate-800 "
          }`}
          onClick={() => setSelectedTab("info")}
        >
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <InformationCircleIcon className="w-6" />
            <span>Opće informacije</span>
          </div>
        </div>
        <div
          className={`border-2 p-2 w-48 text-center text-slate-100 border-r-0 border-slate-300 shadow-lg border-opacity-50 hover:cursor-pointer ${
            selectedTab === "termini"
              ? "bg-green-700 font-semibold"
              : "bg-slate-700 hover:bg-slate-800 "
          }`}
          onClick={() => setSelectedTab("termini")}
        >
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <ListBulletIcon className="w-6" />
            <span>Termini</span>
          </div>
        </div>
        <div
          className={`border-2 p-2 w-48 text-center text-slate-100 rounded-r-md border-slate-300 shadow-lg border-opacity-50 hover:cursor-pointer ${
            selectedTab === "clanovi"
              ? "bg-green-700 font-semibold"
              : "bg-slate-700 hover:bg-slate-800 "
          }`}
          onClick={() => setSelectedTab("clanovi")}
        >
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <UserGroupIcon className="w-6" />
            <span>Članovi</span>
          </div>
        </div>
      </div>

      <div>Tu su opće informacije o teretani</div>
    </div>
  );
}
