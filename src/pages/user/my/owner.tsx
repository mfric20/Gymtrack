import Footer from "@/components/footer/footer";
import axios from "axios";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import GymInfo from "@/components/cards/gymInfo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BookmarkIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { teretana } from "@prisma/client";

export default function My() {
  const session = useSession();
  const router = useRouter();

  const [ownerGyms, setOwnerGyms] = useState<Array<teretana>>();

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    if (session.status === "authenticated") loadOwnerGyms();
  }, [session.status]);

  const loadOwnerGyms = async () => {
    const id = session.data.user.id;
    await axios
      .get("/api/gym/" + id + "/owner")
      .then((res) => {
        setOwnerGyms(JSON.parse(res.data.teretane));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div className="bg-gradient-to-tr from-slate-700 to-slate-900 min-h-screen flex flex-col justify-between overflow-hidden">
      <div>
        <LoggedInNavigation />
        <div className="mt-20 mb-20 flex flex-col space-y-10 lg:ml-[15%] lg:mr-[15%] ml-5 mr-5 p-5 border-2 border-slate-400 rounded-md border-opacity-5 shadow-md bg-slate-100 bg-opacity-5">
          <div className="flex flex-col space-y-5">
            <div className="flex flex-row justify-between items-center mt-5">
              <div className="flex flex-row space-x-4 items-center ml-20 ">
                <BookmarkIcon className="w-8 fill-white" />
                <h2 className="text-white font-semibold text-2xl">
                  Teretane u kojim sam vlasnik
                </h2>
              </div>
              <button
                className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-md hover:bg-green-500 h-10 shadow-lg w-32 text-sm font-semibold mr-20"
                onClick={() => router.push("./add")}
              >
                <div className="flex flex-row space-x-4 items-center hover:cursor-pointer">
                  <PlusCircleIcon className="w-5" />
                  <label className=" hover:cursor-pointer">Dodaj</label>
                </div>
              </button>
            </div>
            <hr className="mr-16 ml-16 opacity-20" />
          </div>
          <div className="flex flex-wrap pl-[8%] pr-[8%]">
            {ownerGyms != undefined ? (
              ownerGyms.map((gym) => {
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
