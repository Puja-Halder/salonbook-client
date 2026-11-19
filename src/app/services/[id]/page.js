
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ArrowLeft,
  Sparkles,
  Pencil,
  Power,
  X,
  Save,
  LoaderCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";
import {
  getServiceById,
  updateService,
  deactivateService,
} from "@/lib/api";
import toast from "react-hot-toast";

const categories = [
  "haircut-styling",
  "hair-coloring",
  "hair-treatment",
  "facial-skincare",
  "makeup",
  "manicure-pedicure",
  "spa-massage",
];

function ServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    imageUrl: "",
  });

  const user = session?.user;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (user.isBlocked) {
      router.replace("/");
      return;
    }

    let active = true;

    const loadService = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getServiceById(params.id);

        if (active) {
          setService(result.service);
        }
      } catch (error) {
        if (active) {
          setError(error.message || "Unable to load service details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadService();

    return () => {
      active = false;
    };
  }, [isPending, user, params.id, router]);

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        "Unable to get authentication token. Please sign in again."
      );
    }

    return data.token;
  };

  const handleEditClick = () => {
    setForm({
      name: service.name || "",
      description: service.description || "",
      category: service.category || "",
      price: String(service.price ?? ""),
      duration: String(service.duration ?? ""),
      imageUrl: service.imageUrl || "",
    });

    setShowEditForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.category ||
      form.price === "" ||
      form.duration === "" ||
      Number(form.price) < 0 ||
      Number(form.duration) < 5
    ) {
      toast.error("Please enter valid service information.");
      return;
    }

    try {
      setSaving(true);

      const token = await getToken();

      const serviceData = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        duration: Number(form.duration),
        imageUrl: form.imageUrl.trim(),
      };

      await updateService(service._id, serviceData, token);

      const result = await getServiceById(params.id);

      setService(result.service);
      setShowEditForm(false);

      toast.success("Service updated successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to update service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    const confirmed = window.confirm(
      `Deactivate "${service.name}"? Customers will no longer be able to see this service.`
    );

    if (!confirmed) return;

    try {
      setDeactivating(true);

      const token = await getToken();

      await deactivateService(service._id, token);

      toast.success("Service deactivated successfully.");

      router.replace("/services");
    } catch (error) {
      toast.error(error.message || "Failed to deactivate service.");
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fffafd] px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-pink-700 transition hover:text-pink-900"
          >
            <ArrowLeft size={18} />
            Back to Services
          </Link>

          {isPending || loading ? (
            <div className="py-32 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />

              <p className="mt-4 text-[#806b78]">
                Loading service details...
              </p>
            </div>
          ) : !user ? (
            <div className="py-32 text-center">
              <p className="text-[#806b78]">
                Redirecting to sign in...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-pink-100 bg-white px-6 py-20 text-center shadow-sm">
              <Sparkles
                size={42}
                className="mx-auto text-pink-400"
              />

              <h1 className="mt-5 text-2xl font-bold text-[#321b2b]">
                Service Not Found
              </h1>

              <p className="mt-3 text-[#806b78]">
                {error}
              </p>

              <Link
                href="/services"
                className="mt-7 inline-flex rounded-full bg-pink-600 px-7 py-3 font-semibold text-white transition hover:bg-pink-700"
              >
                Browse Services
              </Link>
            </div>
          ) : service ? (
            <div className="grid items-start gap-10 overflow-hidden rounded-3xl border border-pink-100 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
              <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-2xl bg-pink-50 md:min-h-[450px]">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="h-full max-h-[550px] w-full object-cover"
                  />
                ) : (
                  <Sparkles
                    size={70}
                    className="text-pink-400"
                  />
                )}
              </div>

              <div className="py-3">
                <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold capitalize text-pink-700">
                  {service.category?.replaceAll("-", " ")}
                </span>

                <h1 className="mt-6 text-3xl font-bold text-[#321b2b] sm:text-4xl">
                  {service.name}
                </h1>

                <p className="mt-6 whitespace-pre-line leading-8 text-[#806b78]">
                  {service.description}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#fffafd] p-5">
                    <p className="text-sm text-[#806b78]">
                      Service Price
                    </p>

                    <p className="mt-2 text-2xl font-bold text-pink-600">
                      ৳{service.price}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fffafd] p-5">
                    <p className="text-sm text-[#806b78]">
                      Duration
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-xl font-bold text-[#321b2b]">
                      <Clock size={20} />
                      {service.duration} min
                    </p>
                  </div>
                </div>

                {isAdmin ? (
                  <div className="mt-8 rounded-2xl border border-pink-100 bg-[#fffafd] p-5">
                    <h2 className="text-lg font-bold text-[#321b2b]">
                      Admin Service Management
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#806b78]">
                      Update this service or deactivate it to hide it from customers.
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={handleEditClick}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700"
                      >
                        <Pencil size={18} />
                        Edit Service
                      </button>

                      <button
                        onClick={handleDeactivate}
                        disabled={deactivating}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deactivating ? (
                          <LoaderCircle
                            size={18}
                            className="animate-spin"
                          />
                        ) : (
                          <Power size={18} />
                        )}

                        {deactivating
                          ? "Deactivating..."
                          : "Deactivate Service"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 rounded-2xl border border-pink-100 bg-[#fffafd] p-5">
                    <p className="font-semibold text-[#321b2b]">
                      Ready to book this service?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#806b78]">
                      Appointment booking will be available here soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {showEditForm && isAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <section className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#321b2b]">
                Edit Service
              </h2>

              <button
                onClick={() => setShowEditForm(false)}
                disabled={saving}
                className="rounded-lg p-2 text-[#806b78] transition hover:bg-pink-50"
                aria-label="Close edit form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#49313f]">
                  Service Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#49313f]">
                  Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 outline-none focus:border-pink-500"
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" & ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#49313f]">
                    Price (৳) *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#49313f]">
                    Duration (minutes) *
                  </label>

                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    required
                    min="5"
                    className="w-full rounded-xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#49313f]">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  rows={4}
                  className="w-full rounded-xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#49313f]">
                  Image URL
                </label>

                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={18} />
                  )}

                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl border border-pink-200 px-5 py-3 font-semibold text-[#765b69] transition hover:bg-pink-50"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function ServiceDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fffafd] py-32 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />

          <p className="mt-4 text-[#806b78]">
            Loading service page...
          </p>
        </div>
      }
    >
      <ServiceDetailsContent />
    </Suspense>
  );
}
