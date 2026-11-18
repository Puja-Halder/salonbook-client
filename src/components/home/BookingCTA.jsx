
import Link from "next/link";

export default function BookingCTA() {
  return (
    <section className="bg-white px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#321b2b] px-8 py-14 text-center sm:px-14 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-300">
          YOUR BEAUTY JOURNEY STARTS HERE
        </p>

        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
          Ready for a Little Time Just for You?
        </h2>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-pink-100/80">
          Discover your favorite beauty treatments and request your
          appointment with just a few clicks.
        </p>

        <Link
          href="/signin"
          className="mt-9 inline-flex rounded-full bg-pink-600 px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-pink-500"
        >
          Book Your Appointment →
        </Link>
      </div>
    </section>
  );
}
