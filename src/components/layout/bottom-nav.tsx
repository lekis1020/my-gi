"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Bookmark, User, LogIn } from "lucide-react";
import { useMobileDrawer } from "@/components/layout/mobile-drawer-context";
import { useAuth } from "@/contexts/auth-context";

export function BottomNav() {
  const pathname = usePathname();
  const { toggle } = useMobileDrawer();
  const { user } = useAuth();

  const base =
    "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors";
  const active = "text-teal-600 dark:text-teal-400";
  const inactive = "text-gray-500 dark:text-gray-400";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 lg:hidden">
      <div
        className="mx-auto flex h-14 max-w-lg"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Link href="/" className={`${base} ${pathname === "/" ? active : inactive}`}>
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <button onClick={toggle} className={`${base} ${inactive}`}>
          <Layers className="h-5 w-5" />
          <span>Topics</span>
        </button>

        {user ? (
          <Link
            href="/bookmarks"
            className={`${base} ${pathname === "/bookmarks" ? active : inactive}`}
          >
            <Bookmark className="h-5 w-5" />
            <span>Saved</span>
          </Link>
        ) : (
          <span className={`${base} text-gray-300 dark:text-gray-600`}>
            <Bookmark className="h-5 w-5" />
            <span>Saved</span>
          </span>
        )}

        {user ? (
          <Link
            href="/account"
            className={`${base} ${pathname === "/account" ? active : inactive}`}
          >
            <User className="h-5 w-5" />
            <span>Account</span>
          </Link>
        ) : (
          <Link href="/login" className={`${base} ${pathname === "/login" ? active : inactive}`}>
            <LogIn className="h-5 w-5" />
            <span>Log in</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
