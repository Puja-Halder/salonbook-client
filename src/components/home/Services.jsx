
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getServices } from "@/lib/api";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, isPending } = authClient.useSession();

  const handleViewDetails = (event) => {
    if (isPending) {
      event.preventDefault();
      return;
    }

    if (session?.user?.isBlocked) {
      event.preventDefault();

      toast.error(
        "Your account has been blocked by the administrator. Please contact the salon for assistance.",
        {
          id: "blocked-service-details",
          duration: 5000,
        }
      );
    }
  };

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getServices();

        if (active) {
          setServices(result.services.slice(0, 6));
        }
      } catch (error) {
        if (active) {
          setError(error.message || "Unable to load salon services.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="services" className="bg-white px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">
            WHAT WE OFFER
          </p>

          <h2 className="mt-4 text-3xl font-bold text-[#321b2b] sm:text-4xl">
            Featured Salon Services
          </h2>

          <p className="mt-5 leading-7 text-[#806b78]">
            Discover our most popular beauty treatments and find
            the perfect service for your beauty needs.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
            <p className="mt-4 text-[#806b78]">
              Loading featured services...
            </p>
          </div>
        ) : error ? (
          <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-medium text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-pink-700"
            >
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-pink-100 bg-[#fffafd] px-6 py-16 text-center">
            <Sparkles size={42} className="mx-auto text-pink-400" />

            <h3 className="mt-5 text-xl font-bold text-[#321b2b]">
              Services Coming Soon
            </h3>

            <p className="mt-2 text-[#806b78]">
              Our salon services will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-pink-100 bg-[#fffafd] transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-100"
              >
                <div className="flex h-56 items-center justify-center overflow-hidden bg-pink-50">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Sparkles size={55} className="text-pink-400" />
                  )}
                </div>

                <div className="p-6">
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold capitalize text-pink-700">
                    {service.category}
                  </span>

                  <h3 className="mt-4 text-xl font-bold text-[#321b2b]">
                    {service.name}
                  </h3>

                  <p className="mt-3 min-h-14 text-sm leading-6 text-[#806b78]">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-pink-100 pt-5">
                    <div>
                      <p className="text-xs text-[#806b78]">Price</p>
                      <p className="mt-1 text-xl font-bold text-pink-600">
                        ৳{service.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-[#806b78]">
                      <Clock size={16} />
                      {service.duration} min
                    </div>
                  </div>

                  <Link
                    href={`/services/${service._id}`}
                    onClick={handleViewDetails}
                    className="mt-6 block rounded-full border border-pink-300 px-5 py-3 text-center text-sm font-semibold text-pink-700 transition hover:bg-pink-600 hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-pink-700"
          >
            Explore All Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
