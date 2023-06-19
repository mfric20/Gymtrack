import axios from "axios";
import {
  ListBulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import "react-datepicker/dist/react-datepicker.css";
import TermInfo from "@/components/cards/termInfoOwner";
import DatePicker from "react-datepicker";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { korisnik, korisnik_termin, termin } from "@prisma/client";
import {
  useDisclosure,
  Modal,
  Button,
  ModalOverlay,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export default function OwnerTerm() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { isOpen, onOpen, onClose } = useDisclosure();
  //Form
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [maxNumber, setMaxNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  //For error highlight
  const [startDateError, setStartDateError] = useState<Boolean>(false);
  const [startTimeError, setStartTimeError] = useState<Boolean>(false);
  const [endTimeError, setEndTimeError] = useState<Boolean>(false);
  const [maxNumberError, setMaxNumberError] = useState<Boolean>(false);
  const [terms, setTerms] = useState<
    Array<
      termin & { korisnik: korisnik } & {
        korisnik_termin: korisnik_termin[];
      } & {
        _count: { korisnik_termin: number };
      }
    >
  >([]);
  const router = useRouter();
  const session = useSession();
  const gymId = router.query.id;

  useEffect(() => {
    loadCurrentTerms();
  }, [currentDate]);

  const handleSaveClick = async () => {
    let errorMess = "";
    if (startDate == undefined) {
      setStartDateError(true);
      errorMess += "Datum mora biti definiran! \n";
    } else setStartDateError(false);

    if (startTime >= endTime) {
      setStartTimeError(true);
      setEndTimeError(true);
      errorMess += "Vrijeme završetka ne može biti prije vremena početka! \n";
    } else {
      setEndTimeError(false);
      setStartTimeError(false);
    }

    if (startTime == undefined) {
      setStartTimeError(true);
      errorMess += "Vrijeme početka mora biti definirano! \n";
    } else setStartTimeError(false);

    if (endTime == undefined) {
      setEndTimeError(true);
      errorMess += "Vrijeme završetka mora biti definirano! \n";
    } else setEndTimeError(false);

    if (parseInt(maxNumber) <= 0 || maxNumber === "") {
      setMaxNumberError(true);
      errorMess += "Broj ljudi mora biti veći od 0! \n";
    } else setMaxNumberError(false);

    if (errorMess.length === 0) {
      await axios
        .post(
          "/api/gym/" + gymId + "/terms/term",
          {
            startDate,
            startTime,
            endTime,
            maxNumber,
            createdBy: session.data.user.id,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          onClose();
          loadCurrentTerms();
        })
        .catch((error) => {
          console.log(`Došlo je do pogreške! | Poruka: ${error}`);
        });
    } else setErrorMessage(errorMess.substring(0, errorMess.length - 2));
  };

  const loadCurrentTerms = async () => {
    await axios
      .get("/api/gym/" + gymId + `/terms/member?currentDate=${currentDate}`)
      .then((res) => {
        setTerms(JSON.parse(res.data.terms));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const filterTerms = (e) => {
    let input = e.target.value.toString().toLocaleLowerCase();
    if (input == "") loadCurrentTerms();
    else {
      let filteredTerms = terms.filter((term) => {
        return (
          term.korisnik.ime.toLocaleLowerCase().includes(input) ||
          term.korisnik.prezime.toLocaleLowerCase().includes(input)
        );
      });

      setTerms(filteredTerms);
    }
  };

  return (
    <div className="flex flex-col my-5 space-y-4">
      <div className="flex flex-col space-y-1">
        <div className="flex justify-center text-slate-200 font-semibold text-lg select-none">
          Datum
        </div>
        <div className="flex justify-center flex-row space-x-2">
          <ChevronLeftIcon
            className="w-7 fill-slate-400 hover:cursor-pointer hover:fill-white border-2 border-slate-300 border-opacity-40 shadow-lg rounded-sm"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setDate(currentDate.getDate() - 1))
              )
            }
          />
          <p className="text-gray-200 w-min border-2 pt-2 pb-2 pr-5 pl-5 rounded-sm bg-opacity-40 border-slate-300 shadow-lg bg-slate-700 border-opacity-40 select-none">
            {currentDate.getDate() +
              "." +
              (currentDate.getMonth() + 1) +
              "." +
              currentDate.getFullYear() +
              "."}
          </p>
          <ChevronRightIcon
            className="w-7 fill-slate-400 hover:cursor-pointer hover:fill-white border-2 border-slate-300 border-opacity-40 shadow-lg rounded-sm"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setDate(currentDate.getDate() + 1))
              )
            }
          />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row space-x-2 ml-4">
            <ListBulletIcon className="w-6 fill-white" />
            <h2 className="text-white font-semibold text-xl ml-2 h-fit m-auto select-none">
              Termini
            </h2>
          </div>
          <button
            className="mr-4 py-2 px-6 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 font-semibold flex flex-row space-x-2 items-center"
            onClick={() => onOpen()}
          >
            <PlusIcon className="w-5" />
            <h2 className="select-none">Dodaj termin</h2>
          </button>
        </div>
        <hr className="opacity-20" />
        <div className="flex flex-row space-x-2 items-center mr-4 justify-end">
          <MagnifyingGlassIcon className="w-6 fill-white" />
          <input
            type="text"
            name="nameSample"
            id="nameSample"
            placeholder="Ime ili prezime djelatnika..."
            className="rounded-lg p-1 pl-2 bg-slate-100 w-52 text-black"
            onChange={filterTerms}
          />
        </div>
      </div>

      <Modal onClose={onClose} size="lg" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent backgroundColor="#1F2937">
          <ModalHeader color="white">Kreiranje termina</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody color="white">
            <div className="flex flex-col space-y-4">
              <div>
                {errorMessage.length === 0 ? (
                  <></>
                ) : (
                  <Alert status="error" className="rounded-md">
                    <AlertIcon />
                    <div>
                      <AlertTitle className="text-black">
                        Greška kod kreiranja!
                      </AlertTitle>
                      <AlertDescription className="text-black">
                        <div>
                          {errorMessage.split("\n").map((message) => {
                            return (
                              <div key={errorMessage.indexOf(message)}>
                                {message}
                                <br />
                              </div>
                            );
                          })}
                        </div>
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
              </div>
              <div className="flex flex-row space-x-2">
                <div className="my-auto">
                  <label>Datum termina:</label>
                </div>
                <div>
                  <DatePicker
                    showPopperArrow={false}
                    dateFormat="dd.MM.yyyy."
                    selected={startDate}
                    onChange={(date: any) => setStartDate(date)}
                    className={`bg-slate-700 p-1 border-2  border-opacity-40 rounded-md w-32 text-center ${
                      startDateError === true
                        ? "border-red-600"
                        : "border-white"
                    }`}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row space-x-2">
                  <div className="my-auto">
                    <label>Vrijeme početka:</label>
                  </div>
                  <div>
                    <DatePicker
                      selected={startTime}
                      onChange={(time: any) => setStartTime(time)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      timeFormat="HH:mm"
                      className={`bg-slate-700 p-1 border-2  border-opacity-40 rounded-md w-20 text-center ${
                        startTimeError === true
                          ? "border-red-600"
                          : "border-white"
                      } `}
                    />
                  </div>
                </div>
                <div className="flex flex-row space-x-2">
                  <div className="my-auto">
                    <label>Vrijeme završetka:</label>
                  </div>
                  <div>
                    <DatePicker
                      selected={endTime}
                      onChange={(time: any) => setEndTime(time)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      timeFormat="HH:mm"
                      className={`bg-slate-700 p-1 border-2  border-opacity-40 rounded-md w-20 text-center ${
                        endTimeError === true
                          ? "border-red-600"
                          : "border-white"
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row space-x-2">
                <div className="my-auto">
                  <label>Maksimalan broj ljudi:</label>
                </div>
                <div>
                  <input
                    value={maxNumber}
                    onChange={(value) => setMaxNumber(value.target.value)}
                    type="number"
                    name="maxPeople"
                    id="maxPeople"
                    className={`bg-slate-700 p-1 border-2  border-opacity-40 rounded-md w-20 text-center ${
                      maxNumberError === true
                        ? "border-red-600"
                        : "border-white"
                    }`}
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
            <Button colorScheme="whatsapp" ml={3} onClick={handleSaveClick}>
              Spremi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex flex-col space-y-4 mx-28">
        {terms.length == 0 ? (
          <div className="text-white text-center">
            Za ovaj dan nema definiranih termina!
          </div>
        ) : (
          terms.map((term) => {
            return (
              <TermInfo
                term={term}
                loadCurrentTerms={loadCurrentTerms}
                key={term.id}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
