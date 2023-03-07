import { Shantell_Sans } from "next/font/google";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const shantell_sans = Shantell_Sans({ subsets: ["latin"] });

export default function LoggedOutNavigation() {
  const router = useRouter();

  return (
    <div className="flex flex-row pl-96 pr-96 justify-between shadow-lg rounded-md">
      <div className="items-center mt-5 mb-5">
        <h1 className="font-bold text-white text-4xl">
          <label className={shantell_sans.className}>GYMTRACK</label>
        </h1>
      </div>
      <div className="flex flex-row space-x-6 items-center">
        <button
          className="font-semibold text-white border-0 hover:border-0 hover:underline h-10"
          onClick={() => signOut({ callbackUrl: "http://localhost:3000" })}
        >
          Odjava
        </button>
      </div>
    </div>
  );
}
