import Image from "next/image";
import axios from "axios";
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

  const handleWorkerApplication = async () => {
    await axios
      .post(
        "/api/gym/workerApplication",
        {
          gymId: gymId,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });

    loadGymInfo();
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
              <p className="ml-4">Član</p>
            </div>

            {gymInfo.korisnik_teretana[0]?.zahtjevDjelatnika === true ? (
              <div className="flex flex-col space-y-2">
                <p className="text-red-600">Zahtjev za djelatnika je poslan!</p>
                <button
                  className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-lg hover:bg-green-500 h-10 shadow-lg w-56 text-sm font-semibold disabled:bg-slate-500"
                  disabled
                >
                  Pošalji zahtjev za djelatnika!
                </button>
              </div>
            ) : (
              <button
                className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-lg hover:bg-green-500 h-10 shadow-lg w-56 text-sm font-semibold"
                onClick={handleWorkerApplication}
              >
                Pošalji zahtjev za djelatnika!
              </button>
            )}
          </div>
        </div>
      ) : selectedTab == "termini" ? (
        <div>Ovo su termini</div>
      ) : (
        <></>
      )}
    </div>
  );
}
