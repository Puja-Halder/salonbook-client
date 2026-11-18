
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("Unable to sign out. Please try again.");
        return;
      }

      toast.success("Signed out successfully!");
      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-[#321b2b]"
        >
          Salon<span className="text-pink-600">Book.</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#765b69] transition hover:text-pink-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isPending ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : user ? (
            <>
              <span className="hidden text-sm font-semibold text-[#321b2b] sm:inline">
                Hello, {user.name}
              </span>

              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-pink-300 px-5 py-2.5 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[#765b69] transition hover:text-pink-600 sm:inline-flex"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
