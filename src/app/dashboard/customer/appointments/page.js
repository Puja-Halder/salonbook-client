
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Scissors,
  CreditCard,
  AlertCircle,
  RefreshCw,
  LoaderCircle,
  ArrowLeft,
  Ban,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";
import {
  getMyAppointments,
  cancelMyAppointment,
  createCheckoutSession,
} from "@/lib/api";

const filters = [
  "all",
  "pending",
  "confirmed",
  "cancelled",
  "completed",
];

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

const formatPrice = (price) =>
  `৳${Number(price).toLocaleString("en-BD")}`;

const getStatusStyle = (status) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
    completed: "bg-blue-50 text-blue-700",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
};

const getPaymentStyle = (status) => {
  const styles = {
    unpaid: "bg-amber-50 text-amber-700",
    paid: "bg-green-50 text-green-700",
    refunded: "bg-purple-50 text-purple-700",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
};

export default function MyAppointmentsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [appointments, setAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token is missing. Please sign in again."
        );
      }

      const result = await getMyAppointments(token);
      setAppointments(result.appointments || []);
    } catch (err) {
      setError(err.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/signin");
      return;
    }

    if (session.user?.isBlocked) {
      router.replace("/");
      return;
    }

    if (session.user?.role !== "customer") {
      router.replace(
        session.user?.role === "admin"
          ? "/dashboard/admin"
          : "/"
      );
      return;
    }

    loadAppointments();
  }, [session, isPending, router, loadAppointments]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");

    if (paymentStatus === "success") {
      toast.success(
        "Payment submitted. Your payment status will update after confirmation."
      );
      loadAppointments();
      router.replace("/dashboard/customer/appointments");
    }

    if (paymentStatus === "cancelled") {
      toast("Payment was cancelled. Your appointment is still unpaid.");
      router.replace("/dashboard/customer/appointments");
    }
  }, [loadAppointments, router]);

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
        throw new Error(
          "Authentication token is missing. Please sign in again."
        );
      }

      const result = await cancelMyAppointment(appointmentId, token);

      toast.success(
        result.message || "Appointment cancelled successfully."
      );

      await loadAppointments();
    } catch (err) {
      toast.error(err.message || "Failed to cancel appointment.");
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayNow = async (appointmentId) => {
    try {
      setPayingId(appointmentId);

      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token is missing. Please sign in again."
        );
      }

      const result = await createCheckoutSession(appointmentId, token);
      const checkoutUrl =
        result.url || result.checkoutUrl || result.session?.url;

      if (!checkoutUrl) {
        throw new Error("Unable to create the payment session.");
      }

      window.location.assign(checkoutUrl);
    } catch (err) {
      toast.error(err.message || "Failed to start payment.");
      setPayingId(null);
    }
  };

  const filteredAppointments =
    activeFilter === "all"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === activeFilter
        );

  const filterCounts = {
    all: appointments.length,
    pending: appointments.filter((item) => item.status === "pending").length,
    confirmed: appointments.filter((item) => item.status === "confirmed").length,
    cancelled: appointments.filter((item) => item.status === "cancelled").length,
    completed: appointments.filter((item) => item.status === "completed").length,
  };

  if (isPending || (!session && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff9fa]">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#c75b79]" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fff9fa] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/dashboard/customer"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#c75b79]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#c75b79]">
                Customer Dashboard
              </p>

              <h1 className="text-3xl font-bold text-[#442b35] sm:text-4xl">
                My Appointments
              </h1>

              <p className="mt-2 text-gray-600">
                View and manage all your salon appointment requests.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c75b79] px-5 py-3 font-semibold text-white transition hover:bg-[#ad4967]"
            >
              <Scissors size={18} />
              Book an Appointment
            </Link>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl border px-3 py-4 text-left transition ${
                  activeFilter === filter
                    ? "border-[#c75b79] bg-[#fff0f4] shadow-sm"
                    : "border-pink-100 bg-white hover:border-[#e5a4b5]"
                }`}
              >
                <p className="text-xs font-medium capitalize text-gray-500">
                  {filter === "all" ? "All Appointments" : filter}
                </p>

                <p className="mt-1 text-2xl font-bold text-[#442b35]">
                  {filterCounts[filter]}
                </p>
              </button>
            ))}
          </div>

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#442b35]">
              {activeFilter === "all"
                ? "Appointment History"
                : `${activeFilter.charAt(0).toUpperCase()}${activeFilter.slice(1)} Appointments`}
            </h2>

            <button
              onClick={loadAppointments}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm font-medium text-[#c75b79] transition hover:bg-pink-50 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-pink-100 bg-white">
              <div className="text-center">
                <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-[#c75b79]" />
                <p className="mt-3 text-sm text-gray-500">
                  Loading your appointments...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-400" />
              <p className="mt-4 font-semibold text-gray-800">
                Unable to load appointments
              </p>
              <p className="mt-2 text-sm text-gray-500">{error}</p>

              <button
                onClick={loadAppointments}
                className="mt-5 rounded-xl bg-[#c75b79] px-5 py-2.5 font-semibold text-white hover:bg-[#ad4967]"
              >
                Try Again
              </button>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="rounded-2xl border border-pink-100 bg-white px-6 py-16 text-center">
              <CalendarDays className="mx-auto h-12 w-12 text-[#d99aab]" />

              <h3 className="mt-4 text-xl font-bold text-[#442b35]">
                {activeFilter === "all"
                  ? "No appointments yet"
                  : `No ${activeFilter} appointments`}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {activeFilter === "all"
                  ? "Your appointment history will appear here after you book a service."
                  : "There are no appointments with this status right now."}
              </p>

              {activeFilter === "all" && (
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c75b79] px-5 py-3 font-semibold text-white hover:bg-[#ad4967]"
                >
                  <Scissors size={17} />
                  Explore Services
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => {
                const canPay =
                  ["confirmed", "completed"].includes(appointment.status) &&
                  appointment.paymentStatus === "unpaid";

                return (
                  <article
                    key={appointment._id}
                    className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-[#442b35]">
                            {appointment.serviceName}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(appointment.status)}`}
                          >
                            {appointment.status}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                          <p className="flex items-center gap-2">
                            <CalendarDays size={17} className="text-[#c75b79]" />
                            {formatDate(appointment.appointmentDate)}
                          </p>

                          <p className="flex items-center gap-2">
                            <Clock size={17} className="text-[#c75b79]" />
                            {appointment.appointmentTime}
                          </p>

                          <p className="flex items-center gap-2">
                            <Scissors size={17} className="text-[#c75b79]" />
                            {appointment.duration} minutes
                          </p>

                          <p className="flex items-center gap-2">
                            <CreditCard size={17} className="text-[#c75b79]" />
                            {formatPrice(appointment.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:items-end">
                        <span className="text-xs font-medium text-gray-500">
                          Payment Status
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStyle(appointment.paymentStatus)}`}
                        >
                          {appointment.paymentStatus}
                        </span>

                        {canPay && (
                          <button
                            onClick={() => handlePayNow(appointment._id)}
                            disabled={payingId === appointment._id}
                            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#c75b79] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ad4967] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {payingId === appointment._id ? (
                              <LoaderCircle
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <CreditCard size={16} />
                            )}
                            {payingId === appointment._id
                              ? "Preparing Payment..."
                              : "Pay Now"}
                          </button>
                        )}

                        {appointment.status === "pending" && (
                          <button
                            onClick={() => handleCancel(appointment._id)}
                            disabled={cancellingId === appointment._id}
                            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancellingId === appointment._id ? (
                              <LoaderCircle size={15} className="animate-spin" />
                            ) : (
                              <Ban size={15} />
                            )}
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 border-t border-pink-50 pt-4">
                      <p className="text-xs text-gray-400">
                        Appointment ID: {appointment._id}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
