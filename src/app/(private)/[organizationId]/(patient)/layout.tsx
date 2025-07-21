import Image from "next/image";
import EducabaLogo from "@/assets/educaba-logo.png";
import { getUser } from "@/server/actions/user";
import { auth } from "@/server/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/signout-button";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const userData = await getUser(session?.user.token);

  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col items-center bg-[#fafafa]">
        <header className="sticky top-0 z-50 h-16 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 flex justify-center items-center py-4">
          <div className="container flex items-center justify-between px-6 h-full">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Image
                  src={EducabaLogo}
                  alt="Logo Educaba"
                  className="max-w-52"
                />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 px-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>GA</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium">{userData?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {userData?.email}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        {children}
      </div>
    </SessionProvider>
  );
}
