import { Shantell_Sans } from "next/font/google";
import { useRouter } from "next/router";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import axios from "axios";

const shantell_sans = Shantell_Sans({ subsets: ["latin"] });

export default function Activation() {
  const router = useRouter();
  const { id } = router.query;

  const [activationCode, setActivationCode] = useState<number>(0);
  const [wrongCodeLabel, setWrongCodeLabel] = useState<boolean>(false);

  const handleOnSubmit = async () => {
    await axios
      .post(
        "/api/activation",
        {
          id: id,
          aktivacijski_kod: activationCode,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        router.push("/login");
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
        setWrongCodeLabel(true);
      });
  };

  return (
    <div className="flex bg-gradient-to-tr from-slate-700 to-slate-900 h-screen items-center justify-center">
      <div className="shadow-lg p-10 rounded-lg flex flex-col space-y-4 bg-slate-100 bg-opacity-5">
        <div>
          <ArrowLongLeftIcon
            className="h-8 fill-white al hover:cursor-pointer"
            onClick={() => router.push("/register")}
          />
        </div>
        <h1 className="font-bold text-white text-4xl text-center">
          <label className={shantell_sans.className}>GYMTRACK</label>
        </h1>
        <h2 className="font-bol text-white text-xl text-center pt-6">
          Aktivacija
        </h2>
        <hr />
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row space-x-1">
            <label htmlFor="prezime" className="text-white">
              Aktivacijski kod:
            </label>
          </div>
          <input
            type="text"
            name="aktivacijskiKod"
            id="aktivacijskiKod"
            className="rounded-md p-1 bg-slate-100 text-lg font-bold text-center tracking-wider"
            onChange={(e) => setActivationCode(parseInt(e.target.value))}
          />
          {!wrongCodeLabel ? (
            ""
          ) : (
            <div className="text-red-600 text-sm">
              Pogrešan aktivacijski kod!
            </div>
          )}
        </div>
        <div>
          <button
            className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-lg hover:bg-green-500 h-10 w-full shadow-lg mt-4"
            onClick={handleOnSubmit}
          >
            Aktiviraj
          </button>
        </div>
      </div>
    </div>
  );
}
