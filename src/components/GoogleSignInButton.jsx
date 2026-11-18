
"use client";

import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
    >
      <span>G</span>
      Continue with Google
    </button>
  );
}
