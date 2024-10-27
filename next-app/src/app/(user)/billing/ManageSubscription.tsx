"use client";
import { useState } from "react";
import { getStripe } from "@/lib/stripe-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  userId?: string;
  price: string;
};

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
    <Button disabled={loading} onClick={redirectToCustomerPortal}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </>
      ) : (
        "change your subscription"
      )}
    </Button>
  );
};

export default ManageSubscription;
