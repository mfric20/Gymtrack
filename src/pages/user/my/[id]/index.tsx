import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import Footer from "@/components/footer/footer";
import axios from "axios";
import GuestInfo from "@/components/info/guestInfo";
import MemberInfo from "@/components/info/memberInfo";
import WorkerInfo from "@/components/info/workerInfo";
import OwnerInfo from "@/components/info/ownerInfo";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { teretana_info } from "@/types/gym";
import {
  useDisclosure,
  AlertDialog,
  Button,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogBody,
} from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function Index() {
  const session = useSession();
  const cancelRef = useRef();
  const router = useRouter();
  const modalDelete = useDisclosure();

  const [gymInfo, setGymInfo] = useState<teretana_info>();
  const [guest, setGuest] = useState<boolean>(false);

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    if (session.status === "authenticated") loadUserGymInfo();
  }, [session.status]);

  const loadUserGymInfo = async () => {
    const userId = session.data.user.id;
    const gymId = router.query.id;

    await axios
      .post(
        "/api/gym/" + userId,
        {
          gymId: gymId,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (JSON.parse(res.data.teretane) == undefined) setGuest(true);

        setGymInfo(JSON.parse(res.data.teretane));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const handleDeleteClick = async () => {
    const userId = session.data.user.id;
    const gymId = router.query.id;

    await axios
      .delete("/api/gym/" + userId + "?gymId=" + gymId)
      .then((res) => {
        router.replace("/user/my/owner");
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div className="bg-gradient-to-tr from-slate-700 to-slate-900 min-h-screen flex flex-col justify-between overflow-hidden">
      <div>
        <LoggedInNavigation />
        <div className="mt-20 mb-20 flex flex-col space-y-10 lg:ml-[15%] lg:mr-[15%] ml-5 mr-5 p-5 border-2 border-slate-400 rounded-md border-opacity-5 shadow-md bg-slate-100 bg-opacity-5">
          <div className="flex flex-col space-y-5">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row space-x-4 items-center ml-20 mt-5">
                <Bars3Icon className="w-9 fill-white" />
                <h2 className="text-white font-semibold text-2xl">
                  Informacije o teretani
                </h2>
              </div>
              {gymInfo?.korisnik_teretana[0]?.uloga_id == 3 && (
                <button
                  className="p-2 mt-4 px-6 bg-red-600 text-white rounded-md shadow-md hover:bg-red-500 font-semibold flex flex-row space-x-2 items-center"
                  onClick={modalDelete.onOpen}
                >
                  <TrashIcon className="w-5" />
                  <h2>Obriši</h2>
                </button>
              )}
            </div>
            <hr className="mr-16 ml-16 opacity-20" />
          </div>
          <div>
            {gymInfo ? (
              gymInfo.korisnik_teretana.length == 0 ? (
                <GuestInfo />
              ) : gymInfo.korisnik_teretana[0]?.uloga_id == 1 &&
                gymInfo.korisnik_teretana[0].odobren == false ? (
                <GuestInfo />
              ) : gymInfo.korisnik_teretana[0]?.uloga_id == 1 &&
                gymInfo.korisnik_teretana[0].odobren == true ? (
                <MemberInfo />
              ) : gymInfo.korisnik_teretana[0]?.uloga_id == 2 &&
                gymInfo.korisnik_teretana[0].odobren == true ? (
                <WorkerInfo />
              ) : gymInfo.korisnik_teretana[0]?.uloga_id == 3 &&
                gymInfo.korisnik_teretana[0].odobren == true ? (
                <OwnerInfo />
              ) : (
                <></>
              )
            ) : guest === true ? (
              <GuestInfo />
            ) : (
              <div className="text-gray-400">Loading...</div>
            )}
          </div>
        </div>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={modalDelete.onClose}
          isOpen={modalDelete.isOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent backgroundColor="#1F2937">
            <AlertDialogHeader color="white">
              Jeste li sigurni?
            </AlertDialogHeader>
            <AlertDialogCloseButton color="white" />
            <AlertDialogBody color="white">
              Jeste li sigurni da želite obrisati teretanu?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={modalDelete.onClose}>
                Ne
              </Button>
              <Button colorScheme="red" ml={3} onClick={handleDeleteClick}>
                Da
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Footer />
    </div>
  );
}
