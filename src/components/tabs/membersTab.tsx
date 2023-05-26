import axios from "axios";
import ApplicationInfo from "@/components/cards/applicationInfo";
import MemberInfo from "@/components/cards/memberInfo";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { korisnik } from "@prisma/client";

export default function MembersTab() {
  const [members, setMembers] = useState<Array<korisnik>>([]);
  const [applicationMembers, setApplicationMembers] = useState<Array<korisnik>>(
    []
  );

  const router = useRouter();
  const gymId = router.query.id;

  useEffect(() => {
    loadGymMembers("");
    loadGymApplication();
  }, []);

  const loadGymMembers = async (searchSample: string) => {
    await axios
      .get(
        "/api/gym/" + gymId + "/members/members?searchSample=" + searchSample
      )
      .then((res) => {
        setMembers(JSON.parse(res.data.members));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const loadGymApplication = async () => {
    await axios
      .get("/api/gym/" + gymId + "/members/applicationMembers")
      .then((res) => {
        setApplicationMembers(JSON.parse(res.data.members));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div className="flex flex-col mt-6 space-y-10">
      <div>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row space-x-2 ml-4">
            <UserPlusIcon className="w-6 fill-white" />
            <h2 className="text-white font-semibold text-xl ml-2">
              Zahtjevi za učlanjivanje
            </h2>
          </div>
          <hr className="opacity-20" />
          <div className="flex flex-col space-y-2 px-[10%] pt-3">
            {applicationMembers.length === 0 ? (
              <div className="text-center text-gray-300">
                Trenutno nema novih zahtjeva za učlanjivanje!
              </div>
            ) : (
              applicationMembers.map((user) => {
                return (
                  <ApplicationInfo
                    user={user}
                    loadGymMembers={loadGymMembers}
                    loadGymApplications={loadGymApplication}
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
            <div className="flex flex-row space-x-2 ml-4">
              <UserGroupIcon className="w-6 fill-white" />
              <h2 className="text-white font-semibold text-xl ml-2">Članovi</h2>
            </div>
            <div className="flex flex-row space-x-2 items-center mr-4">
              <MagnifyingGlassIcon className="w-6 fill-white" />
              <input
                type="text"
                name="nameSample"
                id="nameSample"
                placeholder="Unesite ime ili prezime..."
                className="rounded-lg p-1 pl-2 bg-slate-100 w-52 text-black"
                onChange={(e) => loadGymMembers(e.target.value)}
              />
            </div>
          </div>
          <hr className="opacity-20" />
          <div className="flex flex-col space-y-2 px-[10%] pt-3">
            {members.length === 0 ? (
              <div className="text-center text-gray-300">
                Trenutno nema učlanjenih korisnika!
              </div>
            ) : (
              members.map((user) => {
                return (
                  <MemberInfo
                    user={user}
                    loadGymMembers={loadGymMembers}
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
