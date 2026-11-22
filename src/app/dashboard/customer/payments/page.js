
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  CalendarDays,
  Clock,
  Scissors,
  CheckCircle2,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  Receipt,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";
import { getMyPaymentHistory } from "@/lib/api";

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
};

const formatPrice = (price) => {
  return `৳${Number(price || 0).toLocaleString("en-BD")}`;
};

export default function CustomerPaymentHistory() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard/customer");
    }
  };

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      if (!token) {
        throw new Error("Authentication token is missing. Please sign in again.");
      }

      const result = await getMyPaymentHistory(token);
      setPayments(result.payments || []);
    } catch (error) {
      setError(error.message || "Failed to load payment history.");
    } finally {
      setLoading(false);
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

    loadPayments();
  }, [session, isPending, router, loadPayments]);

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

  const totalPaid = payments.reduce(
    (total, payment) => total + Number(payment.price || 0),
    0
  );

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
              Payment History
            </h1>

            <p className="mt-3 text-[#806b78]">
              Welcome, {session.user.name}! Review your previous salon payments.
            </p>
          </div>

          <section className="mb-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <Receipt size={24} />
              </div>

              <p className="mt-4 text-sm font-medium text-[#806b78]">
                Total Payments
              </p>

              <p className="mt-2 text-3xl font-bold text-[#321b2b]">
                {loading ? "—" : payments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CreditCard size={24} />
              </div>

              <p className="mt-4 text-sm font-medium text-[#806b78]">
                Total Amount Paid
              </p>

              <p className="mt-2 text-3xl font-bold text-[#321b2b]">
                {loading ? "—" : formatPrice(totalPaid)}
              </p>
            </div>
          </section>

          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#321b2b]">
                  Your Transactions
                </h2>

                <p className="mt-1 text-sm text-[#806b78]">
                  A record of your successfully paid appointments
                </p>
              </div>

              <button
                onClick={loadPayments}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-semibold text-pink-700 transition hover:bg-pink-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

            {loading ? (
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
                  onClick={loadPayments}
                  className="mt-5 rounded-full bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                  Try Again
                </button>
              </div>
            ) : payments.length === 0 ? (
              <div className="rounded-2xl border border-pink-100 bg-white px-6 py-16 text-center">
                <CreditCard
                  className="mx-auto text-pink-400"
                  size={45}
                />

                <h3 className="mt-4 text-lg font-bold text-[#321b2b]">
                  No Payment History Yet
                </h3>

                <p className="mt-2 text-sm text-[#806b78]">
                  Your completed payments will appear here.
                </p>

                <Link
                  href="/services"
                  className="mt-6 inline-block rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                  Explore Services
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-lg font-bold text-[#321b2b]">
                          {payment.serviceName || "Salon Service"}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#806b78]">
                          <span className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-pink-600" />
                            {formatDate(payment.appointmentDate)}
                          </span>

                          <span className="flex items-center gap-2">
                            <Clock size={16} className="text-pink-600" />
                            {payment.appointmentTime || "Not available"}
                          </span>

                          <span className="flex items-center gap-2">
                            <Scissors size={16} className="text-pink-600" />
                            {payment.duration || 0} minutes
                          </span>
                        </div>

                        <p className="mt-3 text-xs text-[#806b78]">
                          Payment date: {formatDate(payment.updatedAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <p className="text-xs text-[#806b78]">
                            Amount Paid
                          </p>

                          <p className="mt-1 text-xl font-bold text-[#321b2b]">
                            {formatPrice(payment.price)}
                          </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                          <CheckCircle2 size={14} />
                          Paid
                        </span>
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
