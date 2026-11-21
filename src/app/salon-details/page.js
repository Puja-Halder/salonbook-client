
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Heart,
  ShieldCheck,
  CalendarDays,
  Flower2,
  Star,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const openingHours = [
  { day: "Monday", time: "9:00 AM – 8:00 PM" },
  { day: "Tuesday", time: "9:00 AM – 8:00 PM" },
  { day: "Wednesday", time: "9:00 AM – 8:00 PM" },
  { day: "Thursday", time: "9:00 AM – 8:00 PM" },
  { day: "Friday", time: "9:00 AM – 8:00 PM" },
  { day: "Saturday", time: "10:00 AM – 9:00 PM" },
  { day: "Sunday", time: "10:00 AM – 6:00 PM" },
];

const facilities = [
  {
    icon: Sparkles,
    title: "Professional Services",
    description: "Enjoy a range of beauty and personal care services.",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description: "Every appointment is designed around your preferences.",
  },
  {
    icon: ShieldCheck,
    title: "Comfort & Hygiene",
    description: "We value a clean, comfortable, and welcoming environment.",
  },
  {
    icon: CalendarDays,
    title: "Easy Appointments",
    description: "Book your preferred salon service online with ease.",
  },
];

export default function SalonDetailsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff5f8]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f6c9da] border-t-[#d94683]"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-[#fff7fa] text-[#512d40]">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ffe4ed] via-[#fbd0df] to-[#f8b9d0] px-6 py-28 text-center">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/30 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#e879a5]/20 blur-3xl"></div>

          <div className="relative mx-auto max-w-4xl">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full border border-white/70 bg-white/60 p-4 shadow-sm">
                <Flower2 className="h-9 w-9 text-[#c43d75]" />
              </div>
            </div>

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b8326b]">
              Welcome to SalonBook
            </p>

            <h1 className="text-4xl font-bold leading-tight text-[#702b4c] md:text-6xl">
              A Little Beauty,
              <br />
              A Lot of Happiness
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#81546a] md:text-lg">
              Your special space for beauty, relaxation, and self-care.
              Discover everything that makes your salon experience memorable.
            </p>

            <button
              onClick={() => router.push("/services")}
              className="mt-9 rounded-full bg-[#d94683] px-9 py-4 font-semibold text-white shadow-lg shadow-[#d94683]/20 transition hover:-translate-y-1 hover:bg-[#bd326e]"
            >
              Explore Our Services
            </button>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[#d94683]">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-bold uppercase tracking-[0.2em]">
                About Our Salon
              </p>
            </div>

            <h2 className="text-3xl font-bold leading-tight text-[#702b4c] md:text-5xl">
              Beauty Begins With a Little Self-Care
            </h2>

            <p className="mt-7 leading-8 text-[#856477]">
              At SalonBook, we believe every visit should feel special. Our
              goal is to provide quality beauty and personal care services
              with attention to your comfort and preferences.
            </p>

            <p className="mt-4 leading-8 text-[#856477]">
              Whether you are preparing for a special occasion or simply
              taking time for yourself, we want your salon experience to be
              comfortable, enjoyable, and memorable.
            </p>

            <div className="mt-8 flex items-center gap-3 text-[#c43d75]">
              <Heart className="h-6 w-6 fill-[#f8c4d7]" />
              <span className="font-semibold">
                Your beauty, our passion.
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#f8c4d7] to-[#fce8ef]"></div>
            <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fbdce7] via-[#f8c4d7] to-[#e99bb9] p-10">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/60 shadow-lg">
                  <Flower2 className="h-14 w-14 text-[#c43d75]" />
                </div>
                <h3 className="mt-7 text-3xl font-bold text-[#702b4c]">
                  Your Beauty,
                  <br />
                  Our Passion
                </h3>
                <p className="mt-4 text-[#81546a]">
                  A little care can make every day special.
                </p>
                <div className="mt-6 flex justify-center gap-2 text-[#c43d75]">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fff0f5] px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d94683]">
                What We Offer
              </p>
              <h2 className="mt-4 text-3xl font-bold text-[#702b4c] md:text-4xl">
                A Beautiful Experience
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-7 text-[#856477]">
                Everything we do is centered around making your salon visit
                comfortable and special.
              </p>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {facilities.map((facility) => {
                const Icon = facility.icon;

                return (
                  <div
                    key={facility.title}
                    className="rounded-3xl border border-[#f8dce7] bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#e879a5]/10"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffe5ee]">
                      <Icon className="h-8 w-8 text-[#d94683]" />
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-[#702b4c]">
                      {facility.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#856477]">
                      {facility.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-24 md:grid-cols-2">
          <div className="rounded-3xl border border-[#f8dce7] bg-white p-8 shadow-sm md:p-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-2xl bg-[#ffe5ee] p-3">
                <Clock className="h-7 w-7 text-[#d94683]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#d94683]">
                  Visit Us
                </p>
                <h2 className="mt-1 text-2xl font-bold text-[#702b4c]">
                  Opening Hours
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {openingHours.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between gap-4 border-b border-[#fbe6ed] pb-3 text-sm"
                >
                  <span className="font-semibold text-[#70485b]">
                    {item.day}
                  </span>
                  <span className="text-[#98758a]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#f8dce7] bg-white p-8 shadow-sm md:p-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-2xl bg-[#ffe5ee] p-3">
                <MapPin className="h-7 w-7 text-[#d94683]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#d94683]">
                  Get in Touch
                </p>
                <h2 className="mt-1 text-2xl font-bold text-[#702b4c]">
                  Contact Our Salon
                </h2>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#d94683]" />
                <div>
                  <h3 className="font-bold text-[#702b4c]">Salon Address</h3>
                  <p className="mt-2 text-sm leading-7 text-[#98758a]">
                    Your Salon Address, Your City, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-[#d94683]" />
                <div>
                  <h3 className="font-bold text-[#702b4c]">Phone Number</h3>
                  <p className="mt-2 text-sm text-[#98758a]">
                    +880 1XXXXXXXXX
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-[#d94683]" />
                <div>
                  <h3 className="font-bold text-[#702b4c]">Email Address</h3>
                  <p className="mt-2 text-sm text-[#98758a]">
                    info@salonbook.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-r from-[#f9c9dc] via-[#f5b5ce] to-[#f8d9e5] px-6 py-20 text-center">
          <div className="relative mx-auto max-w-3xl">
            <Flower2 className="mx-auto h-10 w-10 text-[#c43d75]" />
            <h2 className="mt-5 text-3xl font-bold text-[#702b4c] md:text-4xl">
              Ready for a Little Time Just for You?
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-[#81546a]">
              Explore our beauty services and find the right appointment for
              you. Your self-care journey starts here.
            </p>

            <button
              onClick={() => router.push("/services")}
              className="mt-8 rounded-full bg-[#d94683] px-9 py-4 font-semibold text-white shadow-lg shadow-[#d94683]/20 transition hover:-translate-y-1 hover:bg-[#bd326e]"
            >
              Browse Services
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
