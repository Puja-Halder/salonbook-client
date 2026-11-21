
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Receipt,
  RefreshCw,
  CalendarDays,
  Clock,
  User,
  Scissors,
  Mail,
  LoaderCircle,
  CircleCheck,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getAllTransactions } from "@/lib/api";

export default function AdminTransactionsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error(
          "Authentication token not found. Please sign in again."
        );
      }

      const result = await getAllTransactions(tokenResult.data.token);

      setTransactions(result.transactions || []);
    } catch (error) {
      toast.error(error.message || "Failed to load transactions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      window.location.href = "/signin";
      return;
    }

    if (session.user.isBlocked) {
      window.location.href = "/";
      return;
    }

    if (session.user.role !== "admin") {
      window.location.href = "/dashboard/customer";
      return;
    }

    loadTransactions();
  }, [session, isPending, loadTransactions]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const formatDate = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
  };

  const totalTransactions = transactions.length;

  const totalRevenue = transactions.reduce(
    (total, transaction) => total + Number(transaction.price || 0),
    0
  );

  const averagePayment =
    totalTransactions > 0
      ? totalRevenue / totalTransactions
      : 0;

  if (isPending || loading && !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff3f7]">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#d94f83]" />
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff3f7]">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#d94f83]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff3f7] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#a34d70] transition hover:text-[#d94f83]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#d66b91]">
              Admin Dashboard
            </p>

            <h1 className="text-3xl font-bold text-[#54263d] sm:text-4xl">
              Transactions
            </h1>

            <p className="mt-2 text-sm text-[#a77a8e]">
              View completed demo payments and salon revenue.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#f2c7d7] bg-white px-5 py-3 text-sm font-semibold text-[#a34d70] shadow-sm transition hover:border-[#e99ab6] hover:bg-[#ffe7f0] disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#f5cbd9] bg-gradient-to-br from-white to-[#ffe5ef] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#a45c79]">
                  Total Transactions
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#a83e6b]">
                  {totalTransactions}
                </h2>
              </div>

              <div className="rounded-xl bg-[#fbd0e0] p-3 text-[#cf4e82]">
                <Receipt size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#f5cbd9] bg-gradient-to-br from-white to-[#fff0f5] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#a45c79]">
                  Total Revenue
                </p>

                <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                  {formatCurrency(totalRevenue)}
                </h2>
              </div>

              <div className="rounded-xl bg-[#e3f7ec] p-3 text-emerald-600">
                <Wallet size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#f5cbd9] bg-gradient-to-br from-white to-[#fff0f2] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#a45c79]">
                  Average Payment
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#a83e6b]">
                  {formatCurrency(averagePayment)}
                </h2>
              </div>

              <div className="rounded-xl bg-[#ffe0e3] p-3 text-[#cf4e82]">
                <DollarSign size={23} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#f3c8d8] bg-white">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#d94f83]" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-[#f3c8d8] bg-white px-6 py-16 text-center">
            <CreditCard className="mx-auto mb-4 h-12 w-12 text-[#e5a3ba]" />

            <h3 className="text-xl font-bold text-[#54263d]">
              No transactions yet
            </h3>

            <p className="mt-2 text-sm text-[#a77a8e]">
              Completed customer payments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#f3c8d8] bg-white shadow-sm">
            <div className="border-b border-[#f5dce5] bg-[#fff8fb] px-5 py-4">
              <h2 className="font-bold text-[#54263d]">
                Payment History

                <span className="ml-2 text-sm font-normal text-[#b17e93]">
                  ({totalTransactions})
                </span>
              </h2>
            </div>

            <div className="divide-y divide-[#f7e5ec]">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex flex-col gap-5 px-5 py-5 transition hover:bg-[#fff8fb]"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="flex items-center gap-2 font-bold text-[#54263d]">
                        <User size={17} className="text-[#d47a9a]" />
                        {transaction.customerName}
                      </h3>

                      <p className="mt-2 flex items-center gap-2 text-sm text-[#a77a8e]">
                        <Mail size={14} />
                        {transaction.customerEmail}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        <CircleCheck size={14} />
                        Paid
                      </span>

                      <span className="text-lg font-bold text-emerald-600">
                        {formatCurrency(transaction.price)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 rounded-xl bg-[#fff8fb] p-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="mb-1 text-xs font-medium text-[#b18b9b]">
                        Service
                      </p>

                      <p className="flex items-center gap-2 text-sm font-semibold text-[#54263d]">
                        <Scissors size={15} className="text-[#d47a9a]" />
                        {transaction.serviceName}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium text-[#b18b9b]">
                        Appointment Date
                      </p>

                      <p className="flex items-center gap-2 text-sm font-semibold text-[#54263d]">
                        <CalendarDays size={15} className="text-[#d47a9a]" />
                        {formatDate(transaction.appointmentDate)}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium text-[#b18b9b]">
                        Appointment Time
                      </p>

                      <p className="flex items-center gap-2 text-sm font-semibold text-[#54263d]">
                        <Clock size={15} className="text-[#d47a9a]" />
                        {transaction.appointmentTime}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium text-[#b18b9b]">
                        Payment Updated
                      </p>

                      <p className="flex items-center gap-2 text-sm font-semibold text-[#54263d]">
                        <CreditCard size={15} className="text-[#d47a9a]" />
                        {formatDate(transaction.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-5 text-center text-xs leading-5 text-[#b18b9b]">
          SalonBook uses simulated demo payments. These records do not represent
          actual financial transactions.
        </p>
      </div>
    </main>
  );
}
