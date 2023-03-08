import Footer from "@/components/footer/footer";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
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
        <div className="mt-20 flex flex-col space-y-10 ml-80 mr-80 p-5 border-2">
          <div>
            <NewspaperIcon />
            <h2 className="text-white font-semibold text-2xl">Početna</h2>
          </div>
          <div className="flex flex-row space-x-10">
            <p className="text-white text-center">
              Ukoliko ste novi korisnik, pokušajte sljedeće:
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
