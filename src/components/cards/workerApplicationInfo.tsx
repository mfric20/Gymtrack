import { korisnik } from "@prisma/client";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useRef } from "react";
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
import Image from "next/image";
import axios from "axios";
import default_profil_pic from "@/assets/default_profile_pic.jpg";

export default function WorkerApplicationInfo({
  user,
  loadGymWorkers,
  loadWorkerApplications,
}: {
  user: korisnik;
  loadGymWorkers: (searchSample: string) => Promise<void>;
  loadWorkerApplications: () => Promise<void>;
}) {
  const router = useRouter();
  const modalAccept = useDisclosure();
  const modalDelete = useDisclosure();
  const cancelRef = useRef();

  const handleAcceptClick = async () => {
    const id = router.query.id;
    await axios
      .put(
        "/api/gym/" + id + "/workers/workerApplications",
        {
          userId: user.id,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        loadGymWorkers("");
        loadWorkerApplications();
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const handleDeclineClick = async () => {
    const id = router.query.id;
    await axios
      .delete("/api/gym/" + id + "/workers/workerApplications", {
        data: {
          userId: user.id,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        loadGymWorkers("");
        loadWorkerApplications();
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div className="border-2 rounded-md border-slate-300 shadow-lg border-opacity-40 p-3 flex flex-row justify-between px-[2%]">
      <div className="flex flex-row space-x-4">
        <Image
          src={user.slika.length == 0 ? default_profil_pic : user.slika}
          alt="Slika profila"
          width={100}
          height={100}
          className="rounded-md"
        ></Image>
        <div className="flex flex-col">
          <div>
            <label className="text-white text-base">Ime i prezime:</label>
            <p className="ml-4 text-gray-300">
              {user?.ime} {user?.prezime}
            </p>
          </div>
          <div>
            <label className="text-white text-base">Email adresa:</label>
            <p className="ml-4 text-gray-300">{user?.email}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2 justify-center">
        <button
          className="p-2 px-6 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500 font-semibold flex flex-row space-x-2 items-center"
          onClick={modalAccept.onOpen}
        >
          <CheckIcon className="w-5" />
          <h2>Prihvati</h2>
        </button>
        <button
          className="p-2 px-6 bg-red-600 text-white rounded-md shadow-md hover:bg-red-500 font-semibold flex flex-row space-x-2 items-center"
          onClick={modalDelete.onOpen}
        >
          <XMarkIcon className="w-5" />
          <h2>Odbij</h2>
        </button>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={modalAccept.onClose}
          isOpen={modalAccept.isOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent backgroundColor="#1F2937">
            <AlertDialogHeader color="white">
              Jeste li sigurni?
            </AlertDialogHeader>
            <AlertDialogCloseButton color="white" />
            <AlertDialogBody color="white">
              Jeste li sigurni da želite prihvatiti ovu prijavu za djelatnika
              teretane?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={modalAccept.onClose}>
                Ne
              </Button>
              <Button colorScheme="whatsapp" ml={3} onClick={handleAcceptClick}>
                Da
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
              Jeste li sigurni da želite odbiti ovu prijavu za djelatnika
              teretane?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={modalDelete.onClose}>
                Ne
              </Button>
              <Button colorScheme="red" ml={3} onClick={handleDeclineClick}>
                Da
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
