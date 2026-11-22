
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Scissors,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  LoaderCircle,
  CalendarCheck,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";
import {
  getMyAppointments,
  cancelMyAppointment,
} from "@/lib/api";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
};

const formatPrice = (price) => {
  return `৳${Number(price).toLocaleString("en-BD")}`;
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function CustomerDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const loadAppointments = useCallback(async () => {
    try {
      setLoadingAppointments(true);
      setError("");

      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      if (!token) {
        throw new Error("Authentication token is missing. Please sign in again.");
      }

      const result = await getMyAppointments(token);
      setAppointments(result.appointments || []);
    } catch (error) {
      setError(error.message || "Failed to load appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/signin");
      return;
    }

    if (session.user.isBlocked) {
      toast.error(
        "Your account has been blocked by the administrator. Please contact the salon for assistance.",
        {
          id: "account-blocked",
          duration: 5000,
        }
      );

      router.replace("/");
      return;
    }

    if (session.user.role === "admin") {
      router.replace("/dashboard/admin");
      return;
    }

    loadAppointments();
  }, [session, isPending, router, loadAppointments]);

  const handleCancel = async (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(appointmentId);

      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      if (!token) {
        throw new Error("Authentication token is missing. Please sign in again.");
      }

      await cancelMyAppointment(appointmentId, token);

      toast.success("Appointment cancelled successfully.");
      await loadAppointments();
    } catch (error) {
      toast.error(error.message || "Failed to cancel appointment.");
    } finally {
      setCancellingId(null);
    }
  };

  if (
    isPending ||
    !session?.user ||
    session.user.role === "admin" ||
    session.user.isBlocked
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffafd]">
        <LoaderCircle className="animate-spin text-pink-600" size={30} />
      </main>
    );
  }

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length;
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;
  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length;

  const dashboardItems = [
    {
      title: "Browse Services",
      description: "Explore salon treatments and find the right service.",
      icon: Scissors,
      href: "/services",
    },
    {
      title: "My Appointments",
      description: "View your appointment requests and their status.",
      icon: CalendarDays,
      href: "/dashboard/customer/appointments",
    },
    {
      title: "Payment History",
      description: "Review your previous payments and transactions.",
      icon: CreditCard,
      href: "/dashboard/customer/payments",
    },
  ];

  const statistics = [
    {
      title: "Total Appointments",
      value: totalAppointments,
      icon: CalendarDays,
      color: "bg-pink-50 text-pink-600",
    },
    {
      title: "Pending",
      value: pendingAppointments,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Confirmed",
      value: confirmedAppointments,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Cancelled",
      value: cancelledAppointments,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fffafd] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <button
              onClick={handleGoBack}
              className="mb-6 inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-5 py-2.5 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
            >
              <ArrowLeft size={17} />
              Go Back
            </button>

            <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">
              Customer Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-bold text-[#321b2b]">
              My Dashboard
            </h1>

            <p className="mt-3 text-[#806b78]">
              Welcome, {session.user.name}! Manage your salon appointments here.
            </p>
          </div>

          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#321b2b]">
                  Appointment Overview
                </h2>
                <p className="mt-1 text-sm text-[#806b78]">
                  Your appointment statistics
                </p>
              </div>

              <button
                onClick={loadAppointments}
                disabled={loadingAppointments}
                className="flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loadingAppointments ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {statistics.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm"
                  >
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <Icon size={23} />
                    </div>

                    <p className="text-sm font-medium text-[#806b78]">
                      {item.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#321b2b]">
                      {loadingAppointments ? "—" : item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#321b2b]">
                Quick Access
              </h2>
              <p className="mt-1 text-sm text-[#806b78]">
                Manage your salon activities
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

                    <h3 className="text-lg font-bold text-[#321b2b]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#806b78]">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#321b2b]">
                  Recent Appointments
                </h2>
                <p className="mt-1 text-sm text-[#806b78]">
                  Your latest appointment requests
                </p>
              </div>

              <Link
                href="/services"
                className="rounded-full bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
              >
                Book a Service
              </Link>
            </div>

            {loadingAppointments ? (
              <div className="flex items-center justify-center rounded-2xl border border-pink-100 bg-white py-16">
                <LoaderCircle
                  className="animate-spin text-pink-600"
                  size={30}
                />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
                <AlertCircle className="mx-auto text-red-500" size={32} />
                <p className="mt-3 font-medium text-red-600">{error}</p>

                <button
                  onClick={loadAppointments}
                  className="mt-5 rounded-full bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-700"
                >
                  Try Again
                </button>
              </div>
            ) : appointments.length === 0 ? (
              <div className="rounded-2xl border border-pink-100 bg-white px-6 py-16 text-center">
                <CalendarCheck
                  className="mx-auto text-pink-400"
                  size={45}
                />

                <h3 className="mt-4 text-lg font-bold text-[#321b2b]">
                  No Appointments Yet
                </h3>

                <p className="mt-2 text-sm text-[#806b78]">
                  You haven't booked any salon services yet.
                </p>

                <Link
                  href="/services"
                  className="mt-6 inline-block rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-700"
                >
                  Explore Services
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-lg font-bold text-[#321b2b]">
                          {appointment.serviceName}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#806b78]">
                          <span className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-pink-600" />
                            {formatDate(appointment.appointmentDate)}
                          </span>

                          <span className="flex items-center gap-2">
                            <Clock size={16} className="text-pink-600" />
                            {appointment.appointmentTime}
                          </span>

                          <span className="flex items-center gap-2">
                            <Scissors size={16} className="text-pink-600" />
                            {appointment.duration} minutes
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <p className="text-xs text-[#806b78]">Price</p>
                          <p className="mt-1 text-lg font-bold text-[#321b2b]">
                            {formatPrice(appointment.price)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
                            statusStyles[appointment.status] ||
                            "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {appointment.status}
                        </span>

                        {appointment.status === "pending" && (
                          <button
                            onClick={() => handleCancel(appointment._id)}
                            disabled={cancellingId === appointment._id}
                            className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {cancellingId === appointment._id ? (
                              <LoaderCircle size={15} className="animate-spin" />
                            ) : (
                              <XCircle size={15} />
                            )}
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
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
