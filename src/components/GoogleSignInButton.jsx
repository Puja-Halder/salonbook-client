
"use client";

import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/signin",
      });
    } catch (error) {
      toast.error(error.message || "Google sign-in failed");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full"
    >
      Continue with Google
    </button>
  );
}
