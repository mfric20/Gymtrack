import axios from "axios";
import {
  ListBulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import "react-datepicker/dist/react-datepicker.css";
import TermInfo from "@/components/cards/termInfoMember";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { korisnik, korisnik_termin, termin } from "@prisma/client";

export default function MemberTerm() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [terms, setTerms] = useState<
    Array<
      termin & { korisnik: korisnik } & {
        korisnik_termin: korisnik_termin[];
      } & {
        _count: { korisnik_termin: number };
      }
    >
  >([]);
  const router = useRouter();
  const gymId = router.query.id;
  useEffect(() => {
    loadCurrentTerms();
  }, [currentDate]);

  const loadCurrentTerms = async () => {
    await axios
      .get("/api/gym/" + gymId + `/terms/member?currentDate=${currentDate}`)
      .then((res) => {
        setTerms(JSON.parse(res.data.terms));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div className="flex flex-col my-5 space-y-4">
      <div className="flex flex-col space-y-1">
        <div className="flex justify-center text-slate-200 font-semibold text-lg select-none">
          Datum
        </div>
        <div className="flex justify-center flex-row space-x-2">
          <ChevronLeftIcon
            className="w-7 fill-slate-400 hover:cursor-pointer hover:fill-white border-2 border-slate-300 border-opacity-40 shadow-lg rounded-sm"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setDate(currentDate.getDate() - 1))
              )
            }
          />
          <p className="text-gray-200 w-min border-2 pt-2 pb-2 pr-5 pl-5 rounded-sm bg-opacity-40 border-slate-300 shadow-lg bg-slate-700 border-opacity-40 select-none">
            {currentDate.getDate() +
              "." +
              (currentDate.getMonth() + 1) +
              "." +
              currentDate.getFullYear() +
              "."}
          </p>
          <ChevronRightIcon
            className="w-7 fill-slate-400 hover:cursor-pointer hover:fill-white border-2 border-slate-300 border-opacity-40 shadow-lg rounded-sm"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setDate(currentDate.getDate() + 1))
              )
            }
          />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row space-x-2 ml-4">
            <ListBulletIcon className="w-6 fill-white" />
            <h2 className="text-white font-semibold text-xl ml-2 h-fit m-auto select-none">
              Termini
            </h2>
          </div>
        </div>
        <hr className="opacity-20" />
      </div>

      <div className="flex flex-col space-y-4 mx-28">
        {terms.length == 0 ? (
          <div className="text-white text-center">
            Za ovaj dan nema definiranih termina!
          </div>
        ) : (
          terms.map((term) => {
            return (
              <TermInfo
                term={term}
                loadCurrentTerms={loadCurrentTerms}
                key={term.id}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
