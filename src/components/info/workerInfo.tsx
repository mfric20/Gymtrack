import axios from "axios";
import Image from "next/image";
import ApplicationInfo from "../cards/applicationInfo";
import MemberInfo from "../cards/memberInfo";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { teretana_info } from "@/types/gym";
import {
  InformationCircleIcon,
  ListBulletIcon,
  UserGroupIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { korisnik } from "@prisma/client";

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
      loadGymMembers("");
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

  const loadGymMembers = async (searchSample: string) => {
    await axios
      .get(
        "/api/gym/" + gymId + "/members/members?searchSample=" + searchSample
      )
      .then((res) => {
        setMembers(JSON.parse(res.data.members));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const loadGymApplication = async () => {
    await axios
      .get("/api/gym/" + gymId + "/members/applicationMembers")
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
      {selectedTab == "info" && gymInfo ? (
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
              <p className="ml-4 text-gray-300">{gymInfo?.naziv}</p>
            </div>
            <div>
              <label className="text-white text-lg">Adresa:</label>
              <p className="ml-4 text-gray-300">{gymInfo?.adresa}</p>
            </div>
            <div>
              <label className="text-white text-lg">Vaša uloga:</label>
              <p className="ml-4 text-gray-300">Djelatnik</p>
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
                  <div className="text-center text-gray-300">
                    Trenutno nema novih zahtjeva za učlanjivanje!
                  </div>
                ) : (
                  applicationMembers.map((user) => {
                    return (
                      <ApplicationInfo
                        user={user}
                        loadGymMembers={loadGymMembers}
                        loadGymApplications={loadGymApplication}
                        key={user.id}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-2">
                  <UserGroupIcon className="w-6 fill-white" />
                  <h2 className="text-white font-semibold text-xl ml-2">
                    Članovi
                  </h2>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <MagnifyingGlassIcon className="w-6 fill-white" />
                  <input
                    type="text"
                    name="nameSample"
                    id="nameSample"
                    placeholder="Unesite ime ili prezime..."
                    className="rounded-lg p-1 pl-2 bg-slate-100 w-52 text-black"
                    onChange={(e) => loadGymMembers(e.target.value)}
                  />
                </div>
              </div>
              <hr className="opacity-20" />
              <div className="flex flex-col space-y-2 px-[10%] pt-3">
                {members.length === 0 ? (
                  <div className="text-center text-gray-300">
                    Trenutno nema učlanjenih korisnika!
                  </div>
                ) : (
                  members.map((user) => {
                    return (
                      <MemberInfo
                        user={user}
                        loadGymMembers={loadGymMembers}
                        key={user.id}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
