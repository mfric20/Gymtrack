import { Shantell_Sans } from "next/font/google";
import { useRouter } from "next/router";

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
        <button className="font-semibold text-white border-0 hover:border-0 hover:underline h-10">
          Prijavi se
        </button>
        <button
          className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-lg hover:bg-green-500 h-10 shadow-lg"
          onClick={() => router.push("/register")}
        >
          Registriraj se
        </button>
      </div>
    </div>
  );
}
