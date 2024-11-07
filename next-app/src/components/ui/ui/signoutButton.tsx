"use client";

import { LogOut } from "lucide-react";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface SignOutButtonProps {
  handleSignOut: () => Promise<void>;
}

const SignOutButton: FC<SignOutButtonProps> = ({ handleSignOut }) => {
  const router = useRouter();

  const handleClick = async () => {
    try {
      await handleSignOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <Button onClick={handleClick} variant="ghost">
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
};

export { SignOutButton };
