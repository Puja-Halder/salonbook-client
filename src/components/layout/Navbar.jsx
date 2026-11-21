
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  CircleUserRound,
  Menu,
  X,
  Store,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "Salon Details", href: "/salon-details" },
];

export default function Navbar() {
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("Unable to sign out. Please try again.");
        return;
      }

      setDropdownOpen(false);
      setMobileMenuOpen(false);
      toast.success("Signed out successfully!");
      router.refresh();
      router.push("/");
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto max-w-7xl px-6 py-4 lg:px-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="text-2xl font-bold tracking-tight text-[#321b2b]"
          >
            Salon<span className="text-pink-600">Book.</span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
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
              <span className="hidden text-sm text-gray-400 md:inline">
                Loading...
              </span>
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

                  <span className="hidden max-w-32 truncate sm:inline">
                    {user.name}
                  </span>

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
                        <p className="mt-1 text-xs font-semibold capitalize text-pink-600">
                          {user.role || "Customer"}
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
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/signin"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#765b69] transition hover:text-pink-600"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="rounded-full bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setDropdownOpen(false);
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#321b2b] transition hover:bg-pink-50 lg:hidden"
            >
              {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 border-t border-pink-100 pt-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[#765b69] transition hover:bg-pink-50 hover:text-pink-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {mounted && !isPending && user && (
              <div className="mt-3 flex flex-col gap-1 border-t border-pink-100 pt-3">
                <Link
                  href="/account"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[#765b69] transition hover:bg-pink-50 hover:text-pink-600"
                >
                  My Account
                </Link>

                <Link
                  href={dashboardLink}
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[#765b69] transition hover:bg-pink-50 hover:text-pink-600"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}

            {mounted && !isPending && !user && (
              <div className="mt-3 flex flex-col gap-2 border-t border-pink-100 pt-4">
                <Link
                  href="/signin"
                  onClick={closeMobileMenu}
                  className="rounded-full border border-pink-200 px-5 py-2.5 text-center text-sm font-semibold text-[#765b69] transition hover:bg-pink-50"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="rounded-full bg-pink-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
