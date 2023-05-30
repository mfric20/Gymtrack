import { UserGroupIcon } from "@heroicons/react/24/solid";

export default function TermApplicationsTab() {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-row space-x-2 ml-4">
        <UserGroupIcon className="w-6 fill-white" />
        <h2 className="text-white font-semibold text-xl ml-2 h-fit m-auto select-none">
          Prijavljeni korisnici
        </h2>
      </div>
      <hr className="opacity-20" />
      <div className="my-10"></div>
    </div>
  );
}
