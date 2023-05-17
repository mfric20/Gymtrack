import { korisnik } from "@prisma/client";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import default_profil_pic from "@/assets/default_profile_pic.jpg";
import Image from "next/image";
import axios from "axios";

export default function WorkerInfo({
  user,
  loadGymWorkers,
}: {
  user: korisnik;
  loadGymWorkers: (searchSample: string) => Promise<void>;
}) {
  const router = useRouter();
  const handleDeleteClick = async (userId: string) => {
    const id = router.query.id;
    await axios
      .delete("/api/gym/" + id + "/workers/workers", {
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
      <div className="flex items-center">
        <button
          className="p-2 px-6 bg-red-600 text-white rounded-md shadow-md hover:bg-red-500 font-semibold flex flex-row space-x-2 items-center"
          onClick={() => handleDeleteClick(user.id)}
        >
          <TrashIcon className="w-5" />
          <h2>Izbriši</h2>
        </button>
      </div>
    </div>
  );
}
