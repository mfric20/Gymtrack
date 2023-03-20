import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import Footer from "@/components/footer/footer";
import axios from "axios";
import GuestInfo from "@/components/info/guestInfo";
import MemberInfo from "@/components/info/memberInfo";
import WorkerInfo from "@/components/info/workerInfo";
import OwnerInfo from "@/components/info/ownerInfo";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { teretana_info } from "@/types/gym";

export default function Index() {
  const session = useSession();
  const router = useRouter();

  const [gymInfo, setGymInfo] = useState<teretana_info>();

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    if (session.status === "authenticated") loadUserGymInfo();
  }, [session.status]);

  const loadUserGymInfo = async () => {
    const userId = session.data.user.id;
    const gymId = router.query.id;

    await axios
      .post(
        "/api/gym/" + userId,
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
        if (JSON.parse(res.data.teretane)[0] == undefined) {
          setGymInfo({
            adresa: "",
            id: "",
            korisnik_teretana: [
              {
                korisnik_id: "",
                teretana_id: "",
                uloga_id: 0,
                odobren: false,
              },
            ],
            naziv: "",
            slika: "",
          });
        } else {
          setGymInfo(JSON.parse(res.data.teretane)[0]);
        }
        console.log(gymInfo);
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
            <div className="flex flex-row space-x-4 items-center ml-20 mt-5">
              <Bars3Icon className="w-9 fill-white" />
              <h2 className="text-white font-semibold text-2xl">
                Informacije o teretani
              </h2>
            </div>
            <hr className="mr-16 ml-16 opacity-20" />
          </div>
          <div>
            {gymInfo ? (
              gymInfo.id.length == 0 ||
              gymInfo.korisnik_teretana[0].odobren == false ? (
                <GuestInfo />
              ) : gymInfo.korisnik_teretana[0].uloga_id == 1 &&
                gymInfo.korisnik_teretana[0].odobren == true ? (
                <MemberInfo></MemberInfo>
              ) : gymInfo.korisnik_teretana[0].uloga_id == 2 &&
                gymInfo.korisnik_teretana[0].odobren == true ? (
                <WorkerInfo></WorkerInfo>
              ) : (
                <OwnerInfo></OwnerInfo>
              )
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
