"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmailQuery } from "@/redux/features/auth/userAuth";

const EmailVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("Verifying your email...");

  const { data, error } = useVerifyEmailQuery(token!, {
    skip: !token,
  });

  console.log(data, error);

  useEffect(() => {
    if (data?.success) {
      setMessage("✅ Your email has been verified! Redirecting...");
      setTimeout(() => router.push("/login"), 3000);
    } else if (error) {
      setMessage("❌ Invalid or expired verification link.");
    }
  }, [data, error, router]);

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h1>{message}</h1>
    </div>
  );
};

export default EmailVerification;
