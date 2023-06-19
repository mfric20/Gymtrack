import { useRouter } from "next/router";
import { BookmarkIcon } from "@heroicons/react/24/solid";

export default function MyCard() {
  const router = useRouter();

  return (
    <div className="flex flex-row space-x-40 justify-between w-full grow border-2 border-slate-500 border-opacity-10 drop-shadow-lg shadow-lg rounded-md p-4">
      <div className=" text-white flex flex-row space-x-4">
        <BookmarkIcon className="w-10" />
        <div className="mt-auto mb-auto">Pregled učlanjenih teretana!</div>
      </div>
      <div className="h-full pt-1">
        <button
          className="bg-green-600 mt-auto mb-auto text-white p-2 pr-8 pl-8 rounded-lg hover:bg-green-500 h-10 shadow-md w-[100%] text-sm font-semibold"
          onClick={() => router.push("/user/my/member")}
        >
          Pregledaj
        </button>
      </div>
    </div>
  );
}
