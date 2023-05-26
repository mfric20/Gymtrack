import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { teretana_info } from "@/types/gym";
import axios from "axios";
import Image from "next/image";

export default function InfoTab({ role }: { role: string }) {
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
                <p className="ml-4 text-gray-300">{gymInfo.naziv}</p>
              </div>
              <div>
                <label className="text-white text-lg">Adresa:</label>
                <p className="ml-4 text-gray-300">{gymInfo.adresa}</p>
              </div>
              {role === "member" ? (
                <div>
                  <label className="text-white text-lg">Vaša uloga:</label>
                  <p className="ml-4 text-gray-300">Član</p>
                </div>
              ) : (
                <></>
              )}
              {role === "worker" ? (
                <div>
                  <label className="text-white text-lg">Vaša uloga:</label>
                  <p className="ml-4 text-gray-300">Djelatnik</p>
                </div>
              ) : (
                <></>
              )}
              {role === "owner" ? (
                <div>
                  <label className="text-white text-lg">Vaša uloga:</label>
                  <p className="ml-4 text-gray-300">Vlasnik</p>
                </div>
              ) : (
                <></>
              )}
            </div>
            {role === "guest" ? (
              gymInfo.korisnik_teretana[0]?.odobren === false ? (
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
              )
            ) : (
              <></>
            )}
            {role === "member" ? (
              gymInfo.korisnik_teretana[0]?.zahtjevDjelatnika === true ? (
                <div className="flex flex-col space-y-2">
                  <p className="text-red-600">
                    Zahtjev za djelatnika je poslan!
                  </p>
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
              )
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
