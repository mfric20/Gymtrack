import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import WorkerApplicationInfo from "../cards/workerApplicationInfo";
import WorkerInfo from "../cards/workerInfo";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { korisnik } from "@prisma/client";

export default function ApplicationTab() {
  const [workers, setWorkers] = useState<Array<korisnik>>([]);
  const [applicationMembers, setApplicationMembers] = useState<Array<korisnik>>(
    []
  );

  const router = useRouter();
  const gymId = router.query.id;

  useEffect(() => {
    loadGymWorkers("");
    loadWorkerApplications();
  }, []);

  const loadGymWorkers = async (searchSample: string) => {
    await axios
      .get(
        "/api/gym/" + gymId + "/workers/workers?searchSample=" + searchSample
      )
      .then((res) => {
        setWorkers(JSON.parse(res.data.workers));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške ${error}`);
      });
  };

  const loadWorkerApplications = async () => {
    await axios
      .get("/api/gym/" + gymId + "/workers/workerApplications")
      .then((res) => {
        setApplicationMembers(JSON.parse(res.data.workerApplicationMembers));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div className="flex flex-col mt-6 space-y-10">
      <div>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row space-x-2">
            <UserPlusIcon className="w-6 fill-white" />
            <h2 className="text-white font-semibold text-xl ml-2">
              Zahtjevi za djelatnike
            </h2>
          </div>
          <hr className="opacity-20" />
          <div className="flex flex-col space-y-2 px-[10%] pt-3">
            {applicationMembers.length === 0 ? (
              <div className="text-center text-gray-300">
                Trenutno nema novih zahtjeva za djelatnika!
              </div>
            ) : (
              applicationMembers.map((user) => {
                return (
                  <WorkerApplicationInfo
                    user={user}
                    loadGymWorkers={loadGymWorkers}
                    loadWorkerApplications={loadWorkerApplications}
                    key={user.id}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-2">
              <UserGroupIcon className="w-6 fill-white" />
              <h2 className="text-white font-semibold text-xl ml-2">
                Djelatnici
              </h2>
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <MagnifyingGlassIcon className="w-6 fill-white" />
              <input
                type="text"
                name="nameSample"
                id="nameSample"
                placeholder="Unesite ime ili prezime..."
                className="rounded-lg p-1 pl-2 bg-slate-100 w-52 text-black"
                onChange={(e) => loadGymWorkers(e.target.value)}
              />
            </div>
          </div>
          <hr className="opacity-20" />
          <div className="flex flex-col space-y-2 px-[10%] pt-3">
            {workers.length === 0 ? (
              <div className="text-center text-gray-300">
                Trenutno nema djelatnika ove teretane!
              </div>
            ) : (
              workers.map((user) => {
                return (
                  <WorkerInfo
                    user={user}
                    loadGymWorkers={loadGymWorkers}
                    key={user.id}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
