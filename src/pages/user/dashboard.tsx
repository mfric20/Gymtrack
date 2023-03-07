import { useSession } from "next-auth/react";
import LoggedInNavigation from "@/components/navigation/loggedInNavigation";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function dashboard() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
  }, [session.status]);

  if (session.status === "authenticated") {
    return (
      <div className="bg-gradient-to-tr from-slate-700 to-slate-900 h-screen flex flex-col justify-between">
        <LoggedInNavigation />
      </div>
    );
  }
}
