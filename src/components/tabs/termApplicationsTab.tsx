import axios from "axios";
import default_profil_pic from "@/assets/default_profile_pic.jpg";
import Image from "next/image";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { korisnik, termin } from "@prisma/client";
import { useRef, useState } from "react";
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

export default function TermApplicationsTab({
  termUsers,
  reloadUsers,
  term,
}: {
  termUsers: korisnik[];
  reloadUsers: () => void;
  term: termin;
}) {
  const [userId, setUserId] = useState<string>();

  const router = useRouter();
  const modalDelete = useDisclosure();
  const cancelRef = useRef();

  const handleDeleteUser = async () => {
    const id = router.query.id;
    await axios
      .delete("/api/gym/" + id + "/terms/worker", {
        data: {
          termId: term.id,
          userId: userId,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        reloadUsers();
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const handleSetUserForDelete = async (userId: string) => {
    setUserId(userId);
    modalDelete.onOpen();
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-center">
        <div className="text-lg flex flex-col items-center">
          <span>Broj prijavljenih korisnika:</span>
          <span className="text-2xl font-semibold">
            {termUsers?.length} / {term?.maksimalan_broj}
          </span>
        </div>
      </div>
      <div className="flex flex-row space-x-2 ml-4">
        <UserGroupIcon className="w-6 fill-white" />
        <h2 className="text-white font-semibold text-xl ml-2 h-fit m-auto select-none">
          Prijavljeni korisnici
        </h2>
      </div>
      <hr className="opacity-20" />
      <div className="my-10">
        {termUsers.map((user) => {
          return (
            <div key={user.id} className="px-14 flex flex-col space-y-2">
              <div className="border-2 rounded-md border-slate-300 shadow-lg border-opacity-40 p-3 flex flex-row justify-between px-[2%]">
                <div className="flex flex-row space-x-4">
                  <Image
                    src={
                      user.slika.length == 0 ? default_profil_pic : user.slika
                    }
                    alt="Slika profila"
                    width={100}
                    height={100}
                    className="rounded-md"
                  ></Image>
                  <div className="flex flex-col">
                    <div>
                      <label className="text-white text-base">
                        Ime i prezime:
                      </label>
                      <p className="ml-4 text-gray-300">
                        {user?.ime} {user?.prezime}
                      </p>
                    </div>
                    <div>
                      <label className="text-white text-base">
                        Email adresa:
                      </label>
                      <p className="ml-4 text-gray-300">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    className="p-2 px-6 bg-red-600 text-white rounded-md shadow-md hover:bg-red-500 font-semibold flex flex-row space-x-2 items-center"
                    onClick={() => handleSetUserForDelete(user.id)}
                  >
                    <TrashIcon className="w-5" />
                    <h2>Izbriši</h2>
                  </button>
                </div>
              </div>
              <AlertDialog
                motionPreset="slideInBottom"
                scrollBehavior={"inside"}
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
                    Jeste li sigurni da želite maknuti ovog korisnika?
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={modalDelete.onClose}>
                      Ne
                    </Button>
                    <Button colorScheme="red" ml={3} onClick={handleDeleteUser}>
                      Da
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        })}
      </div>
    </div>
  );
}
