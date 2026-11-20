
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldBan,
  RefreshCw,
  Mail,
  CalendarDays,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  getAllCustomers,
  updateCustomerBlockStatus,
} from "@/lib/api";

export default function AdminCustomersPage() {
  const { data: session, isPending } = authClient.useSession();

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadCustomers = useCallback(async (search = "") => {
    try {
      setLoading(true);

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const result = await getAllCustomers(
        tokenResult.data.token,
        search
      );

      setCustomers(result.customers || []);
    } catch (error) {
      toast.error(error.message || "Failed to load customers.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      window.location.href = "/signin";
      return;
    }

    if (session.user?.role !== "admin") {
      window.location.href = "/dashboard/customer";
      return;
    }

    loadCustomers();
  }, [session, isPending, loadCustomers]);

  useEffect(() => {
    if (isPending || session?.user?.role !== "admin") return;

    const timer = setTimeout(() => {
      loadCustomers(searchTerm);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, session, isPending, loadCustomers]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadCustomers(searchTerm);
  };

  const handleBlockStatus = async (customer) => {
    const nextStatus = !customer.isBlocked;

    const confirmed = window.confirm(
      nextStatus
        ? `Are you sure you want to block ${customer.name}?`
        : `Are you sure you want to unblock ${customer.name}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(customer._id);

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        throw new Error("Authentication token not found.");
      }

      await updateCustomerBlockStatus(
        customer._id,
        nextStatus,
        tokenResult.data.token
      );

      setCustomers((previous) =>
        previous.map((item) =>
          item._id === customer._id
            ? { ...item, isBlocked: nextStatus }
            : item
        )
      );

      toast.success(
        nextStatus
          ? "Customer blocked successfully."
          : "Customer unblocked successfully."
      );
    } catch (error) {
      toast.error(error.message || "Failed to update customer.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalCustomers = customers.length;
  const blockedCustomers = customers.filter(
    (customer) => customer.isBlocked
  ).length;
  const activeCustomers = totalCustomers - blockedCustomers;

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
              Customer Management
            </h1>

            <p className="mt-2 text-sm text-[#a77a8e]">
              View customers and manage their account access.
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
                  Total Customers
                </p>
                <h2 className="mt-2 text-3xl font-bold text-[#a83e6b]">
                  {totalCustomers}
                </h2>
              </div>
              <div className="rounded-xl bg-[#fbd0e0] p-3 text-[#cf4e82]">
                <Users size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#f5cbd9] bg-gradient-to-br from-white to-[#fff0f5] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#a45c79]">
                  Active Customers
                </p>
                <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                  {activeCustomers}
                </h2>
              </div>
              <div className="rounded-xl bg-[#e3f7ec] p-3 text-emerald-600">
                <UserCheck size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#f5cbd9] bg-gradient-to-br from-white to-[#fff0f2] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#a45c79]">
                  Blocked Customers
                </p>
                <h2 className="mt-2 text-3xl font-bold text-red-500">
                  {blockedCustomers}
                </h2>
              </div>
              <div className="rounded-xl bg-[#ffe0e3] p-3 text-red-500">
                <UserX size={23} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-[#f3c8d8] bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d47a9a]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search customers by name or email..."
              className="w-full rounded-xl border border-[#f0c7d6] bg-[#fff8fb] py-3 pl-12 pr-4 text-sm text-[#54263d] outline-none transition placeholder:text-[#c49aaa] focus:border-[#df6b96] focus:ring-2 focus:ring-[#fbd7e4]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#f3c8d8] bg-white">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#d94f83]" />
          </div>
        ) : customers.length === 0 ? (
          <div className="rounded-2xl border border-[#f3c8d8] bg-white px-6 py-16 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-[#e5a3ba]" />

            <h3 className="text-xl font-bold text-[#54263d]">
              No customers found
            </h3>

            <p className="mt-2 text-sm text-[#a77a8e]">
              {searchTerm
                ? "Try searching with another name or email."
                : "Registered customers will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#f3c8d8] bg-white shadow-sm">
            <div className="border-b border-[#f5dce5] bg-[#fff8fb] px-5 py-4">
              <h2 className="font-bold text-[#54263d]">
                Customer List
                <span className="ml-2 text-sm font-normal text-[#b17e93]">
                  ({customers.length})
                </span>
              </h2>
            </div>

            <div className="divide-y divide-[#f7e5ec]">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#fff8fb] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f5c5d7] bg-[#ffe3ed] text-lg font-bold text-[#bd4778]">
                      {customer.image ? (
                        <img
                          src={customer.image}
                          alt={customer.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        customer.name?.charAt(0)?.toUpperCase() || "C"
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-[#54263d]">
                        {customer.name}
                      </h3>

                      <p className="mt-1 flex items-center gap-2 truncate text-sm text-[#a77a8e]">
                        <Mail size={14} className="shrink-0 text-[#d47a9a]" />
                        {customer.email}
                      </p>

                      <p className="mt-1 flex items-center gap-2 text-xs text-[#b18b9b]">
                        <CalendarDays size={13} className="text-[#d47a9a]" />
                        Joined{" "}
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        customer.isBlocked
                          ? "bg-red-50 text-red-600"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {customer.isBlocked ? (
                        <ShieldBan size={14} />
                      ) : (
                        <ShieldCheck size={14} />
                      )}

                      {customer.isBlocked ? "Blocked" : "Active"}
                    </span>

                    <button
                      onClick={() => handleBlockStatus(customer)}
                      disabled={updatingId === customer._id}
                      className={`inline-flex min-w-28 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        customer.isBlocked
                          ? "bg-[#d94f83] text-white hover:bg-[#c83d72]"
                          : "border border-[#f0b7ca] bg-[#fff0f5] text-[#bd4778] hover:bg-[#ffdfeb]"
                      }`}
                    >
                      {updatingId === customer._id ? (
                        <LoaderCircle size={15} className="animate-spin" />
                      ) : customer.isBlocked ? (
                        <UserCheck size={15} />
                      ) : (
                        <UserX size={15} />
                      )}

                      {customer.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
