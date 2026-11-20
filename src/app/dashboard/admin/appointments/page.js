
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Scissors,
  CheckCircle,
  XCircle,
  RefreshCw,
  IndianRupee,
  ClipboardList,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";
import {
  getAllAppointments,
  updateAppointmentStatus,
} from "@/lib/api";

const filters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
];

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
};

export default function AdminAppointmentsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [appointments, setAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = useCallback(async (status = activeFilter) => {
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const result = await getAllAppointments(token, status);
      setAppointments(result.appointments || []);
    } catch (error) {
      toast.error(error.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

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

    loadAppointments(activeFilter);
  }, [session, isPending, router, activeFilter, loadAppointments]);

  const counts = {
    all: appointments.length,
    pending: appointments.filter((item) => item.status === "pending").length,
    confirmed: appointments.filter((item) => item.status === "confirmed").length,
    cancelled: appointments.filter((item) => item.status === "cancelled").length,
    completed: appointments.filter((item) => item.status === "completed").length,
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAppointments(activeFilter);
  };

  const handleStatusUpdate = async (appointment, newStatus) => {
    const actionMessages = {
      confirmed: "confirm this appointment",
      cancelled: "cancel this appointment",
      completed: "mark this appointment as completed",
    };

    if (!window.confirm(`Are you sure you want to ${actionMessages[newStatus]}?`)) {
      return;
    }

    try {
      setUpdatingId(appointment._id);

      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const result = await updateAppointmentStatus(
        appointment._id,
        newStatus,
        token
      );

      toast.success(result.message || "Appointment updated successfully.");
      await loadAppointments(activeFilter);
    } catch (error) {
      toast.error(error.message || "Failed to update appointment.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isPending || !session?.user || session.user.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffafd]">
        <p className="text-[#765b69]">Checking admin access...</p>
      </main>
    );
  }

  const summaryCards = [
    { label: "Total Appointments", value: counts.all, color: "text-pink-600" },
    { label: "Pending", value: counts.pending, color: "text-amber-600" },
    { label: "Confirmed", value: counts.confirmed, color: "text-blue-600" },
    { label: "Cancelled", value: counts.cancelled, color: "text-red-600" },
    { label: "Completed", value: counts.completed, color: "text-green-600" },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fffafd] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-pink-600">
                Administration
              </p>
              <h1 className="text-2xl font-bold text-[#321b2b]">
                Appointment Management
              </h1>
              <p className="mt-1 text-sm text-[#806b78]">
                Review and manage customer appointments.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-medium text-[#806b78]">
                  {card.label}
                </p>
                <p className={`mt-2 text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setActiveFilter(filter.value);
                  setLoading(true);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter.value
                    ? "bg-pink-600 text-white"
                    : "border border-pink-100 bg-white text-[#765b69] hover:bg-pink-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="rounded-xl border border-pink-100 bg-white py-16 text-center">
              <RefreshCw size={28} className="mx-auto animate-spin text-pink-500" />
              <p className="mt-3 text-sm text-[#806b78]">
                Loading appointments...
              </p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-xl border border-pink-100 bg-white px-6 py-16 text-center">
              <CalendarDays size={38} className="mx-auto text-pink-300" />
              <h2 className="mt-3 text-lg font-bold text-[#321b2b]">
                No appointments found
              </h2>
              <p className="mt-1 text-sm text-[#806b78]">
                There are no appointments in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#806b78]">
                      #{appointment._id.slice(-6)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        statusStyles[appointment.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="mb-3 rounded-lg bg-pink-50/70 p-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-pink-600" />
                      <p className="text-sm font-bold text-[#321b2b]">
                        {appointment.customerName}
                      </p>
                    </div>

                    <p className="mt-1 flex items-center gap-2 break-all text-xs text-[#806b78]">
                      <Mail size={13} />
                      {appointment.customerEmail}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                    <div className="col-span-2 flex items-center gap-2">
                      <Scissors size={16} className="text-pink-600" />
                      <div>
                        <p className="text-xs text-[#806b78]">Service</p>
                        <p className="text-sm font-semibold text-[#321b2b]">
                          {appointment.serviceName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-pink-600" />
                      <div>
                        <p className="text-xs text-[#806b78]">Date</p>
                        <p className="text-sm font-semibold text-[#321b2b]">
                          {formatDate(appointment.appointmentDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-pink-600" />
                      <div>
                        <p className="text-xs text-[#806b78]">Time</p>
                        <p className="text-sm font-semibold text-[#321b2b]">
                          {appointment.appointmentTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <IndianRupee size={16} className="text-pink-600" />
                      <div>
                        <p className="text-xs text-[#806b78]">Price</p>
                        <p className="text-sm font-semibold text-[#321b2b]">
                          ৳{appointment.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-pink-600" />
                      <div>
                        <p className="text-xs text-[#806b78]">Duration</p>
                        <p className="text-sm font-semibold text-[#321b2b]">
                          {appointment.duration} min
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-pink-100 pt-3">
                    <span className="text-xs text-[#806b78]">
                      Payment: <span className="font-semibold capitalize">{appointment.paymentStatus}</span>
                    </span>
                  </div>

                  {(appointment.status === "pending" ||
                    appointment.status === "confirmed") && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {appointment.status === "pending" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment, "confirmed")
                          }
                          disabled={updatingId === appointment._id}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle size={15} />
                          Confirm
                        </button>
                      )}

                      {appointment.status === "confirmed" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment, "completed")
                          }
                          disabled={updatingId === appointment._id}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle size={15} />
                          Complete
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleStatusUpdate(appointment, "cancelled")
                        }
                        disabled={updatingId === appointment._id}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                      >
                        <XCircle size={15} />
                        Cancel
                      </button>
                    </div>
                  )}

                  {updatingId === appointment._id && (
                    <p className="mt-2 text-center text-xs text-pink-600">
                      Updating appointment...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
