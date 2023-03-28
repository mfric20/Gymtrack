import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { teretana_info } from "@/types/gym";
import {
  InformationCircleIcon,
  ListBulletIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { korisnik } from "@prisma/client";
import ApplicationInfo from "../cards/applicationInfo";
import axios from "axios";
import Image from "next/image";

export default function WorkerInfo() {
  const [selectedTab, setSelectedTab] = useState<string>("info");
  const [gymInfo, setGymInfo] = useState<teretana_info>();
  const [members, setMembers] = useState<Array<korisnik>>([]);
  const [applicationMembers, setApplicationMembers] = useState<Array<korisnik>>(
    []
  );

  const router = useRouter();
  const gymId = router.query.id;

  useEffect(() => {
    loadGymInfo();
  }, []);

  useEffect(() => {
    if (selectedTab == "clanovi") {
      loadGymMembers();
      loadGymApplication();
    }
  }, [selectedTab]);

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

  const loadGymMembers = async () => {
    await axios
      .get("/api/gym/" + gymId + "/members/getMembers")
      .then((res) => {
        setMembers(JSON.parse(res.data.members));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const loadGymApplication = async () => {
    await axios
      .get("/api/gym/" + gymId + "/members/getApplicationMembers")
      .then((res) => {
        setApplicationMembers(JSON.parse(res.data.members));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

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
      {selectedTab == "info" ? (
        <div className="flex flex-row space-x-4 pl-[10%] pr-[10%] pb-[5%] mt-10">
          <div className="w-full">
            <Image
              alt="slika_teretane"
              src={gymInfo?.slika}
              width={300}
              height={300}
              className="rounded-md shadow-lg mx-auto"
            />
          </div>
          <div className="w-full flex flex-col justify-center pt-6 pb-10 space-y-4">
            <div>
              <label className="text-white text-lg">Naziv:</label>
              <p className="ml-4">{gymInfo?.naziv}</p>
            </div>
            <div>
              <label className="text-white text-lg">Adresa:</label>
              <p className="ml-4">{gymInfo?.adresa}</p>
            </div>
            <div>
              <label className="text-white text-lg">Vaša uloga:</label>
              <p className="ml-4">Djelatnik</p>
            </div>
          </div>
        </div>
      ) : selectedTab == "termini" ? (
        <div>Ovo su termini</div>
      ) : (
        <div className="flex flex-col mt-6 space-y-10">
          <div>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row space-x-2">
                <UserPlusIcon className="w-6 fill-white" />
                <h2 className="text-white font-semibold text-xl ml-2">
                  Zahtjevi za učlanjivanje
                </h2>
              </div>
              <hr className="opacity-20" />
              <div className="flex flex-col space-y-2 px-[10%] pt-3">
                {applicationMembers.length === 0 ? (
                  <div className="text-center">
                    Trenutno nema novih zahtjeva za učlanjivanje!
                  </div>
                ) : (
                  applicationMembers.map((user) => {
                    return <ApplicationInfo user={user} />;
                  })
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row space-x-2">
                <UserGroupIcon className="w-6 fill-white" />
                <h2 className="text-white font-semibold text-xl ml-2">
                  Članovi
                </h2>
              </div>
              <hr className="opacity-20" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
