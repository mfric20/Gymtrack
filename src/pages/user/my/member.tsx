import Footer from "@/components/footer/footer";
import axios from "axios";
import GymInfo from "@/components/cards/gymInfo";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IdentificationIcon } from "@heroicons/react/24/solid";
import { teretana } from "@prisma/client";

export default function Member() {
  const session = useSession();
  const router = useRouter();

  const [memberGyms, setMemberGyms] = useState<Array<teretana>>();

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    if (session.status === "authenticated") loadMemberGyms();
  }, [session.status]);

  const loadMemberGyms = async () => {
    const id = session.data.user.id;
    await axios
      .get("/api/gym/" + id + "/member")
      .then((res) => {
        setMemberGyms(JSON.parse(res.data.teretane));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div className="bg-gradient-to-tr from-slate-700 to-slate-900 h-screen flex flex-col justify-between">
      <div>
        <LoggedInNavigation />
        <div className="mt-20 mb-20 flex flex-col space-y-10 lg:ml-[15%] lg:mr-[15%] ml-5 mr-5 p-5 border-2 border-slate-400 rounded-md border-opacity-5 shadow-md bg-slate-100 bg-opacity-5">
          <div className="flex flex-col space-y-5">
            <div className="flex flex-row ml-20 items-center mt-5 space-x-4">
              <IdentificationIcon className="w-8 fill-white" />
              <h2 className="text-white font-semibold text-2xl">
                Teretane u kojima sam učlanjen
              </h2>
            </div>
            <hr className="mr-16 ml-16 opacity-20" />
          </div>
          <div className="flex flex-wrap mx-auto">
            {memberGyms != undefined ? (
              memberGyms.length == 0 ? (
                <div>Trenutno niste član ni jedne teretane!</div>
              ) : (
                memberGyms.map((gym) => {
                  return <GymInfo gymInfo={gym} key={gym.id} />;
                })
              )
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
