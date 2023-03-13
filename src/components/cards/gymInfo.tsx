import { teretana } from "@prisma/client";
import { useRouter } from "next/router";
import Image from "next/image";

export default function GymInfo({ gymInfo }: { gymInfo: teretana }) {
  const router = useRouter();

  return (
    <div className="flex mr-5 mb-5 flex-col justify-between space-y-6 border-2 border-slate-800 border-opacity-30 hover:shadow-2xl drop-shadow-lg shadow-lg rounded-md p-8 text-center">
      <div className=" text-white text-center">
        <div className="mt-auto mb-auto text-xl font-semibold">
          {gymInfo.naziv}
        </div>
      </div>
      <div className="mt-auto mb-auto">
        <Image
          src={gymInfo.slika}
          alt={"Slika teretane"}
          width={140}
          height={100}
          className="rounded-md shadow-lg mx-auto"
        />
      </div>
      <div className="h-full pt-1">
        <button
          className="bg-green-600 mt-auto mb-auto text-white p-2 pr-8 pl-8 rounded-lg hover:bg-green-500 h-10 shadow-md w-[100%] text-sm font-semibold"
          onClick={() => router.push("/user/my")}
        >
          Prikaži detalje
        </button>
      </div>
    </div>
  );
}
