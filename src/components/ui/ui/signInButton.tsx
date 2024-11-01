"use client";

import { signIn } from "next-auth/react";
import { Button } from "../button";
import GoogleLogo from "./googleLogo";

export const SignInButton = () => (
  <Button
    variant="ghost"
    className="rounded-xl border flex items-center"
    onClick={() => signIn("google")}
  >
    <GoogleLogo />
    <span className="ml-2">Sign In</span>
  </Button>
);

export default SignInButton;
