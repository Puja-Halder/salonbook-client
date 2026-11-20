
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getServices } from "@/lib/api";

export default function Hero() {
  const { data: session, isPending } = authClient.useSession();
  const [firstServiceId, setFirstServiceId] = useState("");

  const user = session?.user;

  useEffect(() => {
    let active = true;

    const loadFirstService = async () => {
      try {
        const result = await getServices({ limit: 1 });

        if (active && result.services?.length) {
          setFirstServiceId(result.services[0]._id);
        }
      } catch (error) {
        console.error("Failed to load a service:", error.message);
      }
    };

    loadFirstService();

    return () => {
      active = false;
    };
  }, []);

  const getBookingLink = () => {
    if (!user) return "/signin";
    if (user.isBlocked) return "/";
    if (user.role === "admin") return "/dashboard/admin";

    return firstServiceId ? `/services/${firstServiceId}` : "/services";
  };

  return (
    <section className="overflow-hidden bg-[#fff0f5]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24 lg:px-10">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">
            BEAUTY • CARE • CONFIDENCE
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-[1.15] tracking-tight text-[#321b2b] sm:text-6xl lg:text-7xl">
            Feel Beautiful.
            <br />
            <span className="text-pink-600">Feel Yourself.</span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-[#765b69]">
            Take a moment for yourself. Discover professional beauty
            treatments, personalized care, and a salon experience
            designed around you.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={getBookingLink()}
              aria-disabled={
                isPending ||
                (user?.role === "customer" && !firstServiceId)
              }
              className="rounded-full bg-pink-600 px-8 py-4 font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-1 hover:bg-pink-700"
            >
              Book Appointment →
            </Link>

            <a
              href="#services"
              className="rounded-full border border-pink-300 px-8 py-4 font-semibold text-pink-700 transition hover:bg-white"
            >
              Explore Services
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-[#806b78]">
            <span className="text-xl text-pink-600">✿</span>
            Your beauty deserves the best care.
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-pink-200/70 blur-3xl" />

          <div className="relative overflow-hidden rounded-[180px_180px_30px_30px] border-[10px] border-white shadow-2xl shadow-pink-200/60">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85"
              alt="Beauty portrait"
              className="h-[430px] w-full object-cover sm:h-[540px]"
            />
          </div>

          <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white px-6 py-4 shadow-xl">
            <p className="font-bold text-[#321b2b]">
              A moment for you
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Relax. Refresh. Glow.
            </p>
          </div>

          <div className="absolute -right-4 top-16 flex h-16 w-16 items-center justify-center rounded-full bg-pink-600 text-3xl text-white shadow-lg">
            ✿
          </div>
        </div>
      </div>
    </section>
  );
}
