import { auth } from "@/auth";
import UploadDoc from "../UploadDoc";
import { SparklesCore } from "@/components/ui/sparkles";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { SubscriptionsMapping, users } from "@/db/schema";
import ManageSubscription from "@/app/(user)/billing/ManageSubscription";

const page = async () => {
  const session = await auth();

  const userId = session?.user?.id;
  var plan;
  
  if (!userId) {
    plan = null;
  } else {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    const subscription = user?.subscription || "free";
    plan = SubscriptionsMapping[subscription];
  }

  return (
    <div className="h-[100vh] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={10}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="flex flex-col flex-1 z-50">
        <main className="py-11 flex flex-col text-center gap-4 items-center flex-1 mt-24">
          {
            userId ? (
              plan !== "Basic" ?
              <UploadDoc userId={userId}/>
              : (
                  <div>
                    <p className="text-3xl">Ulepsz swój plan, aby generować quizy!</p>
                    <ManageSubscription />
                  </div>
                )
            ): <p>Użytkownik nie znaleziony</p>
          }
        </main>
      </div>
    </div>
  );
};

export default page;
