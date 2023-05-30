import { korisnik, termin, korisnik_termin } from "@prisma/client";
import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Image from "next/image";
import axios from "axios";
import TermDetails from "@/components/cards/termDetails";
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
  const [termUsers, setTermUsers] = useState<korisnik[]>([]);

  const router = useRouter();
  const modalDelete = useDisclosure();
  const modalInfo = useDisclosure();
  const cancelRef = useRef();

  const handleDeleteClick = async () => {
    const id = router.query.id;
    await axios
      .delete("/api/gym/" + id + "/terms/term", {
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

  const handleGetTermUsers = async () => {
    const id = router.query.id;
    await axios
      .get("/api/gym/" + id + "/terms/users?termId=" + term.id)
      .then((res) => {
        setTermUsers(JSON.parse(res.data.users));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
    modalInfo.onOpen();
    loadCurrentTerms();
  };

  const reloadTerms = async () => {
    loadCurrentTerms();
  };

  return (
    <div
      className={`border-2 rounded-md ${
        term?.korisnik_termin?.length === 1
          ? "border-green-400"
          : "border-slate-300 border-opacity-40"
      }  shadow-lg  p-3 flex flex-row justify-between px-[2%]`}
    >
      <div className="flex flex-row justify-between w-full">
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

        <div className="flex justify-center space-y-2 flex-col">
          <button
            className="p-2 px-6 bg-slate-600  text-white rounded-md shadow-md hover:bg-slate-700 font-semibold flex flex-row space-x-1 items-center"
            onClick={handleGetTermUsers}
          >
            <InformationCircleIcon className="w-6" />
            <h2>Detalji</h2>
          </button>
          <button
            className="p-2 px-6 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 font-semibold flex flex-row space-x-2 items-center"
            onClick={modalDelete.onOpen}
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
          <AlertDialogHeader color="white">Jeste li sigurni?</AlertDialogHeader>
          <AlertDialogCloseButton color="white" />
          <AlertDialogBody color="white">
            Jeste li sigurni da želite izbrisati ovaj termin?
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
      <Modal
        closeOnOverlayClick={false}
        onClose={modalInfo.onClose}
        size="3xl"
        isOpen={modalInfo.isOpen}
      >
        <ModalOverlay />
        <ModalContent backgroundColor="#1F2937">
          <ModalHeader color="white">Detalji termina</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody color="white">
            <TermDetails
              term={term}
              termUsers={termUsers}
              reloadTerms={reloadTerms}
              reloadCurrentUsers={handleGetTermUsers}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
