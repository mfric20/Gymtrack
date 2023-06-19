import { termin, korisnik } from "@prisma/client";
import {
  InformationCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useState } from "react";
import TermInfoTab from "@/components/tabs/termInfoTab";
import TermApplicationsTab from "@/components/tabs/termApplicationsTab";

export default function TermDetails({
  term,
  termUsers,
  setTermUsers,
  reloadTerms,
  reloadCurrentUsers,
}: {
  term: termin;
  termUsers: korisnik[];
  setTermUsers: Dispatch<SetStateAction<korisnik[]>>;
  reloadTerms: () => Promise<void>;
  reloadCurrentUsers: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState<string>("detalji");

  const reloadCurrentTerms = () => {
    reloadTerms();
  };

  const reloadUsers = () => {
    reloadCurrentUsers();
  };
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-row justify-center">
        <div
          className={`border-2 w-48 border-r-0 rounded-r-none p-2 text-slate-100 rounded-md border-slate-300 shadow-lg border-opacity-50  text-center hover:cursor-pointer ${
            selectedTab === "detalji"
              ? "bg-orange-700 font-semibold"
              : "bg-slate-700 hover:bg-slate-800 "
          }`}
          onClick={() => setSelectedTab("detalji")}
        >
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <InformationCircleIcon className="w-6" />
            <span className="select-none">Detalji termina</span>
          </div>
        </div>
        <div
          className={`border-2 p-2 w-48 text-center text-slate-100 rounded-r-md border-slate-300 shadow-lg border-opacity-50 hover:cursor-pointer ${
            selectedTab === "termini"
              ? "bg-orange-700 font-semibold"
              : "bg-slate-700 hover:bg-slate-800 "
          }`}
          onClick={() => setSelectedTab("termini")}
        >
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <UserGroupIcon className="w-6" />
            <span className="select-none">Korisnici</span>
          </div>
        </div>
      </div>
      {selectedTab === "detalji" ? (
        <TermInfoTab term={term} reloadCurrentTerms={reloadCurrentTerms} />
      ) : (
        <TermApplicationsTab
          term={term}
          termUsers={termUsers}
          setTermUsers={setTermUsers}
          reloadUsers={reloadUsers}
        />
      )}
    </div>
  );
}
