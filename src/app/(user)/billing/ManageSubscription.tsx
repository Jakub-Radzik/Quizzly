"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const ManageSubscription = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const redirectToCustomerPortal = async () => {
    setLoading(true);

    try {
      const { url } = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      router.push(url.url);
    } catch (error) {
      setLoading(false);
      console.log("subscribe button error", error);
    }
  };

  return (
    <ShimmerButton className="relative z-20 mt-8" disabled={loading} onClick={redirectToCustomerPortal} >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin z-20" />
          poczekaj...
        </>
      ) : (
        "Zarządzaj subskrybcją"
      )}
    </ShimmerButton>
  );
};

export default ManageSubscription;
