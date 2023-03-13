import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import Footer from "@/components/footer/footer";
import OverviewCard from "@/components/cards/overviewCard";
import MyCard from "@/components/cards/myCard";

export default function dashboard() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
  }, [session.status]);

  if (session.status === "authenticated") {
    return (
      <div className="bg-gradient-to-tr from-slate-700 to-slate-900 h-screen flex flex-col justify-between">
        <div>
          <LoggedInNavigation />
          <div className="mt-20 flex flex-col space-y-10 pl-[25%] pr-[25%]">
            <h2 className="text-white font-semibold text-2xl text-center">
              Ukoliko ste novi korisnik, pokušajte sljedeće:
            </h2>
            <div className="flex flex-col space-y-10">
              <OverviewCard />
              <MyCard />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
