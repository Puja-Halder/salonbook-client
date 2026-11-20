
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserRound,
  CircleUserRound,
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
  const [mounted, setMounted] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  const dashboardLink =
    user?.role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer";

  const profileImage = user?.image;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

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
    } catch {
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
          {!mounted || isPending ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-pink-200 bg-white py-1.5 pl-2 pr-3 text-sm font-semibold text-[#321b2b] transition hover:border-pink-400 hover:bg-pink-50"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-pink-200 bg-pink-100 text-sm font-bold text-pink-700">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={user.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>

                <span className="max-w-32 truncate">{user.name}</span>

                <ChevronDown
                  size={16}
                  className={`transition ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-pink-100 bg-white py-2 shadow-xl shadow-pink-100/60">
                  <div className="flex items-center gap-3 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white px-4 py-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-pink-200 bg-pink-100 text-lg font-bold text-pink-700">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={user.name || "Profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        userInitial
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#321b2b]">
                        {user.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#806b78]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#765b69] transition hover:bg-pink-50 hover:text-pink-600"
                    >
                      <CircleUserRound size={18} />
                      View Account
                    </Link>

                    <Link
                      href={dashboardLink}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#765b69] transition hover:bg-pink-50 hover:text-pink-600"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <div className="my-2 border-t border-pink-100" />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
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
