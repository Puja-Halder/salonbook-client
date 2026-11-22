
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Clock, Sparkles, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";
import { getServices, getServiceCategories } from "@/lib/api";

export default function ServicesPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryInitialized, setCategoryInitialized] = useState(false);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard/customer");
    }
  };

  const handleViewDetails = (event, serviceId) => {
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

      return;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategory(params.get("category") || "");
    setCategoryInitialized(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getServiceCategories();
        setCategories(result.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categoryInitialized) return;

    let active = true;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getServices({
          search: searchTerm.trim(),
          category,
          limit: 50,
        });

        if (!active) return;

        setServices(result.services || []);
      } catch (error) {
        if (active) {
          setError(error.message || "Unable to load services.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchTerm, category, categoryInitialized]);

  const sortedServices = [...services].sort((a, b) => {
    if (sortOrder === "low-to-high") {
      return a.price - b.price;
    }

    if (sortOrder === "high-to-low") {
      return b.price - a.price;
    }

    return 0;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fffafd]">
        <section className="bg-[#fcecf3] px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">
            OUR BEAUTY COLLECTION
          </p>

          <h1 className="mt-4 text-4xl font-bold text-[#321b2b] sm:text-5xl">
            Explore Our Services
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#806b78]">
            Discover professional beauty treatments designed to
            make you feel confident, refreshed, and beautiful.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <button
            type="button"
            onClick={handleGoBack}
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-5 py-2.5 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search services..."
                className="w-full rounded-xl border border-pink-100 bg-white py-3.5 pl-12 pr-4 text-[#321b2b] outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-pink-100 bg-white px-5 py-3.5 text-[#765b69] outline-none focus:border-pink-400"
            >
              <option value="">All Categories</option>

              {categories.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="rounded-xl border border-pink-100 bg-white px-5 py-3.5 text-[#765b69] outline-none focus:border-pink-400"
            >
              <option value="">Sort by Price</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>

          <div className="mb-7 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#321b2b]">
              Available Services
            </h2>

            <span className="text-sm text-[#806b78]">
              {services.length} services found
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />

              <p className="mt-4 text-[#806b78]">
                Loading services...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-medium text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-full bg-pink-600 px-5 py-2 text-sm font-semibold text-white hover:bg-pink-700"
              >
                Try Again
              </button>
            </div>
          ) : sortedServices.length === 0 ? (
            <div className="rounded-2xl border border-pink-100 bg-white px-6 py-16 text-center">
              <Sparkles
                size={40}
                className="mx-auto text-pink-400"
              />

              <h3 className="mt-5 text-xl font-bold text-[#321b2b]">
                No Services Found
              </h3>

              <p className="mt-2 text-[#806b78]">
                Try another search term or select a different category.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {sortedServices.map((service) => (
                <article
                  key={service._id}
                  className="group overflow-hidden rounded-2xl border border-pink-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-100"
                >
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#fcecf3]">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Sparkles
                        size={55}
                        className="text-pink-400"
                      />
                    )}
                  </div>

                  <div className="p-6">
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold capitalize text-pink-700">
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
                        <p className="text-xs text-[#806b78]">
                          Price
                        </p>

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
                      onClick={(event) =>
                        handleViewDetails(event, service._id)
                      }
                      className="mt-6 block rounded-full bg-pink-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-pink-700"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
