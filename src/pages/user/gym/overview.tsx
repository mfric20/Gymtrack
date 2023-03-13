import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MapIcon } from "@heroicons/react/24/solid";
import Footer from "@/components/footer/footer";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import GymInfo from "@/components/cards/gymInfo";
import axios from "axios";
import { teretana } from "@prisma/client";

export default function Overview() {
  const session = useSession();
  const router = useRouter();

  const [gymsInfo, setGymsInfo] = useState<Array<teretana>>();

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    if (session.status === "authenticated") loadGyms();
  }, [session.status]);

  const loadGyms = async () => {
    await axios
      .get("/api/gym/overview", { params: { nameSample: "" } })
      .then((res) => {
        const podaci = JSON.parse(res.data.teretane) as Array<teretana>;
        console.log(podaci);
        setGymsInfo(podaci);
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div className="bg-gradient-to-tr from-slate-700 to-slate-900 min-h-screen overflow-hidden flex flex-col justify-between">
      <div>
        <LoggedInNavigation />
        <div className="mt-20 mb-20 flex flex-col space-y-10 lg:ml-[15%] lg:mr-[15%] ml-5 mr-5 p-5 border-2 border-slate-400 rounded-md border-opacity-5 shadow-md bg-slate-100 bg-opacity-5">
          <div className="flex flex-col space-y-5">
            <div className="flex flex-row space-x-4 items-center ml-20 mt-5">
              <MapIcon className="w-10 fill-white" />
              <h2 className="text-white font-semibold text-3xl">
                Pregled teretana
              </h2>
            </div>
            <hr className="mr-16 ml-16 opacity-20" />
          </div>
          <div className="flex flex-wrap pl-[8%] pr-[8%]">
            {gymsInfo != undefined ? (
              gymsInfo.map((gym) => {
                return <GymInfo gymInfo={gym} key={gym.id} />;
              })
            ) : (
              <>Loading...</>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
