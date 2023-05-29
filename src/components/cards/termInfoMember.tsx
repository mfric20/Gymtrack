import { korisnik, termin, korisnik_termin } from "@prisma/client";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Image from "next/image";
import axios from "axios";
import termIcon from "@/assets/termIcon.png";

export default function TermInfo({
  term,
  loadCurrentTerms,
}: {
  term: termin & { korisnik: korisnik } & {
    korisnik_termin: korisnik_termin[];
  } & {
    _count: { korisnik_termin: number };
  };
  loadCurrentTerms: () => Promise<void>;
}) {
  const router = useRouter();
  const modalDelete = useDisclosure();
  const modalApply = useDisclosure();
  const cancelRef = useRef();

  const handleTermApplication = async () => {
    const id = router.query.id;
    await axios
      .post("/api/gym/" + id + "/terms/member", {
        data: {
          termId: term.id,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        modalApply.onClose();
        loadCurrentTerms();
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const handleTermApplicationRemove = async () => {
    const id = router.query.id;
    await axios
      .delete("/api/gym/" + id + "/terms/member", {
        data: {
          termId: term.id,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        modalDelete.onClose();
        loadCurrentTerms();
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  return (
    <div
      className={`border-2 rounded-md ${
        term?.korisnik_termin?.length === 1
          ? "border-green-400"
          : "border-slate-300 border-opacity-40"
      }  shadow-lg  p-3 flex flex-row justify-between px-[2%]`}
    >
      <div className="flex flex-row space-x-4">
        <Image
          src={termIcon}
          alt="Slika profila"
          width={100}
          height={100}
          className="rounded-md"
        ></Image>
        <div className="flex flex-row space-x-6">
          <div className="flex flex-col">
            <div>
              <label className="text-white text-base">Datum</label>
              <p className="ml-4 text-gray-300">{term?.datum}</p>
            </div>
            <div>
              <label className="text-white text-base">Vrijeme:</label>
              <p className="ml-4 text-gray-300">
                Od {term?.pocetak} do {term?.kraj}
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <div>
              <label className="text-white text-base">Kreirao:</label>
              <p className="ml-4 text-gray-300">
                {term?.korisnik.ime} {term?.korisnik.prezime}
              </p>
            </div>
            <div>
              <label className="text-white text-base">Popunjeno:</label>
              <p className="ml-4 text-gray-300">
                {term?._count.korisnik_termin}/{term?.maksimalan_broj}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={`flex items-center flex-col space-y-1`}>
        {term?.korisnik_termin?.length > 0 ? (
          <div className="my-2">
            <label className="text-red-500 text-sm">
              Već ste prijavljeni na ovaj termin!
            </label>
          </div>
        ) : (
          <div className="my-2">
            <label className="text-white text-sm mr-5">
              Pritisnite za prijavu na termin!
            </label>
          </div>
        )}
        {term?.korisnik_termin?.length > 0 ? (
          <button
            className="p-2 px-6 bg-red-600 disabled:bg-slate-500 text-white rounded-md shadow-md hover:bg-red-700 font-semibold flex flex-row space-x-1 items-center"
            onClick={modalDelete.onOpen}
          >
            <ArrowRightCircleIcon className="w-6" />
            <h2>Odjava</h2>
          </button>
        ) : (
          <button
            className="p-2 px-6 bg-green-600 disabled:bg-slate-500 text-white rounded-md shadow-md hover:bg-green-700 font-semibold flex flex-row space-x-1 items-center"
            onClick={modalApply.onOpen}
          >
            <ArrowLeftCircleIcon className="w-6" />
            <h2>Prijava</h2>
          </button>
        )}
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
          <AlertDialogHeader color="white">Jeste li sigurni?</AlertDialogHeader>
          <AlertDialogCloseButton color="white" />
          <AlertDialogBody color="white">
            Jeste li sigurni da se želite odjaviti iz ovog termina?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={modalDelete.onClose}>
              Ne
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={handleTermApplicationRemove}
            >
              Da
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={modalApply.onClose}
        isOpen={modalApply.isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent backgroundColor="#1F2937">
          <AlertDialogHeader color="white">Jeste li sigurni?</AlertDialogHeader>
          <AlertDialogCloseButton color="white" />
          <AlertDialogBody color="white">
            Jeste li sigurni da se želite prijaviti na ovaj termin?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={modalApply.onClose}>
              Ne
            </Button>
            <Button
              colorScheme="whatsapp"
              ml={3}
              onClick={handleTermApplication}
            >
              Da
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
