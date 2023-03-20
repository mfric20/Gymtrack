import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { teretana_info } from "@/types/gym";
import axios from "axios";
import Image from "next/image";

export default function GuestInfo() {
  const router = useRouter();
  const gymId = router.query.id;
  const [gymInfo, setGymInfo] = useState<teretana_info>();

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

  const handleJoinClick = async () => {
    await axios
      .post(
        "/api/gym/join",
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
    <div className="flex flex-col space-y-8">
      <div className="flex flex-row  justify-center">
        <div className="border-2 w-48 p-2 text-slate-100 rounded-md border-slate-300 shadow-lg border-opacity-50  text-center hover:cursor-pointer bg-green-700 font-semibold">
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <InformationCircleIcon className="w-6" />
            <span>Opće informacije</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row space-x-4 pl-[10%] pr-[10%] pb-[5%]">
        {gymInfo ? (
          <>
            <div className="w-full">
              <Image
                alt="slika_teretane"
                src={gymInfo.slika}
                width={300}
                height={300}
                className="rounded-md shadow-lg mx-auto"
              />
            </div>
            <div className="w-full flex flex-col justify-between pt-6 pb-10">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="text-white text-lg">Naziv:</label>
                  <p className="ml-4">{gymInfo.naziv}</p>
                </div>
                <div>
                  <label className="text-white text-lg">Adresa:</label>
                  <p className="ml-4">{gymInfo.adresa}</p>
                </div>
              </div>
              {gymInfo.korisnik_teretana[0]?.odobren === false ? (
                <div className="flex flex-col space-y-2">
                  <p className="text-red-600">
                    Zahtjev za učlanjivanje je poslan!
                  </p>
                  <button
                    className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-lg hover:bg-green-500 h-10 shadow-lg w-48 text-sm font-semibold disabled:bg-slate-500"
                    disabled
                  >
                    Učlani se!
                  </button>
                </div>
              ) : (
                <button
                  className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-lg hover:bg-green-500 h-10 shadow-lg w-48 text-sm font-semibold"
                  onClick={handleJoinClick}
                >
                  Učlani se!
                </button>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
