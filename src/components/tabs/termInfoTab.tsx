import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router";
import {
  InformationCircleIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { termin } from "@prisma/client";
import { useState, useEffect } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";

export default function TermInfoTab({
  term,
  reloadCurrentTerms,
}: {
  term: termin;
  reloadCurrentTerms: () => void;
}) {
  const [toggleEdit, setToggleEdit] = useState<Boolean>(false);
  //Form
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [maxNumber, setMaxNumber] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  //For error highlight
  const [startDateError, setStartDateError] = useState<Boolean>(false);
  const [startTimeError, setStartTimeError] = useState<Boolean>(false);
  const [endTimeError, setEndTimeError] = useState<Boolean>(false);
  const [maxNumberError, setMaxNumberError] = useState<Boolean>(false);

  const router = useRouter();
  const gymId = router.query.id;

  useEffect(() => {
    //Setting date from string
    let startDateObject = new Date();
    const datum = term.datum.split(".");
    startDateObject.setDate(parseInt(datum[0]));
    startDateObject.setMonth(parseInt(datum[1]) - 1);
    setStartDate(startDateObject);
    //Setting max number
    setMaxNumber(term.maksimalan_broj.toString());
    //Setting start time from string
    let startTimeObject = new Date();
    const pocetak = term.pocetak.split(":");
    startTimeObject.setHours(parseInt(pocetak[0]));
    startTimeObject.setMinutes(parseInt(pocetak[1]));
    startTimeObject.setSeconds(0);
    setStartTime(startTimeObject);
    //Setting end time from string
    let endTimeObject = new Date();
    const kraj = term.kraj.split(":");
    endTimeObject.setHours(parseInt(kraj[0]));
    endTimeObject.setMinutes(parseInt(kraj[1]));
    endTimeObject.setSeconds(0);
    setEndTime(endTimeObject);
  }, []);

  const handleSaveEdit = async () => {
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
          "/api/gym/" + gymId + "/terms/worker",
          {
            startDate,
            startTime,
            endTime,
            maxNumber,
            termId: term.id,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          reloadCurrentTerms();
        })
        .catch((error) => {
          console.log(`Došlo je do pogreške! | Poruka: ${error}`);
        });
    } else setErrorMessage(errorMess.substring(0, errorMess.length - 2));
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-2 ml-4">
          <InformationCircleIcon className="w-6 fill-white" />
          <h2 className="text-white font-semibold text-xl ml-2 h-fit m-auto select-none">
            Detalji
          </h2>
        </div>
        {toggleEdit === false ? (
          <button
            className="mr-4 py-2 px-6 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 font-semibold flex flex-row space-x-2 items-center"
            onClick={() => setToggleEdit(true)}
          >
            <PencilIcon className="w-5" />
            <h2 className="select-none">Uredi termin</h2>
          </button>
        ) : (
          <></>
        )}
      </div>
      <hr className="opacity-20" />
      {toggleEdit === false ? (
        <div className="mx-10 flex flex-col space-y-4 py-5">
          <div className="flex flex-row justify-center space-x-8 w-full">
            <div className="text-lg flex flex-row space-x-2 w-full justify-end">
              <label>Datum:</label>
              <p className="text-gray-300">{term.datum}</p>
            </div>
            <div className="text-lg flex flex-row space-x-2 w-full justify-start">
              <label>Maksimalano ljudi:</label>
              <p className="text-gray-300">{term.maksimalan_broj}</p>
            </div>
          </div>
          <div className="flex flex-row justify-center space-x-8 w-full">
            <div className="text-lg flex flex-row space-x-2 w-full justify-end">
              <label>Vrijeme početka:</label>
              <p className="text-gray-300">{term.pocetak}</p>
            </div>
            <div className="text-lg flex flex-row space-x-2 w-full justify-start">
              <label>Vrijeme završetka:</label>
              <p className="text-gray-300">{term.kraj}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-10 flex flex-col space-y-4 py-5">
          {errorMessage.length > 0 ? (
            <Alert status="error" className="rounded-md">
              <AlertIcon />
              <div>
                <AlertTitle className="text-black">
                  Greška kod izmjene!
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
          ) : (
            <></>
          )}

          <div className="flex flex-row space-x-8 w-full">
            <div className="text-lg flex flex-row space-x-2 w-full justify-end">
              <label className="my-auto">Datum:</label>
              <div>
                <DatePicker
                  showPopperArrow={false}
                  dateFormat="dd.MM.yyyy."
                  selected={startDate}
                  onChange={(date: any) => setStartDate(date)}
                  className={`bg-slate-700 p-1 border-2  border-opacity-40 rounded-md w-32 text-center ${
                    startDateError === true ? "border-red-600" : "border-white"
                  }`}
                />
              </div>
            </div>
            <div className="text-lg flex flex-row space-x-2 w-full justify-start">
              <label className="my-auto">Maksimalano ljudi:</label>
              <div>
                <input
                  value={maxNumber}
                  onChange={(value) => setMaxNumber(value.target.value)}
                  type="number"
                  name="maxPeople"
                  id="maxPeople"
                  className={`bg-slate-700 p-1 border-2  border-opacity-40 rounded-md w-20 text-center ${
                    maxNumberError === true ? "border-red-600" : "border-white"
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center space-x-8 w-full">
            <div className="text-lg flex flex-row space-x-2 w-full justify-end">
              <label className="my-auto">Vrijeme početka:</label>
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
                    startTimeError === true ? "border-red-600" : "border-white"
                  } `}
                />
              </div>
            </div>
            <div className="text-lg flex flex-row space-x-2 w-full justify-start">
              <label className="my-auto mr-[5px]">Vrijeme završetka:</label>
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
                    endTimeError === true ? "border-red-600" : "border-white"
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center space-x-4 pt-4">
            <button
              className="py-2 px-6 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 font-semibold flex flex-row space-x-2 items-center"
              onClick={() => setToggleEdit(false)}
            >
              <XMarkIcon className="w-5" />
              <h2 className="select-none">Odustani</h2>
            </button>
            <button
              className="py-2 px-6 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 font-semibold flex flex-row space-x-2 items-center"
              onClick={handleSaveEdit}
            >
              <CheckIcon className="w-5" />
              <h2 className="select-none">Spremi</h2>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
