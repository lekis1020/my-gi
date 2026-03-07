"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Stethoscope } from "lucide-react";

export function Header() {
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
      </div>
    </header>
  );
}
