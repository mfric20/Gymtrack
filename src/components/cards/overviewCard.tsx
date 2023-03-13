import { useRouter } from "next/router";
import { BookOpenIcon } from "@heroicons/react/24/solid";

export default function OverviewCard() {
  const router = useRouter();

  return (
    <div className="flex flex-row space-x-40 justify-between grow border-2 border-slate-500 border-opacity-10 drop-shadow-lg shadow-lg rounded-md p-4">
      <div className="text-white flex flex-row space-x-4">
        <BookOpenIcon className="w-10" />
        <div className="mt-auto mb-auto">Pregled svih dostupnih teretana!</div>
      </div>
      <div className="h-full ">
        <button
          className="bg-green-600 mt-auto mb-auto text-white p-2 pr-8 pl-8 rounded-lg hover:bg-green-500 h-10 shadow-md w-[100%] text-sm font-semibold"
          onClick={() => router.push("/user/overview")}
        >
          Pregledaj
        </button>
      </div>
    </div>
  );
}
