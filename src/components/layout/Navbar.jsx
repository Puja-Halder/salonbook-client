
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const dashboardLink =
    user?.role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer";

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("Unable to sign out. Please try again.");
        return;
      }

      setDropdownOpen(false);
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#321b2b] transition hover:bg-pink-50"
              >
                <UserRound size={17} />
                <span className="max-w-32 truncate">{user.name}</span>
                <ChevronDown
                  size={16}
                  className={`transition ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-xl border border-pink-100 bg-white py-2 shadow-xl">
                  <div className="border-b border-pink-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-[#321b2b]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#806b78]">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href={dashboardLink}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#765b69] transition hover:bg-pink-50 hover:text-pink-600"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
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
