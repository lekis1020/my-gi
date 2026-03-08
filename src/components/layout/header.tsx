"use client";

import Link from "next/link";
import { Stethoscope, LogIn, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300">
            <Stethoscope className="h-4 w-4" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            My GI
          </span>
        </Link>

        {!isLoading && (
          user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-full bg-gray-100 py-1.5 pl-2 pr-3 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <User className="h-4 w-4" />
              <span className="hidden text-xs font-medium sm:inline">
                {user.email?.split("@")[0]}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </Link>
          )
        )}
      </div>
    </header>
  );
}
