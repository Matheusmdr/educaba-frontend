"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
}
