import { auth, signOut } from "@/auth";
import { Button } from "../button";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; // Ensure this import path is correct
import { NavMenu } from "@/components/ui/NavMenu";
// import Link from "next/link";

// function SignOut() {
//     return (
//         <form action={async () =>
//         'use server';
//     await signOut()
//         }}>
//         <Button type = "submit" variant="ghost">Sign Out</Button>
//         </form>
//     )
// } this entire block breaks the code. lines 21-24 and 56-59 works better. need to fix?

const Header = async () => {
  const session = await auth();
  console.log(session);

  const handleSignOut = async () => {
    "use server";
    await signOut();
  };

  return (
    <header>
      <nav className="px-4 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <h1 className="text-3xl font-bold">Quiz AI</h1>
          <div className="flex gap-2">
            <Link
              className="underline"
              href="/quiz"
            >
              Sample Quiz
            </Link>
            <Link
              className="underline"
              href="/quiz/new"
            >
              New Quiz
            </Link>
          </div>
          {session?.user ? (
            <div className="flex items-center gap-4">
              {session.user.name && session.user.image && (
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
                  {/* <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleSignOut}>
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent> */}
                  <NavMenu />
                </DropdownMenu>
              )}
              <form action={handleSignOut}>
                <Button
                  type="submit"
                  variant="ghost"
                >
                  Sign Out
                </Button>
                {/* there is additional styling for this button around 2:43 of the video. come back to this after other things are resolved */}
              </form>
            </div>
          ) : (
            <Link href="/api/auth/signin">
              <Button
                variant="link"
                className="rounded-xl border"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export { Header };
