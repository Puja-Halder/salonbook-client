
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Scissors,
  LoaderCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";
import {
  getServices,
  createService,
  updateService,
  deactivateService,
  uploadServiceImage,
} from "@/lib/api";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  duration: "",
  imageUrl: "",
};

const categories = [
  "haircut-styling",
  "hair-coloring",
  "hair-treatment",
  "facial-skincare",
  "makeup",
  "manicure-pedicure",
  "spa-massage",
];

export default function ManageServicesPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

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

    loadServices();
  }, [session, isPending, router]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const result = await getServices({ limit: 50 });
      setServices(result.services || []);
    } catch (error) {
      toast.error(error.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      return;
    }

    setSelectedImage(file);
  };

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Unable to get authentication token. Please sign in again.");
    }

    return data.token;
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedImage(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim() || !form.category) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0 ||
      form.duration === "" ||
      Number(form.duration) < 5
    ) {
      toast.error("Enter a valid price and duration of at least 5 minutes.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = form.imageUrl;

      if (selectedImage) {
        setUploading(true);
        const uploadResult = await uploadServiceImage(selectedImage);
        imageUrl = uploadResult.imageUrl;
        setUploading(false);
      }

      const token = await getToken();

      const serviceData = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        duration: Number(form.duration),
        imageUrl,
      };

      if (editingId) {
        await updateService(editingId, serviceData, token);
        toast.success("Service updated successfully.");
      } else {
        await createService(serviceData, token);
        toast.success("Service created successfully.");
      }

      resetForm();
      await loadServices();
    } catch (error) {
      setUploading(false);
      toast.error(error.message || "Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name || "",
      description: service.description || "",
      category: service.category || "",
      price: String(service.price ?? ""),
      duration: String(service.duration ?? ""),
      imageUrl: service.imageUrl || "",
    });

    setSelectedImage(null);
    setEditingId(service._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeactivate = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this service?"
    );

    if (!confirmed) return;

    try {
      const token = await getToken();
      await deactivateService(id, token);
      toast.success("Service deactivated successfully.");
      await loadServices();
    } catch (error) {
      toast.error(error.message || "Failed to deactivate service.");
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffafd]">
        <LoaderCircle className="animate-spin text-pink-600" size={32} />
      </main>
    );
  }

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fffafd] px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <Scissors size={29} className="text-pink-600" />
                <h1 className="text-3xl font-bold text-[#321b2b]">
                  Manage Services
                </h1>
              </div>

              <p className="mt-3 text-[#806b78]">
                Add, update, and manage your salon services.
              </p>
            </div>

            <button
              onClick={() => {
                if (showForm) {
                  resetForm();
                } else {
                  setForm(initialForm);
                  setEditingId(null);
                  setSelectedImage(null);
                  setShowForm(true);
                }
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              {showForm ? <X size={19} /> : <Plus size={19} />}
              {showForm ? "Close Form" : "Add New Service"}
            </button>
          </div>

          {showForm && (
            <section className="mb-10 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-[#321b2b]">
                {editingId ? "Edit Service" : "Add a New Service"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
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
                      placeholder="e.g. Hair Styling"
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
                      placeholder="500"
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
                      placeholder="30"
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
                    placeholder="Describe the salon service..."
                    className="w-full rounded-xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#49313f]">
                    Service Image
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-pink-200 bg-pink-50/50 p-5 text-sm text-[#765b69] transition hover:bg-pink-50">
                    <Upload size={23} className="text-pink-600" />
                    <span>
                      {selectedImage
                        ? selectedImage.name
                        : "Choose an image (JPEG, PNG, WebP, max 5 MB)"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {form.imageUrl && !selectedImage && (
                    <p className="mt-2 text-xs text-green-700">
                      An existing image is currently saved for this service.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <Plus size={18} />
                    )}
                    {uploading
                      ? "Uploading Image..."
                      : saving
                        ? "Saving..."
                        : editingId
                          ? "Update Service"
                          : "Create Service"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-pink-200 px-6 py-3 font-semibold text-[#765b69] transition hover:bg-pink-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#321b2b]">
                Your Services
              </h2>
              <span className="rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-700">
                {services.length} Services
              </span>
            </div>

            {services.length === 0 ? (
              <div className="rounded-2xl border border-pink-100 bg-white px-6 py-16 text-center">
                <Scissors size={42} className="mx-auto text-pink-300" />
                <h3 className="mt-4 text-xl font-bold text-[#321b2b]">
                  No Services Yet
                </h3>
                <p className="mt-2 text-sm text-[#806b78]">
                  Add your first salon service to display it on the homepage.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <article
                    key={service._id}
                    className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm"
                  >
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-pink-50">
                        <Scissors size={42} className="text-pink-300" />
                      </div>
                    )}

                    <div className="p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold text-[#321b2b]">
                          {service.name}
                        </h3>
                        <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          Active
                        </span>
                      </div>

                      <p className="text-sm capitalize text-[#806b78]">
                        {service.category?.replaceAll("-", " ")}
                      </p>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#806b78]">
                        {service.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-pink-50 pt-4">
                        <div>
                          <p className="text-lg font-bold text-pink-600">
                            ৳{service.price}
                          </p>
                          <p className="text-xs text-[#806b78]">
                            {service.duration} minutes
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            title="Edit service"
                            className="rounded-lg bg-pink-50 p-2.5 text-pink-600 transition hover:bg-pink-100"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDeactivate(service._id)}
                            title="Deactivate service"
                            className="rounded-lg bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
