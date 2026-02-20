"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUsername = localStorage.getItem("adminUsername");
    const adminPass = localStorage.getItem("adminPass");

    const isLoginPage = pathname === "/login";

    if (!adminUsername || !adminPass) {
      if (!isLoginPage) {
        router.replace("/login");
      }
    } else {
      if (isLoginPage) {
        router.replace("/dashboard");
      }
    }

    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner" />
        <style jsx>{`
          .loader-container {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #ffffff;
          }

          .spinner {
            width: 50px;
            height: 50px;
            border: 6px solid #e0e0e0;
            border-top: 6px solid #0a3d47;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}