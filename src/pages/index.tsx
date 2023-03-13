import Image from "next/image";
import GymPicture from "@/assets/gym.jpg";
import LoggedOutNavigation from "@/components/navigation/loggedOutNavigation";
import Footer from "@/components/footer/footer";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-tr from-slate-700 to-slate-900 min-h-screen overflow-hidden flex flex-col justify-between ">
      <div>
        <LoggedOutNavigation />
        <div className="p-20 lg:ml-[15%] lg:mr-[15%] flex lg:flex-row lg:space-x-10 flex-col space-y-4">
          <div className=" p-10 rounded-md w-full">
            <div className="flex flex-col space-y-4">
              <h1 className="text-3xl font-bold text-white">
                Jednostavno rješenje za gužve u teretanama!
              </h1>
              <p className="text-slate-300">
                Ova web stranica omogućuje korisnicima rezerviranje termina u
                teretani te pregled broja ljudi od svakom od termina. Ukoliko
                ste vlasnik neke teretane, možete dodati svoju teretanu!
              </p>
              <div className="h-full">
                <button
                  className="bg-green-600 text-white p-2 pr-4 pl-4 rounded-lg hover:bg-green-500 h-10 shadow-md w-48 text-sm mt-10 font-semibold"
                  onClick={() => router.push("/register")}
                >
                  Pridruži se besplatno!
                </button>
              </div>
            </div>
          </div>
          <div className="w-full">
            <Image
              src={GymPicture}
              alt="teretana"
              className="rounded-md shadow-xl lg:mt-[10%]"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
