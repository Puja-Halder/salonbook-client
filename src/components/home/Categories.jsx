
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Palette,
  Sparkles,
  Flower2,
  Brush,
  Hand,
  Heart,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { getServiceCategories } from "@/lib/api";

const categoryIcons = {
  "haircut & styling": Scissors,
  "hair coloring": Palette,
  "hair treatment": Sparkles,
  "facial & skincare": Flower2,
  makeup: Brush,
  "manicure & pedicure": Hand,
  "spa & massage": Heart,
};

const getCategoryIcon = (category) => {
  return categoryIcons[category.toLowerCase()] || Sparkles;
};

const formatCategoryName = (category) => {
  return category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getServiceCategories();
        setCategories(result.categories || []);
      } catch (err) {
        setError(err.message || "Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="bg-[#FFF8F8] px-5 py-20 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C56B83]">
            Explore Our Services
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#421F2B] sm:text-4xl">
            Salon Service Categories
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Discover the perfect beauty and self-care experience. Explore our
            services by category.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center gap-3 text-[#A94F6B]">
            <LoaderCircle className="h-6 w-6 animate-spin" />
            <span>Loading categories...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white px-6 py-10 text-center text-red-500 shadow-sm">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <Sparkles className="mx-auto h-10 w-10 text-[#C56B83]" />

            <h3 className="mt-4 text-xl font-semibold text-[#421F2B]">
              Categories Coming Soon
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Our salon service categories will appear here once services are
              added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name);

              return (
                <Link
                  key={category.name}
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group rounded-2xl border border-[#F3DDE3] bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D58A9D] hover:shadow-lg sm:p-7"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCE9EE] text-[#B65D78] transition duration-300 group-hover:bg-[#B65D78] group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-[#421F2B] sm:text-lg">
                    {formatCategoryName(category.name)}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {category.totalServices}{" "}
                    {category.totalServices === 1 ? "Service" : "Services"}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#B65D78]">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
