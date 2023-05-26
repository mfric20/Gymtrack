import axios from "axios";
import InfoTab from "@/components/tabs/infoTab";
import MemberTerm from "@/components/tabs/memberTermTab";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  InformationCircleIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";
import { teretana_info } from "@/types/gym";

export default function MemberInfo() {
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
    <div className="flex flex-col space-y-6">
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
          className={`border-2 p-2 w-48 text-center text-slate-100 rounded-r-md border-slate-300 shadow-lg border-opacity-50 hover:cursor-pointer ${
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
      </div>
      {selectedTab == "info" && gymInfo ? (
        <InfoTab role="member" />
      ) : selectedTab == "termini" ? (
        <MemberTerm />
      ) : (
        <></>
      )}
    </div>
  );
}
