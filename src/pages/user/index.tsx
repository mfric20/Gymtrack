import Footer from "@/components/footer/footer";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import Image from "next/image";
import PocetnaPicture from "@/assets/pocetna.jpg";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NewspaperIcon } from "@heroicons/react/24/solid";

export default function Index() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
  }, [session.status]);

  return (
    <div className="bg-gradient-to-tr from-slate-700 to-slate-900 h-screen flex flex-col justify-between">
      <div>
        <LoggedInNavigation />
        <div className="mt-20 flex flex-col space-y-10 ml-80 mr-80 p-5 border-2 border-slate-400 rounded-md border-opacity-5 shadow-md">
          <div className="flex flex-row space-x-4 items-center">
            <NewspaperIcon className="w-10 fill-white" />
            <h2 className="text-white font-semibold text-3xl">Početna</h2>
          </div>
          <div className="flex flex-row space-x-12 p-3">
            <p className="text-white text-justify w-full ml-5">
              Gymtrack služi kako bi se korisnici učlanili u neku od teretana te
              odabrali jedan od ponuđenih termina vježbanja. Ukoliko želite
              pregledati sve dostupne teretane, to možete učiniti klikom na
              "Pregled teretana" u navigacijskom izborniku. Ukoliko ste već
              učlanjeni u neku od teretana, klikom na "Moje teretane" možete
              vidjeti sve teretane u kojima ste učlanjeni ili u kojima ste
              vlasnik ili djelatnik.
            </p>
            <div className="w-full align-middle">
              <Image
                src={PocetnaPicture}
                alt="teretana"
                width={400}
                className="w-5/6 rounded-md shadow-lg mx-auto"
              />
            </div>
          </div>
          <hr className="mr-20 ml-20 opacity-20" />
          <div>Tu bude nekakva mini statistika</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
