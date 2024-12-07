import { auth, signOut } from "@/auth";
import { Button } from "../button";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavMenu } from "@/components/ui/NavMenu";
import { SubscriptionButton } from "@/components/ui/ui/subscriptionButton";
import { SignOutButton } from "./signoutButton";
import { APP_NAME } from "@/common/constants";
import { SignInButton } from "./signInButton";
import QuizzlyLogo from "./quizzlyLogo";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { SubscriptionsMapping, users } from "@/db/schema";

const Header = async () => {
  const session = await auth();

  var plan;
  
  if (!session || !session.user || !session.user.id) {
    plan = null;
  } else {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });
    const subscription = user?.subscription || "free";
    plan = SubscriptionsMapping[subscription];
  }

  const handleSignOut = async () => {
    "use server";
    await signOut();
  };

  return (
    <header>
      <nav className="px-4 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex">
            <QuizzlyLogo />
            <h1 className="text-3xl font-bold pl-4 pt-1">{APP_NAME}</h1>
          </div>
          {session?.user ? (
            <div className="flex items-center gap-4">
              {session.user.name && session.user.image && plan && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <NavMenu plan={plan} />
                </DropdownMenu>
              )}
              {plan && <SubscriptionButton plan={plan} />}
              <SignOutButton handleSignOut={handleSignOut} />
            </div>
          ) : (
            <Link href="#">
              <SignInButton />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export { Header };
