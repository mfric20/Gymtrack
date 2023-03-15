import Footer from "@/components/footer/footer";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import Image from "next/image";
import PocetnaPicture from "@/assets/pocetna.jpg";
import axios from "axios";
import InfoCard from "@/components/cards/infoCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NewspaperIcon } from "@heroicons/react/24/solid";
import { teretana_korisnik } from "@/types/gym";

export default function Index() {
  const session = useSession();
  const router = useRouter();

  const [activeNumber, setActiveNumber] = useState<number>(0);
  const [memberNumber, setMemberNumber] = useState<number>(0);
  const [workerNumber, setWorkerNumber] = useState<number>(0);
  const [ownerNumber, setOwnerNumber] = useState<number>(0);

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    else if (session.status === "authenticated") loadGyms();
  }, [session.status]);

  const loadGyms = async () => {
    await axios
      .get("/api/gym/" + session.data?.user?.email)
      .then((res) => {
        const teretane = JSON.parse(
          res.data.teretane
        ) as Array<teretana_korisnik>;

        setActiveNumber(teretane.length);

        let memberNumberTemp = 0;
        let workerNumberTemp = 0;
        let ownerNumberTemp = 0;

        teretane.map((t) => {
          t.korisnik_teretana.map((k) => {
            if (k.korisnik.email == session.data?.user?.email) {
              if (k.uloga_id == 1) memberNumberTemp++;
              if (k.uloga_id == 2) workerNumberTemp++;
              if (k.uloga_id == 3) ownerNumberTemp++;
            }
          });
        });

        setMemberNumber(memberNumberTemp);
        setWorkerNumber(workerNumberTemp);
        setOwnerNumber(ownerNumberTemp);
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
              <NewspaperIcon className="w-10 fill-white" />
              <h2 className="text-white font-semibold text-3xl">Početna</h2>
            </div>
            <hr className="mr-16 ml-16 opacity-20" />
          </div>
          <div className="flex justify-center p-5 flex-row space-x-4">
            <InfoCard
              tekst="Broj aktivnih teretana:"
              link="gym/overview"
              broj={activeNumber}
            />
            <InfoCard
              tekst="Broj teretana u kojima sam učlanjen:"
              link="my/member"
              broj={memberNumber}
            />
            <InfoCard
              tekst="Broj teretana u kojima sam djelatnik:"
              link="my/worker"
              broj={workerNumber}
            />
            <InfoCard
              tekst="Broj teretana u kojima sam vlasnik:"
              link="my/owner"
              broj={ownerNumber}
            />
          </div>
          <div className="flex flex-row space-x-12 p-3">
            <div className="flex flex-col space-y-4 w-full">
              <h2 className="text-white text-justify w-full ml-5 text-2xl">
                Zašto GYMTRACK?
              </h2>
              <p className="text-white text-justify w-full ml-5">
                Gymtrack služi kako bi se korisnici učlanili u neku od teretana
                te odabrali jedan od ponuđenih termina vježbanja. Ukoliko želite
                pregledati sve dostupne teretane, to možete učiniti klikom na
                "Pregled teretana" u navigacijskom izborniku. Ukoliko ste već
                učlanjeni u neku od teretana, klikom na "Moje teretane" možete
                vidjeti sve teretane u kojima ste učlanjeni ili u kojima ste
                vlasnik ili djelatnik.
              </p>
            </div>
            <div className="w-full align-middle">
              <Image
                src={PocetnaPicture}
                alt="teretana"
                width={400}
                className="w-5/6 rounded-md shadow-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
