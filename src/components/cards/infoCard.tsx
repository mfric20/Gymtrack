import { useRouter } from "next/router";

export default function InfoCard({
  tekst,
  link,
  broj,
}: {
  tekst: string;
  link: string;
  broj: number;
}) {
  const router = useRouter();

  return (
    <div
      className="flex flex-col space-y-6 text-white border-2 border-slate-500 shadow-lg border-opacity-10
     p-4 rounded-md w-full hover:shadow-2xl"
    >
      <div className="text-center h-full">{tekst}</div>
      <p className="text-center text-3xl h-full">{broj}</p>
      <div className="h-full mx-auto">
        <button
          className="bg-green-600 mt-auto mb-auto text-white p-2 pr-4 pl-4 rounded-lg hover:bg-green-500 h-10 shadow-md w-48 text-sm font-semibold"
          onClick={() => router.push("/user/" + link)}
        >
          Pregled
        </button>
      </div>
    </div>
  );
}
