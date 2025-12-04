"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useUse } from "@auth0/nextjs-auth0/client";
export default function AccountPage() {

console.log(user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        {user ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome, <span className="text-blue-600">{user.name}</span> 🎉
            </h2>
            <p className="text-gray-500">
              This is your account dashboard.
            </p>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              You are not logged in ❗
            </h2>
            <p className="text-gray-500 mb-6">
              Please login to access your account.
            </p>

            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
