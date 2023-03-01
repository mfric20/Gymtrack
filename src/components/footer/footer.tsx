import { EnvelopeIcon } from "@heroicons/react/24/solid";

export default function Footer() {
  return (
    <div className="w-screen h-32 bg-slate-900 text-center flex flex-col justify-center bg-opacity-70">
      <p className="text-white text-xl">&copy; GYMTRACK 2023. </p>
      <div className="flex flex-row justify-center space-x-2">
        <a href="mailto:matijafric@gmail.com">
          <EnvelopeIcon className="w-6 h-6 fill-slate-100" />
        </a>
        <p className="text-white text-lg">
          Kontakt:{" "}
          <a
            href="mailto:matijafric@gmail.com"
            className="hover:underline
          "
          >
            matijafric@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
