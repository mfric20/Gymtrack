import axios from "axios";
import Image from "next/image";
import ApplicationInfo from "../cards/applicationInfo";
import MemberInfo from "../cards/memberInfo";
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
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { teretana_info } from "@/types/gym";
import {
  InformationCircleIcon,
  ListBulletIcon,
  UserGroupIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { korisnik } from "@prisma/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function WorkerInfo() {
  const [selectedTab, setSelectedTab] = useState<string>("info");
  const [gymInfo, setGymInfo] = useState<teretana_info>();
  const [members, setMembers] = useState<Array<korisnik>>([]);
  const [applicationMembers, setApplicationMembers] = useState<Array<korisnik>>(
    []
  );
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
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

  const router = useRouter();
  const gymId = router.query.id;
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadGymInfo();
  }, []);

  useEffect(() => {
    if (selectedTab == "clanovi") {
      loadGymMembers("");
      loadGymApplication();
    }
  }, [selectedTab]);

  const loadGymInfo = async () => {
    await axios
      .get("/api/gym/" + gymId + "/getInfo")
      .then((res) => {
        setGymInfo(JSON.parse(res.data.teretana));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const loadGymMembers = async (searchSample: string) => {
    await axios
      .get(
        "/api/gym/" + gymId + "/members/members?searchSample=" + searchSample
      )
      .then((res) => {
        setMembers(JSON.parse(res.data.members));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const loadGymApplication = async () => {
    await axios
      .get("/api/gym/" + gymId + "/members/applicationMembers")
      .then((res) => {
        setApplicationMembers(JSON.parse(res.data.members));
      })
      .catch((error) => {
        console.log(`Došlo je do pogreške! | Poruka: ${error}`);
      });
  };

  const handleSaveClick = async () => {
    console.log(startDate);
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
      //Handle submit
      onClose();
    } else setErrorMessage(errorMess.substring(0, errorMess.length - 2));
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center">
        <div
          className={`border-2 w-48 border-r-0 rounded-r-none p-2 text-slate-100 rounded-md border-slate-300 shadow-lg border-opacity-50  text-center hover:cursor-pointer ${
            selectedTab === "info"
              ? "bg-green-700 font-semibold"
              : "bg-slate-700 hover:bg-slate-800 "
          }`}
          onClick={() => setSelectedTab("info")}
        >
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <InformationCircleIcon className="w-6" />
            <span>Opće informacije</span>
          </div>
        </div>
        <div
          className={`border-2 p-2 w-48 text-center text-slate-100 border-r-0 border-slate-300 shadow-lg border-opacity-50 hover:cursor-pointer ${
            selectedTab === "termini"
              ? "bg-green-700 font-semibold"
              : "bg-slate-700 hover:bg-slate-800 "
          }`}
          onClick={() => setSelectedTab("termini")}
        >
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <ListBulletIcon className="w-6" />
            <span>Termini</span>
          </div>
        </div>
        <div
          className={`border-2 p-2 w-48 text-center text-slate-100 rounded-r-md border-slate-300 shadow-lg border-opacity-50 hover:cursor-pointer ${
            selectedTab === "clanovi"
              ? "bg-green-700 font-semibold"
              : "bg-slate-700 hover:bg-slate-800 "
          }`}
          onClick={() => setSelectedTab("clanovi")}
        >
          <div className="flex flex-row justify-center space-x-2 drop-shadow-lg">
            <UserGroupIcon className="w-6" />
            <span>Članovi</span>
          </div>
        </div>
      </div>
      {selectedTab == "info" && gymInfo ? (
        <div className="flex flex-row space-x-4 pl-[10%] pr-[10%] pb-[5%] mt-10">
          <div className="w-full">
            <Image
              alt="slika_teretane"
              src={gymInfo?.slika}
              width={300}
              height={300}
              className="rounded-md shadow-lg mx-auto"
            />
          </div>
          <div className="w-full flex flex-col justify-center pt-6 pb-10 space-y-4">
            <div>
              <label className="text-white text-lg">Naziv:</label>
              <p className="ml-4 text-gray-300">{gymInfo?.naziv}</p>
            </div>
            <div>
              <label className="text-white text-lg">Adresa:</label>
              <p className="ml-4 text-gray-300">{gymInfo?.adresa}</p>
            </div>
            <div>
              <label className="text-white text-lg">Vaša uloga:</label>
              <p className="ml-4 text-gray-300">Djelatnik</p>
            </div>
          </div>
        </div>
      ) : selectedTab == "termini" ? (
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
                className="mr-4 py-2 px-6 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500 font-semibold flex flex-row space-x-2 items-center"
                onClick={() => onOpen()}
              >
                <PlusIcon className="w-5" />
                <h2 className="select-none">Dodaj termin</h2>
              </button>
            </div>
            <hr className="opacity-20" />
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
        </div>
      ) : (
        <div className="flex flex-col mt-6 space-y-10">
          <div>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row space-x-2 ml-4">
                <UserPlusIcon className="w-6 fill-white" />
                <h2 className="text-white font-semibold text-xl ml-2">
                  Zahtjevi za učlanjivanje
                </h2>
              </div>
              <hr className="opacity-20" />
              <div className="flex flex-col space-y-2 px-[10%] pt-3">
                {applicationMembers.length === 0 ? (
                  <div className="text-center text-gray-300">
                    Trenutno nema novih zahtjeva za učlanjivanje!
                  </div>
                ) : (
                  applicationMembers.map((user) => {
                    return (
                      <ApplicationInfo
                        user={user}
                        loadGymMembers={loadGymMembers}
                        loadGymApplications={loadGymApplication}
                        key={user.id}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-2 ml-4">
                  <UserGroupIcon className="w-6 fill-white" />
                  <h2 className="text-white font-semibold text-xl ml-2">
                    Članovi
                  </h2>
                </div>
                <div className="flex flex-row space-x-2 items-center mr-4">
                  <MagnifyingGlassIcon className="w-6 fill-white" />
                  <input
                    type="text"
                    name="nameSample"
                    id="nameSample"
                    placeholder="Unesite ime ili prezime..."
                    className="rounded-lg p-1 pl-2 bg-slate-100 w-52 text-black"
                    onChange={(e) => loadGymMembers(e.target.value)}
                  />
                </div>
              </div>
              <hr className="opacity-20" />
              <div className="flex flex-col space-y-2 px-[10%] pt-3">
                {members.length === 0 ? (
                  <div className="text-center text-gray-300">
                    Trenutno nema učlanjenih korisnika!
                  </div>
                ) : (
                  members.map((user) => {
                    return (
                      <MemberInfo
                        user={user}
                        loadGymMembers={loadGymMembers}
                        key={user.id}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
