
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Scissors, CalendarDays, Users, CreditCard } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [checking, setChecking] = useState(true);

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

    if (session.user.role !== "admin") {
      router.replace("/dashboard/customer");
      return;
    }

    setChecking(false);
  }, [session, isPending, router]);

  if (isPending || checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffafd]">
        <p className="text-[#765b69]">Checking admin access...</p>
      </main>
    );
  }

  const dashboardItems = [
    {
      title: "Manage Services",
      description: "Add, edit, and manage salon services.",
      icon: Scissors,
      href: "/dashboard/admin/services",
    },
    {
      title: "Appointments",
      description: "Review and manage customer appointments.",
      icon: CalendarDays,
      href: "/dashboard/admin/appointments",
    },
    {
      title: "Customers",
      description: "View and manage customer accounts.",
      icon: Users,
      href: "/dashboard/admin/customers",
    },
    {
      title: "Transactions",
      description: "Review payments and transactions.",
      icon: CreditCard,
      href: "/dashboard/admin/transactions",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fffafd] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={30} className="text-pink-600" />
              <h1 className="text-3xl font-bold text-[#321b2b]">
                Admin Dashboard
              </h1>
            </div>

            <p className="mt-3 text-[#806b78]">
              Welcome back, {session?.user?.name}. Manage your salon from here.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
