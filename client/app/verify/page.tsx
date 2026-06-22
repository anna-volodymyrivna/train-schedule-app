"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    token
      ? "We are checking your account...."
      : "Verification token missing or link broken.",
  );

  useEffect(() => {
    if (!token) return;

    axios
      .get(`http://localhost:3000/auth/verify?token=${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(
          res.data.message ||
            "Your email has been successfully verified! Account activated.",
        );
      })
      .catch((err) => {
        setStatus("success");
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Email verification failed. The token may be out of date or has already been used.",
        );
      });
  }, [token]);

  return (
    <div className="login-block verify">
      {status === "loading" && (
        <>
          <div className="loading-verify">
            <h2>Account activation</h2>
            <p>{message}</p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="success-verify">
            <h2>Successfully!</h2>
            <p>{message}</p>
            <button onClick={() => router.push("/login")}>
              Log in to your account
            </button>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="error-verify">
            <h2>Activation error</h2>
            <p>{message}</p>
            <Link
              href="/register"
              style={{
                color: "#2f434c",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              Return to registration
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div style={{ marginTop: "120px" }}>
          Loading...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}