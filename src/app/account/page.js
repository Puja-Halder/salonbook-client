
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  UserRound,
  BadgeCheck,
  Pencil,
  Camera,
  X,
  Save,
  LoaderCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";

export default function AccountPage() {
  const router = useRouter();
  const {
    data: session,
    isPending,
    refetch,
  } = authClient.useSession();

  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImageUrl(user.image || "");
    }
  }, [user?.name, user?.image]);

  const dashboardLink =
    user?.role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer";

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleEdit = () => {
    setName(user.name || "");
    setImageUrl(user.image || "");
    setImageFile(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(user.name || "");
    setImageUrl(user.image || "");
    setImageFile(null);
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (name.trim().length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    setIsSaving(true);

    try {
      let finalImageUrl = imageUrl.trim();

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.imageUrl) {
          throw new Error(
            uploadResult.message || "Profile image upload failed."
          );
        }

        finalImageUrl = uploadResult.imageUrl;
      }

      const result = await authClient.updateUser({
        name: name.trim(),
        image: finalImageUrl || null,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Could not update your profile."
        );
      }

      await refetch();

      setIsEditing(false);
      setImageFile(null);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff3f7]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fff3f7] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#a34d70] transition hover:text-pink-600"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-lg shadow-pink-100/50">
            <div className="h-36 bg-gradient-to-r from-[#f8bfd2] via-[#f7d4e0] to-[#fceaf1] sm:h-44" />

            <div className="px-6 pb-8 sm:px-10">
              <div className="-mt-16 flex flex-col items-center sm:-mt-20">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-pink-100 text-4xl font-bold text-pink-700 shadow-md sm:h-40 sm:w-40">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>

                <h1 className="mt-5 text-2xl font-bold text-[#54263d] sm:text-3xl">
                  {user.name || "SalonBook User"}
                </h1>

                <p className="mt-2 text-sm text-[#a77a8e]">
                  {user.role === "admin"
                    ? "Administrator Account"
                    : "Customer Account"}
                </p>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="mt-10">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#54263d]">
                      Edit Your Profile
                    </h2>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center gap-1 text-sm font-semibold text-[#a34d70] hover:text-pink-700"
                    >
                      <X size={17} />
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#54263d]">
                        Full Name
                      </label>

                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your full name"
                        maxLength={100}
                        required
                        className="w-full rounded-xl border border-pink-200 bg-[#fff8fb] px-4 py-3 text-sm text-[#54263d] outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#54263d]">
                        Profile Image URL
                      </label>

                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(event) => {
                          setImageUrl(event.target.value);
                          setImageFile(null);
                        }}
                        placeholder="https://example.com/profile.jpg"
                        className="w-full rounded-xl border border-pink-200 bg-[#fff8fb] px-4 py-3 text-sm text-[#54263d] outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#54263d]">
                        Or Upload a New Image
                      </label>

                      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-pink-200 bg-[#fff8fb] px-4 py-5 text-sm font-semibold text-[#a34d70] transition hover:border-pink-400 hover:bg-pink-50">
                        <Camera size={20} />
                        {imageFile ? imageFile.name : "Choose Profile Image"}

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];

                            if (!file) return;

                            if (file.size > 5 * 1024 * 1024) {
                              toast.error("Image must be smaller than 5 MB.");
                              event.target.value = "";
                              return;
                            }

                            setImageFile(file);
                          }}
                        />
                      </label>

                      <p className="mt-2 text-xs text-[#b17e93]">
                        JPEG, PNG, or WebP. Maximum size: 5 MB.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? (
                        <>
                          <LoaderCircle size={18} className="animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mt-10 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#54263d]">
                      Account Information
                    </h2>

                    <button
                      type="button"
                      onClick={handleEdit}
                      className="flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-700 transition hover:bg-pink-100"
                    >
                      <Pencil size={16} />
                      Edit Profile
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-[#fff8fb] p-4">
                      <div className="rounded-xl bg-pink-100 p-3 text-pink-600">
                        <UserRound size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#b17e93]">
                          Full Name
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-[#54263d]">
                          {user.name || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-[#fff8fb] p-4">
                      <div className="rounded-xl bg-pink-100 p-3 text-pink-600">
                        <Mail size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#b17e93]">
                          Email Address
                        </p>
                        <p className="mt-1 break-all text-sm font-semibold text-[#54263d]">
                          {user.email || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-[#fff8fb] p-4">
                      <div className="rounded-xl bg-pink-100 p-3 text-pink-600">
                        <ShieldCheck size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#b17e93]">
                          Account Role
                        </p>
                        <p className="mt-1 text-sm font-semibold capitalize text-[#54263d]">
                          {user.role || "Customer"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-[#fff8fb] p-4">
                      <div className="rounded-xl bg-pink-100 p-3 text-pink-600">
                        <BadgeCheck size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#b17e93]">
                          Email Verification
                        </p>
                        <p
                          className={`mt-1 text-sm font-semibold ${
                            user.emailVerified
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                        >
                          {user.emailVerified ? "Verified" : "Not Verified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Link
                href={dashboardLink}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:bg-pink-700"
              >
                <LayoutDashboard size={18} />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
