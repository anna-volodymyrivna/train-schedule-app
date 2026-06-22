"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrain,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

interface User {
  username: string;
  email: string;
  role: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing user data", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const isAdmin = user?.role && String(user.role).toLowerCase() === "admin";

  return (
    <nav>
      <Link href="/">
        <h1>
          RailPlan <FontAwesomeIcon icon={faTrain} />
        </h1>
      </Link>
      <div className="nav-button">
        {user ? (
          <>
            <span className="username">
              {user.username}{" "}
              {isAdmin && <small>(Admin)</small>}
            </span>
            {isAdmin && (
              <button>
                <Link href="/admin">Admin Panel</Link>
              </button>
            )}
            <button>
              <Link href="/my-train">Create Train</Link>
            </button>
            <button onClick={handleLogout}>
              Log out <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          </>
        ) : (
          <>
            <button>
              <Link href="/login">Sign in</Link>
            </button>
            <button>
              <Link href="/register">Sign up</Link>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
