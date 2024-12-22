import React from "react";
import { auth, signIn } from "@/auth";
import { db } from "@/db";
import { Subscriptions, SubscriptionsMapping, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import ManageSubscription from "./ManageSubscription";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { CardTitle } from "@/components/ui/card";

const page = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    signIn();
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  const plan = (user?.subscription || "free") as unknown as Subscriptions;
  const planName = SubscriptionsMapping[plan];

  return (
    <div className="flex flex-col items-center justify-center my-6 py-6">
      <CardSpotlight className="h-92 w-96 mt-4 ">
        <CardTitle className="text-2xl mb-3 relative z-20">
          Szczegóły subskrybcji
        </CardTitle>
        <div className="text-neutral-200 mt-4 relative z-20">
          Obecnie korzystasz z planu <b>{planName}</b>:
          <ul className="list-none mt-2">
            <Step title="Przeglądanie quizów" positive={true} />
            <Step title="Uczestnictwo w quizach" positive={true} />
            <Step title="Tworzenie AI quizów" positive={plan !== "free"} />
            <Step title="Eksport do Moodle'a" positive={plan === "deluxe"} />
          </ul>
        </div>
        <ManageSubscription />
      </CardSpotlight>
    </div>
  );
};

const Step = ({ title, positive }: { title: string; positive: boolean }) => {
  return (
    <li className="flex gap-2 items-start">
      {positive ? "✓" : "✗"}
      <p className="text-white">{title}</p>
    </li>
  );
};

export default page;
