import axios from "axios";
import InfoTab from "@/components/tabs/infoTab";
import OwnerTerm from "@/components/tabs/ownerTermTab";
import MembersTab from "@/components/tabs/membersTab";
import ApplicationsTab from "@/components/tabs/applicationsTab";
import { useState, useEffect } from "react";
import {
  InformationCircleIcon,
  ListBulletIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { teretana_info } from "@/types/gym";

export default function OwnerInfo() {
  const [selectedTab, setSelectedTab] = useState<string>("info");
  const [gymInfo, setGymInfo] = useState<teretana_info>();

  const router = useRouter();
  const gymId = router.query.id;

  useEffect(() => {
    loadGymInfo();
  }, []);

  const loadGymInfo = async () => {
    await axios
      .get("/api/gym/" + gymId + "/getInfo")
      .then((res) => {
        setGymInfo(JSON.parse(res.data.teretana));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div className="flex flex-col space-y-10">
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
          className={`border-2 p-2 w-48 text-center text-slate-100 border-slate-300 shadow-lg border-opacity-50 hover:cursor-pointer ${
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
        <div
          className={`border-2 p-2 w-48 border-l-0 text-center rounded-l-none text-slate-100 rounded-md border-slate-300 shadow-lg border-opacity-50 hover:cursor-pointer  ${
            selectedTab === "djelatnici"
              ? "bg-green-700 font-semibold"
              : "bg-slate-700 hover:bg-slate-800 "
          }`}
          onClick={() => setSelectedTab("djelatnici")}
        >
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <UsersIcon className="w-6" />
            <span>Djelatnici</span>
          </div>
        </div>
      </div>

      {selectedTab == "info" && gymInfo ? (
        <InfoTab role="owner" />
      ) : selectedTab == "termini" ? (
        <OwnerTerm />
      ) : selectedTab == "clanovi" ? (
        <MembersTab />
      ) : (
        <ApplicationsTab />
      )}
    </div>
  );
}
