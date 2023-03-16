import { InformationCircleIcon } from "@heroicons/react/24/solid";

export default function GuestInfo() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row  justify-center">
        <div className="border-2 w-48 p-2 text-slate-100 rounded-md border-slate-300 shadow-lg border-opacity-50  text-center hover:cursor-pointer bg-green-700 font-semibold">
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <InformationCircleIcon className="w-6" />
            <span>Opće informacije</span>
          </div>
        </div>
      </div>
      <div>Tu su opće informacije o teretani</div>
    </div>
  );
}
