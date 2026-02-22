// page.tsx (AuthGuard)
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const adminUsername = localStorage.getItem("adminUsername");
    const adminPass = localStorage.getItem("adminPass");
    const isLoginPage = pathname === "/login";

    if (!adminUsername || !adminPass) {
      if (!isLoginPage) router.replace("/login");
      else setReady(true); // login page dikhao
    } else {
      if (isLoginPage) router.replace("/dashboard");
      else setReady(true); // dashboard dikhao
    }
  }, [pathname, router]);

  // Spinner ki jagah invisible div — layout shift nahi hoga
  if (!ready) return (
    <div style={{ visibility: "hidden", height: "100vh" }} />
  );

  return <>{children}</>;
}