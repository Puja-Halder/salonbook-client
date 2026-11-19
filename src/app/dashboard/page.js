
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardRedirect() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

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

    if (session.user.role === "admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard/customer");
    }
  }, [session, isPending, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffafd]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
        <p className="mt-4 text-sm font-medium text-[#765b69]">
          Redirecting to your dashboard...
        </p>
      </div>
    </main>
  );
}
