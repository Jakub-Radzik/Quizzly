"use client";

import { useRouter } from "next/navigation"
import { FC } from "react";

interface SubscriptionButtonProps {
  plan: string;
}

export const SubscriptionButton: FC<SubscriptionButtonProps> = ({ plan }) => {
  const router = useRouter();

  const handleClick = async () => {
    try {
      router.push("/billing");
    } catch (error) {
      console.error("Failed to load:", error);
    }
  };

  return (
    <button className="p-[3px] relative" onClick={handleClick}>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
      <div className="px-4 py-1  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
        Plan: <b>{plan}</b>
      </div>
    </button>
  );
}
