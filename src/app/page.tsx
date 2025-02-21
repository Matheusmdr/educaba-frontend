import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { UserResponse } from "@/types/user";
import { ArrowRight, Building2 } from "lucide-react";
import { redirect } from "next/navigation";

async function getUser(accessToken?: string): Promise<UserResponse | null> {
  if (!accessToken) return null;

  const res = await fetch(`${env.NEXT_PUBLIC_API_HOST}/api/user/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "force-cache"
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function Page() {
  const session = await auth();

  const user = await getUser(session?.user?.token);

  if (user?.organization) {
    return redirect(`/${user.organization.id}`);
  }

  


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            No Organization
          </h1>
          <p className="text-xl text-gray-500">
            You&apos;re not part of any organization yet.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-32 h-32 bg-blue-100 rounded-full opacity-70 animate-pulse"></span>
          </div>
          <Building2 className="relative w-24 h-24 mx-auto text-blue-500" />
        </div>

        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-900">{user?.name}</p>
          <p className="text-gray-600">
            To access the full features of our platform, you&apos;ll need to join or
            create an organization.
          </p>
        </div>

        <Button className="w-full py-6 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
          Request Organization Access
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
