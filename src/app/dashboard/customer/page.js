
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, CreditCard, Scissors } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";

export default function CustomerDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/signin");
      return;
    }

    if (session.user.isBlocked) {
      router.replace("/");
      return;
    }

    if (session.user.role === "admin") {
      router.replace("/dashboard/admin");
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user || session.user.role === "admin" || session.user.isBlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffafd]">
        <p className="text-[#765b69]">Checking your account...</p>
      </main>
    );
  }

  const dashboardItems = [
    {
      title: "Browse Services",
      description: "Explore salon treatments and find the right service.",
      icon: Scissors,
      href: "/services",
    },
    {
      title: "My Appointments",
      description: "View your appointment requests and their status.",
      icon: CalendarDays,
      href: "/dashboard/customer/appointments",
    },
    {
      title: "Payment History",
      description: "Review your previous payments and transactions.",
      icon: CreditCard,
      href: "/dashboard/customer/payments",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fffafd] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#321b2b]">
              My Dashboard
            </h1>

            <p className="mt-3 text-[#806b78]">
              Welcome, {session.user.name}! Manage your salon appointments here.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-2xl border border-pink-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <Icon size={24} />
                  </div>

                  <h2 className="text-lg font-bold text-[#321b2b]">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#806b78]">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

