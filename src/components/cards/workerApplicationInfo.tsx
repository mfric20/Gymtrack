import { korisnik } from "@prisma/client";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import default_profil_pic from "@/assets/default_profile_pic.jpg";

export default function WorkerApplicationInfo({
  user,
  loadGymWorkers,
  loadWorkerApplications,
}: {
  user: korisnik;
  loadGymWorkers: (searchSample: string) => Promise<void>;
  loadWorkerApplications: () => Promise<void>;
}) {
  const router = useRouter();

  const handleAcceptClick = async (userId: string) => {
    const id = router.query.id;
    await axios
      .put(
        "/api/gym/" + id + "/workers/workerApplications",
        {
          userId: userId,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        loadGymWorkers("");
        loadWorkerApplications();
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };
  const handleDeclineClick = async (userId: string) => {
    const id = router.query.id;
    await axios
      .delete("/api/gym/" + id + "/workers/workerApplications", {
        data: {
          userId: userId,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        loadGymWorkers("");
        loadWorkerApplications();
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };
  return (
    <div className="border-2 rounded-md border-slate-300 shadow-lg border-opacity-40 p-3 flex flex-row justify-between px-[2%]">
      <div className="flex flex-row space-x-4">
        <Image
          src={user.slika.length == 0 ? default_profil_pic : user.slika}
          alt="Slika profila"
          width={100}
          height={100}
          className="rounded-md"
        ></Image>
        <div className="flex flex-col">
          <div>
            <label className="text-white text-base">Ime i prezime:</label>
            <p className="ml-4">
              {user?.ime} {user?.prezime}
            </p>
          </div>
          <div>
            <label className="text-white text-base">Email adresa:</label>
            <p className="ml-4">{user?.email}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2 justify-center">
        <button
          className="p-2 px-6 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500 font-semibold flex flex-row space-x-2 items-center"
          onClick={() => handleAcceptClick(user.id)}
        >
          <CheckIcon className="w-5" />
          <h2>Prihvati</h2>
        </button>
        <button
          className="p-2 px-6 bg-red-600 text-white rounded-md shadow-md hover:bg-red-500 font-semibold flex flex-row space-x-2 items-center"
          onClick={() => handleDeclineClick(user.id)}
        >
          <XMarkIcon className="w-5" />
          <h2>Odbij</h2>
        </button>
      </div>
    </div>
  );
}