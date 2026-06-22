"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "../api/axio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/register", formData);

      setIsRegistered(true);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || "Registration error");
    }
  };

  return (
    <div className="register-block">
      {isRegistered ? (
        <div className="register-confirm">
          <h2>
            Account created!
          </h2>
          <p>
            An email with an activation link has been sent to your email address{" "}
            <strong style={{ color: "#308d7f" }}>{formData.email}</strong>{" "}
            Please confirm your email before logging in.
          </p>
          <button
            type="button"
            className="register-button"
            onClick={() => router.push("/login")}
          >
            Go to Sign In
          </button>
        </div>
      ) : (
        <>
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <div className="register-password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="register-button">
              Sign up
            </button>
          </form>
          <p className="login-register">
            Already have an account?{" "}
            <b>
              <Link
                href="/login"
                style={{ color: "#308d7f", textDecoration: "none" }}
              >
                Sign In
              </Link>
            </b>
          </p>
        </>
      )}
    </div>
  );
}
